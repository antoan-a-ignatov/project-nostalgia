// Window manager state: pure functions only, no DOM access.
//
// Desk describes the desktop area above the taskbar plus the area the open Start menu
// covers in its bottom-left corner. The caller measures both and passes them in.

import { PORTRAIT_ID, type WindowId } from './windowIds.ts';

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Desk {
  w: number;
  h: number;
  menuW: number;
  menuH: number;
}

export interface WinState {
  rect: Rect;
  /** 0 for fixed placements, 1+ for cascade steps. */
  slot: number;
  minimized: boolean;
  maximized: boolean;
}

export interface WmState {
  wins: Partial<Record<WindowId, WinState>>;
  /** Taskbar order: the order windows were opened. */
  tasks: WindowId[];
  /** Stacking order, bottom to top. */
  order: WindowId[];
  active: WindowId | null;
}

export type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

export type WmAction =
  | { type: 'open'; id: WindowId; desk: Desk }
  | { type: 'close'; id: WindowId }
  | { type: 'focus'; id: WindowId }
  | { type: 'minimize'; id: WindowId }
  | { type: 'toggleMaximize'; id: WindowId }
  | { type: 'taskbar'; id: WindowId }
  | { type: 'move'; id: WindowId; x: number; y: number; desk: Desk }
  | { type: 'resize'; id: WindowId; start: Rect; dir: ResizeDir; dx: number; dy: number; desk: Desk }
  | { type: 'clampAll'; desk: Desk };

export const FRAME = 4;
export const TITLE_H = 32;
export const TITLE_GAP = 2;
export const MIN_W = 240;
export const MIN_H = 160;
export const MARGIN = 16;
export const PORTRAIT_IMG = 320;
export const PORTRAIT_W = PORTRAIT_IMG + FRAME * 2;
export const PORTRAIT_H = PORTRAIT_IMG + FRAME * 2 + TITLE_H + TITLE_GAP;
export const CASCADE_STEP = 40;

// The portrait can't be closed, so its taskbar button stays first.
const START_TASKS: WindowId[] = ['portrait', 'experience', 'about'];
const START_ORDER: WindowId[] = ['portrait', 'about', 'experience'];

const EXPERIENCE_MAX_W = 960;
const EXPERIENCE_MIN_BESIDE_MENU = 340;
/** Width kept for Experience before the About Me column is allowed to widen. */
const COLUMN_RESERVE = 720;
const ABOUT_MAX_W = Math.round(PORTRAIT_W * 1.5);
const ABOUT_MAX_H = 400;
/** A cascade step is used only if the window keeps at least this share of its default size there. */
const CASCADE_MIN_SHARE = 0.6;

const DEFAULT_SIZE = { w: 600, h: 400 };
const SIZES: Partial<Record<WindowId, { w: number; h: number }>> = {
  'cert-az104': { w: 600, h: 400 },
  'cert-aws': { w: 600, h: 400 },
  'project-1': { w: 800, h: 560 },
  'project-2': { w: 800, h: 560 },
  credits: { w: 660, h: 460 },
};

const sizeOf = (id: WindowId) => SIZES[id] ?? DEFAULT_SIZE;

/** Lower bound wins when lo > hi, so minimum sizes always hold. */
export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(v, hi));

/** Experience goes beside the Start menu area or above it, whichever gives the larger window. */
function experienceRect(desk: Desk, columnX: number): Rect {
  const besideX = desk.menuW + MARGIN;
  const beside = {
    x: besideX,
    y: MARGIN,
    w: Math.min(EXPERIENCE_MAX_W, columnX - MARGIN - besideX),
    h: desk.h - 2 * MARGIN,
  };
  const above = {
    x: MARGIN,
    y: MARGIN,
    w: Math.min(EXPERIENCE_MAX_W, columnX - 2 * MARGIN),
    h: desk.h - desk.menuH - 2 * MARGIN,
  };
  const besideFits = beside.w >= EXPERIENCE_MIN_BESIDE_MENU;
  const pick = besideFits && beside.w * beside.h >= above.w * above.h ? beside : above;
  return { ...pick, w: Math.max(MIN_W, pick.w), h: Math.max(MIN_H, pick.h) };
}

export function startRects(desk: Desk): Record<'experience' | 'portrait' | 'about', Rect> {
  const columnW = clamp(desk.w - (desk.menuW + MARGIN + COLUMN_RESERVE + 2 * MARGIN), PORTRAIT_W, ABOUT_MAX_W);
  const columnX = Math.max(MARGIN, desk.w - MARGIN - columnW);
  const belowPortrait = MARGIN + PORTRAIT_H + MARGIN / 2;
  const aboutH = clamp(desk.h - MARGIN - belowPortrait, MIN_H, ABOUT_MAX_H);
  const aboutY = Math.max(MARGIN, Math.min(belowPortrait, desk.h - MARGIN - aboutH));
  return {
    experience: experienceRect(desk, columnX),
    portrait: { x: desk.w - MARGIN - PORTRAIT_W, y: MARGIN, w: PORTRAIT_W, h: PORTRAIT_H },
    about: { x: columnX, y: aboutY, w: columnW, h: aboutH },
  };
}

/**
 * Credits opens beside About Me: its right edge overlaps About Me by one cascade step and
 * its top is one step below About Me's top. It moves up, then narrows, when space runs out.
 */
export function creditsRect(desk: Desk): Rect {
  const size = sizeOf('credits');
  const about = startRects(desk).about;
  const x = Math.max(desk.menuW + MARGIN, about.x + CASCADE_STEP - size.w);
  const y = Math.max(MARGIN, Math.min(about.y + CASCADE_STEP, desk.h - MARGIN - size.h));
  return { x, y, w: Math.min(size.w, desk.w - MARGIN - x), h: Math.min(size.h, desk.h - MARGIN - y) };
}

/** Cascade step `slot`, counted from the top-left corner right of the Start menu area. */
export function cascadeRect(id: WindowId, desk: Desk, slot: number): Rect {
  const size = sizeOf(id);
  const x = desk.menuW + MARGIN + slot * CASCADE_STEP;
  const y = MARGIN + slot * CASCADE_STEP;
  return { x, y, w: Math.min(size.w, desk.w - MARGIN - x), h: Math.min(size.h, desk.h - MARGIN - y) };
}

function fitsCascade(id: WindowId, r: Rect): boolean {
  const size = sizeOf(id);
  return r.w >= Math.max(MIN_W, size.w * CASCADE_MIN_SHARE) && r.h >= Math.max(MIN_H, size.h * CASCADE_MIN_SHARE);
}

const isStartWindow = (id: WindowId): id is 'experience' | 'portrait' | 'about' => START_TASKS.includes(id);

/**
 * Default placement for a window that is being opened. Start-state windows go back to their
 * start spot, Credits beside About Me, others one cascade step below the lowest open cascaded
 * window, so every open title bar stays visible. When the desktop runs out of room the
 * cascade starts again at step 1.
 */
export function placeWindow(id: WindowId, s: WmState, desk: Desk): { slot: number; rect: Rect } {
  if (isStartWindow(id)) return { slot: 0, rect: startRects(desk)[id] };
  if (id === 'credits') return { slot: 0, rect: creditsRect(desk) };
  const used = s.tasks.map((t) => s.wins[t]?.slot ?? 0);
  let slot = Math.max(0, ...used) + 1;
  let rect = cascadeRect(id, desk, slot);
  if (!fitsCascade(id, rect)) {
    slot = 1;
    rect = cascadeRect(id, desk, slot);
  }
  return { slot, rect };
}

/** Keeps the whole title bar inside the desktop area. The portrait never changes size. */
export function clampRect(id: WindowId, r: Rect, desk: Desk): Rect {
  const fixed = id === PORTRAIT_ID;
  const w = fixed ? r.w : clamp(r.w, MIN_W, desk.w);
  const h = fixed ? r.h : clamp(r.h, MIN_H, desk.h);
  return {
    x: clamp(r.x, 0, desk.w - w),
    y: clamp(r.y, 0, desk.h - FRAME - TITLE_H),
    w,
    h,
  };
}

/** Edges stop at the desktop bounds and at the minimum size. */
export function resizeRect(start: Rect, dir: ResizeDir, dx: number, dy: number, desk: Desk): Rect {
  let left = start.x;
  let top = start.y;
  let right = start.x + start.w;
  let bottom = start.y + start.h;
  if (dir.includes('w')) left = clamp(left + dx, 0, right - MIN_W);
  if (dir.includes('e')) right = clamp(right + dx, left + MIN_W, Math.max(desk.w, right));
  if (dir.includes('n')) top = clamp(top + dy, 0, bottom - MIN_H);
  if (dir.includes('s')) bottom = clamp(bottom + dy, top + MIN_H, Math.max(desk.h, bottom));
  return { x: left, y: top, w: right - left, h: bottom - top };
}

/** Where a window is drawn: maximized windows fill the desktop area. */
export function visibleRect(win: WinState, desk: Desk): Rect {
  return win.maximized ? { x: 0, y: 0, w: desk.w, h: desk.h } : win.rect;
}

function newWin(id: WindowId, s: WmState, desk: Desk): WinState {
  const { slot, rect } = placeWindow(id, s, desk);
  return { rect: clampRect(id, rect, desk), slot, minimized: false, maximized: false };
}

export function initialState(desk: Desk): WmState {
  const empty: WmState = { wins: {}, tasks: [], order: [], active: null };
  const wins: WmState['wins'] = {};
  for (const id of START_TASKS) wins[id] = newWin(id, empty, desk);
  return { wins, tasks: [...START_TASKS], order: [...START_ORDER], active: 'experience' };
}

const patch = (s: WmState, id: WindowId, p: Partial<WinState>): WmState => {
  const win = s.wins[id];
  return win ? { ...s, wins: { ...s.wins, [id]: { ...win, ...p } } } : s;
};

const raise = (order: WindowId[], id: WindowId) => [...order.filter((o) => o !== id), id];

function topVisible(s: WmState): WindowId | null {
  for (let i = s.order.length - 1; i >= 0; i--) {
    const id = s.order[i];
    if (!s.wins[id]?.minimized) return id;
  }
  return null;
}

function focus(s: WmState, id: WindowId): WmState {
  const win = s.wins[id];
  if (!win) return s;
  const next = win.minimized ? patch(s, id, { minimized: false }) : s;
  return { ...next, order: raise(next.order, id), active: id };
}

function open(s: WmState, id: WindowId, desk: Desk): WmState {
  if (s.wins[id]) return focus(s, id);
  return {
    wins: { ...s.wins, [id]: newWin(id, s, desk) },
    tasks: [...s.tasks, id],
    order: [...s.order, id],
    active: id,
  };
}

/** The portrait can be minimized but never closed or maximized. */
function close(s: WmState, id: WindowId): WmState {
  if (!s.wins[id] || id === PORTRAIT_ID) return s;
  const wins = { ...s.wins };
  delete wins[id];
  const next: WmState = {
    wins,
    tasks: s.tasks.filter((t) => t !== id),
    order: s.order.filter((o) => o !== id),
    active: s.active,
  };
  return s.active === id ? { ...next, active: topVisible(next) } : next;
}

function minimize(s: WmState, id: WindowId): WmState {
  if (!s.wins[id]) return s;
  const next = patch(s, id, { minimized: true });
  return s.active === id ? { ...next, active: topVisible(next) } : next;
}

function toggleMaximize(s: WmState, id: WindowId): WmState {
  const win = s.wins[id];
  if (!win || id === PORTRAIT_ID) return s;
  return focus(patch(s, id, { maximized: !win.maximized }), id);
}

function taskbarClick(s: WmState, id: WindowId): WmState {
  const win = s.wins[id];
  if (!win) return s;
  if (win.minimized) return focus(s, id);
  if (s.active === id) return minimize(s, id);
  return focus(s, id);
}

export function reduce(s: WmState, a: WmAction): WmState {
  switch (a.type) {
    case 'open':
      return open(s, a.id, a.desk);
    case 'close':
      return close(s, a.id);
    case 'focus':
      return s.active === a.id ? s : focus(s, a.id);
    case 'minimize':
      return minimize(s, a.id);
    case 'toggleMaximize':
      return toggleMaximize(s, a.id);
    case 'taskbar':
      return taskbarClick(s, a.id);
    case 'move': {
      const win = s.wins[a.id];
      if (!win || win.maximized) return s;
      return patch(s, a.id, { rect: clampRect(a.id, { ...win.rect, x: a.x, y: a.y }, a.desk) });
    }
    case 'resize': {
      const win = s.wins[a.id];
      if (!win || win.maximized || a.id === PORTRAIT_ID) return s;
      return patch(s, a.id, { rect: resizeRect(a.start, a.dir, a.dx, a.dy, a.desk) });
    }
    case 'clampAll': {
      const wins: WmState['wins'] = {};
      for (const id of s.tasks) {
        const win = s.wins[id];
        if (win) wins[id] = { ...win, rect: clampRect(id, win.rect, a.desk) };
      }
      return { ...s, wins };
    }
  }
}

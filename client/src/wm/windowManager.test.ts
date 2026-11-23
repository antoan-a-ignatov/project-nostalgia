import { describe, expect, it } from 'vitest';
import {
  CASCADE_STEP,
  FRAME,
  MARGIN,
  MIN_H,
  MIN_W,
  PORTRAIT_H,
  PORTRAIT_W,
  TITLE_H,
  creditsRect,
  initialState,
  reduce,
  startRects,
  visibleRect,
  type Desk,
  type Rect,
  type WmAction,
  type WmState,
} from './windowManager.ts';
import { WINDOW_IDS, type WindowId } from './windowIds.ts';

// Desktop sizes measured in the browser: viewport minus the 46px taskbar, menu area per breakpoint.
const FULL_HD: Desk = { w: 1920, h: 1034, menuW: 334, menuH: 464 };
const LAPTOP: Desk = { w: 1366, h: 722, menuW: 334, menuH: 408 };
const SMALL: Desk = { w: 1024, h: 722, menuW: 334, menuH: 408 };
const SHORT: Desk = { w: 768, h: 454, menuW: 304, menuH: 340 };

const run = (s: WmState, ...actions: WmAction[]) => actions.reduce(reduce, s);
const open = (id: WindowId, desk: Desk = FULL_HD): WmAction => ({ type: 'open', id, desk });
const rectOf = (s: WmState, id: WindowId): Rect => {
  const win = s.wins[id];
  if (!win) throw new Error(`${id} is not open`);
  return win.rect;
};
const overlapsMenu = (r: Rect, desk: Desk) => r.x < desk.menuW && r.y + r.h > desk.h - desk.menuH;

describe('start state', () => {
  it('opens Experience, the portrait and About Me with Experience active', () => {
    const s = initialState(FULL_HD);
    expect(s.tasks).toEqual(['experience', 'portrait', 'about']);
    expect(s.order).toEqual(['portrait', 'about', 'experience']);
    expect(s.active).toBe('experience');
  });

  it('puts the portrait top-right and About Me under it', () => {
    const { portrait, about } = startRects(FULL_HD);
    expect(portrait).toEqual({ x: FULL_HD.w - MARGIN - PORTRAIT_W, y: MARGIN, w: PORTRAIT_W, h: PORTRAIT_H });
    expect(about.y).toBeGreaterThanOrEqual(portrait.y + portrait.h);
    expect(about.x + about.w).toBe(portrait.x + portrait.w);
  });

  it('widens About Me up to 1.5x the portrait when there is room', () => {
    expect(startRects(FULL_HD).about.w).toBe(Math.round(PORTRAIT_W * 1.5));
    expect(startRects(SMALL).about.w).toBe(PORTRAIT_W);
  });

  it('places Experience beside the menu area on wide desktops and above it on narrow ones', () => {
    const wide = startRects(FULL_HD).experience;
    expect(wide.x).toBe(FULL_HD.menuW + MARGIN);
    expect(wide.w).toBe(960);
    const narrow = startRects(SMALL).experience;
    expect(narrow.x).toBe(MARGIN);
    expect(narrow.y + narrow.h).toBeLessThanOrEqual(SMALL.h - SMALL.menuH);
  });

  it('keeps Experience at its minimum height when nothing fits above the menu', () => {
    expect(startRects(SHORT).experience.h).toBe(MIN_H);
  });

  it.each([
    ['1920x1080', FULL_HD],
    ['1366x768', LAPTOP],
    ['1024x768', SMALL],
  ])('opens no window under the Start menu area at %s', (_, desk) => {
    let s = initialState(desk);
    for (const id of WINDOW_IDS) s = reduce(s, open(id, desk));
    for (const id of WINDOW_IDS) expect(overlapsMenu(rectOf(s, id), desk), id).toBe(false);
  });
});

describe('open, focus and close', () => {
  it('adds a new window on top, active, at the end of the taskbar', () => {
    const s = run(initialState(FULL_HD), open('credits'));
    expect(s.tasks.at(-1)).toBe('credits');
    expect(s.order.at(-1)).toBe('credits');
    expect(s.active).toBe('credits');
  });

  it('focuses an open window instead of opening a duplicate', () => {
    const s = run(initialState(FULL_HD), open('about'));
    expect(s.tasks.filter((t) => t === 'about')).toHaveLength(1);
    expect(s.order.at(-1)).toBe('about');
    expect(s.active).toBe('about');
  });

  it('restores a minimized window when it is opened again', () => {
    const s = run(initialState(FULL_HD), { type: 'minimize', id: 'about' }, open('about'));
    expect(s.wins.about?.minimized).toBe(false);
    expect(s.active).toBe('about');
  });

  it('brings a window to the front on focus and returns the same state if already active', () => {
    const start = initialState(FULL_HD);
    expect(reduce(start, { type: 'focus', id: 'experience' })).toBe(start);
    const s = reduce(start, { type: 'focus', id: 'portrait' });
    expect(s.order.at(-1)).toBe('portrait');
    expect(s.active).toBe('portrait');
  });

  it('removes a closed window from the taskbar and activates the top visible one', () => {
    const s = run(initialState(FULL_HD), open('credits'), { type: 'close', id: 'credits' });
    expect(s.wins.credits).toBeUndefined();
    expect(s.tasks).not.toContain('credits');
    expect(s.order).not.toContain('credits');
    expect(s.active).toBe('experience');
  });

  it('reopens a closed start window at its start spot, not where it was moved', () => {
    const s = run(
      initialState(FULL_HD),
      { type: 'move', id: 'about', x: 500, y: 300, desk: FULL_HD },
      { type: 'close', id: 'about' },
      open('about'),
    );
    expect(rectOf(s, 'about')).toEqual(startRects(FULL_HD).about);
  });
});

describe('minimize and taskbar', () => {
  it('hides a minimized window and activates the next visible one', () => {
    const s = run(initialState(FULL_HD), { type: 'minimize', id: 'experience' });
    expect(s.wins.experience?.minimized).toBe(true);
    expect(s.tasks).toContain('experience');
    expect(s.active).toBe('about');
  });

  it('leaves nothing active when every window is minimized', () => {
    const s = run(
      initialState(FULL_HD),
      { type: 'minimize', id: 'experience' },
      { type: 'minimize', id: 'about' },
      { type: 'minimize', id: 'portrait' },
    );
    expect(s.active).toBeNull();
  });

  it('restores a minimized window from the taskbar', () => {
    const s = run(initialState(FULL_HD), { type: 'minimize', id: 'about' }, { type: 'taskbar', id: 'about' });
    expect(s.wins.about?.minimized).toBe(false);
    expect(s.active).toBe('about');
  });

  it('minimizes the active window from the taskbar', () => {
    const s = run(initialState(FULL_HD), { type: 'taskbar', id: 'experience' });
    expect(s.wins.experience?.minimized).toBe(true);
  });

  it('focuses an inactive window from the taskbar', () => {
    const s = run(initialState(FULL_HD), { type: 'taskbar', id: 'about' });
    expect(s.active).toBe('about');
    expect(s.wins.about?.minimized).toBe(false);
  });
});

describe('maximize', () => {
  it('fills the desktop and restores the previous rect', () => {
    const before = rectOf(initialState(FULL_HD), 'experience');
    const max = run(initialState(FULL_HD), { type: 'toggleMaximize', id: 'experience' });
    const win = max.wins.experience;
    if (!win) throw new Error('missing');
    expect(visibleRect(win, FULL_HD)).toEqual({ x: 0, y: 0, w: FULL_HD.w, h: FULL_HD.h });
    const restored = reduce(max, { type: 'toggleMaximize', id: 'experience' });
    expect(restored.wins.experience?.maximized).toBe(false);
    expect(rectOf(restored, 'experience')).toEqual(before);
  });

  it('focuses the window it maximizes', () => {
    const s = run(initialState(FULL_HD), { type: 'toggleMaximize', id: 'about' });
    expect(s.active).toBe('about');
  });

  it('ignores move and resize while maximized', () => {
    const max = run(initialState(FULL_HD), { type: 'toggleMaximize', id: 'about' });
    const start = rectOf(max, 'about');
    expect(reduce(max, { type: 'move', id: 'about', x: 0, y: 0, desk: FULL_HD })).toBe(max);
    expect(reduce(max, { type: 'resize', id: 'about', start, dir: 'se', dx: 50, dy: 50, desk: FULL_HD })).toBe(max);
  });
});

describe('move and clamp', () => {
  const moveTo = (x: number, y: number) => rectOf(reduce(initialState(FULL_HD), { type: 'move', id: 'about', x, y, desk: FULL_HD }), 'about');

  it('keeps the title bar inside the desktop', () => {
    expect(moveTo(-500, -500)).toMatchObject({ x: 0, y: 0 });
    const r = moveTo(5000, 5000);
    expect(r.x).toBe(FULL_HD.w - r.w);
    expect(r.y).toBe(FULL_HD.h - FRAME - TITLE_H);
  });

  it('re-clamps every window when the desktop shrinks', () => {
    const s = reduce(initialState(FULL_HD), { type: 'clampAll', desk: SMALL });
    for (const id of s.tasks) {
      const r = rectOf(s, id);
      expect(r.x + r.w, id).toBeLessThanOrEqual(SMALL.w);
      expect(r.h, id).toBeLessThanOrEqual(SMALL.h);
    }
  });
});

describe('resize', () => {
  // Experience has free space on every side at 1920x1080.
  const start = () => rectOf(initialState(FULL_HD), 'experience');
  const resize = (dir: 'se' | 'nw' | 'e', dx: number, dy: number) =>
    rectOf(
      reduce(initialState(FULL_HD), { type: 'resize', id: 'experience', start: start(), dir, dx, dy, desk: FULL_HD }),
      'experience',
    );

  it('grows from the bottom-right corner', () => {
    const s = start();
    expect(resize('se', 20, 10)).toEqual({ ...s, w: s.w + 20, h: s.h + 10 });
  });

  it('stops at the minimum size and keeps the opposite edge fixed', () => {
    const s = start();
    const r = resize('nw', 5000, 5000);
    expect(r.w).toBe(MIN_W);
    expect(r.h).toBe(MIN_H);
    expect(r.x + r.w).toBe(s.x + s.w);
    expect(r.y + r.h).toBe(s.y + s.h);
  });

  it('stops at the desktop edge', () => {
    const r = resize('e', 5000, 0);
    expect(r.x + r.w).toBe(FULL_HD.w);
  });
});

describe('portrait', () => {
  it('can be minimized and restored', () => {
    const s = run(initialState(FULL_HD), { type: 'minimize', id: 'portrait' });
    expect(s.wins.portrait?.minimized).toBe(true);
    expect(reduce(s, { type: 'taskbar', id: 'portrait' }).wins.portrait?.minimized).toBe(false);
  });

  it('can be minimized from the taskbar when active', () => {
    const s = run(initialState(FULL_HD), { type: 'focus', id: 'portrait' }, { type: 'taskbar', id: 'portrait' });
    expect(s.wins.portrait?.minimized).toBe(true);
  });

  it('ignores close, maximize and resize', () => {
    const s = initialState(FULL_HD);
    const start = rectOf(s, 'portrait');
    expect(reduce(s, { type: 'close', id: 'portrait' })).toBe(s);
    expect(reduce(s, { type: 'toggleMaximize', id: 'portrait' })).toBe(s);
    expect(reduce(s, { type: 'resize', id: 'portrait', start, dir: 'se', dx: 50, dy: 50, desk: FULL_HD })).toBe(s);
  });

  it('keeps its size when moved or clamped', () => {
    const s = run(
      initialState(FULL_HD),
      { type: 'move', id: 'portrait', x: 5000, y: 5000, desk: FULL_HD },
      { type: 'clampAll', desk: SMALL },
    );
    expect(rectOf(s, 'portrait')).toMatchObject({ w: PORTRAIT_W, h: PORTRAIT_H });
  });
});

describe('cascade', () => {
  const cascaded: WindowId[] = ['cert-az104', 'project-1', 'cert-aws', 'project-2'];

  it('opens each window one step below and right of the previous one', () => {
    let s = initialState(FULL_HD);
    for (const id of cascaded) s = reduce(s, open(id));
    cascaded.forEach((id, i) => {
      expect(rectOf(s, id)).toMatchObject({
        x: FULL_HD.menuW + MARGIN + (i + 1) * CASCADE_STEP,
        y: MARGIN + (i + 1) * CASCADE_STEP,
      });
    });
  });

  it('continues below the lowest open window after one in the middle closes', () => {
    const s = run(initialState(FULL_HD), open('cert-az104'), open('cert-aws'), { type: 'close', id: 'cert-az104' }, open('project-1'));
    expect(s.wins['project-1']?.slot).toBe(3);
  });

  it('starts again at step 1 when the next step would not fit', () => {
    // At 768x500 step 2 would leave Project 1 under 60% of its default width.
    const s = run(initialState(SHORT), open('cert-az104', SHORT), open('project-1', SHORT));
    expect(s.wins['cert-az104']?.slot).toBe(1);
    expect(s.wins['project-1']?.slot).toBe(1);
  });

  it('narrows a window to fit the desktop', () => {
    const s = run(initialState(SMALL), open('project-1', SMALL));
    const r = rectOf(s, 'project-1');
    expect(r.x + r.w).toBeLessThanOrEqual(SMALL.w - MARGIN);
  });
});

describe('credits', () => {
  it('opens beside About Me, overlapping it by one step, one step below its top', () => {
    const about = startRects(FULL_HD).about;
    const r = creditsRect(FULL_HD);
    expect(r.x + r.w).toBe(about.x + CASCADE_STEP);
    expect(r.y).toBe(about.y + CASCADE_STEP);
  });

  it('moves up to fit a short desktop and stays right of the menu area', () => {
    const r = creditsRect(SMALL);
    expect(r.y + r.h).toBeLessThanOrEqual(SMALL.h - MARGIN);
    expect(r.x).toBeGreaterThanOrEqual(SMALL.menuW + MARGIN);
  });
});

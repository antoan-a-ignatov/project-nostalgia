import { useEffect, useRef, type MouseEvent, type PointerEvent, type ReactNode } from 'react';
import { EASTER_EGG } from '../../content/easterEgg.ts';
import { UI } from '../../content/ui.ts';
import { recordClick } from '../../wm/rapidClicks.ts';
import { visibleRect, type Desk, type Rect, type ResizeDir, type WinState, type WmAction } from '../../wm/windowManager.ts';
import { PORTRAIT_ID, type WindowId } from '../../wm/windowIds.ts';
import styles from './Window.module.css';
import WindowButtonIcon from './WindowButtonIcon.tsx';

const RESIZE_DIRS: ResizeDir[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

interface WindowProps {
  id: WindowId;
  title: string;
  win: WinState;
  desk: Desk;
  active: boolean;
  zIndex: number;
  /** Changes when keyboard focus should move into this window's content. */
  focusToken: number;
  dispatch: (action: WmAction) => void;
  children: ReactNode;
}

interface Gesture {
  pointerId: number;
  dir: ResizeDir | null;
  startX: number;
  startY: number;
  start: Rect;
}

export default function Window({ id, title, win, desk, active, zIndex, focusToken, dispatch, children }: WindowProps) {
  const gesture = useRef<Gesture | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const minimizeRef = useRef<HTMLButtonElement>(null);
  const closeClicks = useRef<number[]>([]);
  const isPortrait = id === PORTRAIT_ID;
  const titleId = `title-${id}`;
  const r = visibleRect(win, desk);

  // The portrait has no scrollable content, so its Minimize button takes focus instead.
  useEffect(() => {
    if (focusToken > 0) (scrollRef.current ?? minimizeRef.current)?.focus({ preventScroll: true });
  }, [focusToken]);

  const beginGesture = (e: PointerEvent<HTMLElement>, dir: ResizeDir | null) => {
    if (e.button !== 0 || win.maximized) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    gesture.current = { pointerId: e.pointerId, dir, startX: e.clientX, startY: e.clientY, start: win.rect };
    e.preventDefault();
  };

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const g = gesture.current;
    if (!g || g.pointerId !== e.pointerId) return;
    const dx = e.clientX - g.startX;
    const dy = e.clientY - g.startY;
    if (g.dir) dispatch({ type: 'resize', id, start: g.start, dir: g.dir, dx, dy, desk });
    else dispatch({ type: 'move', id, x: g.start.x + dx, y: g.start.y + dy, desk });
  };

  const endGesture = () => {
    gesture.current = null;
  };

  const gestureHandlers = {
    onPointerMove,
    onPointerUp: endGesture,
    onPointerCancel: endGesture,
    onLostPointerCapture: endGesture,
  };

  // Opens the hidden link only after a rapid burst of clicks on the portrait's Close button.
  const onPortraitClose = (e: MouseEvent<HTMLButtonElement>) => {
    const r = recordClick(closeClicks.current, e.timeStamp, EASTER_EGG.clicks, EASTER_EGG.withinMs);
    closeClicks.current = r.times;
    if (r.triggered) window.open(EASTER_EGG.url, '_blank', 'noopener,noreferrer');
  };

  const onTitlePointerDown = (e: PointerEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    beginGesture(e, null);
  };

  return (
    <section
      className={`${styles.win} ${active ? styles.active : ''}`}
      style={{ left: r.x, top: r.y, width: r.w, height: r.h, zIndex }}
      hidden={win.minimized}
      aria-labelledby={titleId}
      onPointerDownCapture={() => {
        if (!active) dispatch({ type: 'focus', id });
      }}
    >
      <div
        className={styles.title}
        onPointerDown={onTitlePointerDown}
        onDoubleClick={(e) => {
          if (!(e.target as HTMLElement).closest('button')) dispatch({ type: 'toggleMaximize', id });
        }}
        {...gestureHandlers}
      >
        <span className={styles.titleText} id={titleId}>
          {title}
        </span>
        <button
          ref={minimizeRef}
          type="button"
          className={styles.button}
          aria-label={UI.minimize}
          onClick={() => dispatch({ type: 'minimize', id })}
        >
          <WindowButtonIcon name="minimize" />
        </button>
        {isPortrait ? (
          <>
            {/* The portrait can't be maximized or closed. Both buttons look like the others;
                Maximize does nothing and Close only reacts to a rapid burst of clicks. */}
            <button type="button" className={styles.button} aria-label={UI.maximize} aria-disabled="true">
              <WindowButtonIcon name="maximize" />
            </button>
            <button
              type="button"
              className={`${styles.button} ${styles.close}`}
              aria-label={UI.close}
              onClick={onPortraitClose}
            >
              <WindowButtonIcon name="close" />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className={styles.button}
              aria-label={win.maximized ? UI.restore : UI.maximize}
              onClick={() => dispatch({ type: 'toggleMaximize', id })}
            >
              <WindowButtonIcon name={win.maximized ? 'restore' : 'maximize'} />
            </button>
            <button
              type="button"
              className={`${styles.button} ${styles.close}`}
              aria-label={UI.close}
              onClick={() => dispatch({ type: 'close', id })}
            >
              <WindowButtonIcon name="close" />
            </button>
          </>
        )}
      </div>
      {isPortrait ? (
        <div className={styles.portraitBody}>{children}</div>
      ) : (
        <>
          <div className={styles.body}>
            <div ref={scrollRef} className={styles.scroll} tabIndex={0} role="region" aria-labelledby={titleId}>
              {children}
            </div>
          </div>
          {!win.maximized &&
            RESIZE_DIRS.map((dir) => (
              <div
                key={dir}
                className={`${styles.grip} ${styles[`grip-${dir}`]}`}
                onPointerDown={(e) => beginGesture(e, dir)}
                {...gestureHandlers}
              />
            ))}
        </>
      )}
    </section>
  );
}

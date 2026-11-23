import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react';
import { UI } from '../../content/ui.ts';
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
  const isPortrait = id === PORTRAIT_ID;
  const titleId = `title-${id}`;
  const r = visibleRect(win, desk);

  useEffect(() => {
    if (focusToken > 0) scrollRef.current?.focus({ preventScroll: true });
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
          type="button"
          className={styles.button}
          aria-label={UI.minimize}
          onClick={() => dispatch({ type: 'minimize', id })}
        >
          <WindowButtonIcon name="minimize" />
        </button>
        {isPortrait ? (
          <>
            {/* The portrait can't be maximized or closed: both buttons are shown but inert. */}
            <button type="button" className={styles.button} aria-label={UI.maximize} aria-disabled="true">
              <WindowButtonIcon name="maximize" />
            </button>
            {/* <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer"> */}
            <button type="button" className={`${styles.button} ${styles.close}`} aria-label={UI.close} aria-disabled="true">
              <WindowButtonIcon name="close" />
            </button>
            {/* </a> */}
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

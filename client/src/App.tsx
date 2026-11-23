import { useLayoutEffect, useReducer, useRef, useState } from 'react';
import PhoneHome from './components/Phone/PhoneHome.tsx';
import Taskbar, { type TaskButton } from './components/Taskbar/Taskbar.tsx';
import Window from './components/Window/Window.tsx';
import WindowBody from './components/WindowBody/WindowBody.tsx';
import { UI } from './content/ui.ts';
import { WINDOW_TITLES } from './content/windows.ts';
import { useMediaQuery } from './hooks/useMediaQuery.ts';
import { initialState, reduce, type Desk, type WmAction, type WmState } from './wm/windowManager.ts';
import type { WindowId } from './wm/windowIds.ts';
import styles from './App.module.css';

type AppAction = WmAction | { type: 'sync'; desk: Desk };

// The window state starts empty until the desktop has been measured once.
function appReducer(state: WmState | null, action: AppAction): WmState | null {
  if (action.type === 'sync') return state ? reduce(state, { type: 'clampAll', desk: action.desk }) : initialState(action.desk);
  return state ? reduce(state, action) : state;
}

const sameDesk = (a: Desk | null, b: Desk) =>
  a !== null && a.w === b.w && a.h === b.h && a.menuW === b.menuW && a.menuH === b.menuH;

/** Phones and short landscape screens get the launcher layout instead of the desktop. */
const PHONE_QUERY = '(max-width: 767px), (max-height: 499px)';

export default function App() {
  const isPhone = useMediaQuery(PHONE_QUERY);
  return isPhone ? <PhoneHome /> : <Desktop />;
}

// Desktop window state lives in this component. Switching to the phone layout and back
// starts the desktop fresh, the same as a reload.
function Desktop() {
  const desktopRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [desk, setDesk] = useState<Desk | null>(null);
  const [wm, dispatch] = useReducer(appReducer, null);
  const [focusRequest, setFocusRequest] = useState<{ id: WindowId | null; token: number }>({ id: null, token: 0 });

  // Measures the desktop area and the area the Start menu covers. ResizeObserver reports
  // once right after observe(), before the first paint, and again on every size change.
  useLayoutEffect(() => {
    const desktop = desktopRef.current;
    const menu = menuRef.current;
    if (!desktop || !menu) return;
    const observer = new ResizeObserver(() => {
      const d = desktop.getBoundingClientRect();
      const m = menu.getBoundingClientRect();
      const next: Desk = {
        w: desktop.clientWidth,
        h: desktop.clientHeight,
        menuW: Math.ceil(m.right - d.left),
        menuH: Math.ceil(d.bottom - m.top),
      };
      setDesk((prev) => (sameDesk(prev, next) ? prev : next));
      dispatch({ type: 'sync', desk: next });
    });
    observer.observe(desktop);
    observer.observe(menu);
    return () => observer.disconnect();
  }, []);

  const requestFocus = (id: WindowId) => setFocusRequest((f) => ({ id, token: f.token + 1 }));

  const openWindow = (id: WindowId) => {
    if (!desk) return;
    dispatch({ type: 'open', id, desk });
    requestFocus(id);
  };

  const onTaskClick = (id: WindowId) => {
    const wasMinimized = wm?.wins[id]?.minimized;
    dispatch({ type: 'taskbar', id });
    if (wasMinimized) requestFocus(id);
  };

  const tasks: TaskButton[] =
    wm?.tasks.map((id) => ({
      id,
      title: WINDOW_TITLES[id],
      active: wm.active === id && !wm.wins[id]?.minimized,
    })) ?? [];

  return (
    <>
      <main ref={desktopRef} className={styles.desktop} aria-label={UI.desktop}>
        {wm &&
          desk &&
          wm.tasks.map((id) => {
            const win = wm.wins[id];
            if (!win) return null;
            return (
              <Window
                key={id}
                id={id}
                title={WINDOW_TITLES[id]}
                win={win}
                desk={desk}
                active={wm.active === id}
                zIndex={wm.order.indexOf(id) + 1}
                focusToken={focusRequest.id === id ? focusRequest.token : 0}
                dispatch={dispatch}
              >
                <WindowBody id={id} />
              </Window>
            );
          })}
      </main>
      <Taskbar menuRef={menuRef} tasks={tasks} onTaskClick={onTaskClick} onOpenWindow={openWindow} />
    </>
  );
}

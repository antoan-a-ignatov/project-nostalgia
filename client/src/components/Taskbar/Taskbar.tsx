// PLACEHOLDER: the Start logo is placeholder art (monitor icon), replaced by Antoan's pixel art.
import { useEffect, useRef, useState, type RefObject } from 'react';
import { UI } from '../../content/ui.ts';
import PixelIcon from '../../icons/PixelIcon.tsx';
import type { WindowId } from '../../wm/windowIds.ts';
import StartMenu from '../StartMenu/StartMenu.tsx';
import Clock from './Clock.tsx';
import styles from './Taskbar.module.css';

export interface TaskButton {
  id: WindowId;
  title: string;
  active: boolean;
}

interface TaskbarProps {
  /** Shared with the parent, which measures the menu to keep windows out of its area. */
  menuRef: RefObject<HTMLDivElement | null>;
  tasks: readonly TaskButton[];
  onTaskClick: (id: WindowId) => void;
  onOpenWindow: (id: WindowId) => void;
}

const MENU_ID = 'start-menu';

export default function Taskbar({ menuRef, tasks, onTaskClick, onOpenWindow }: TaskbarProps) {
  const [menu, setMenu] = useState({ open: false, session: 0, focusFirst: false });
  const startRef = useRef<HTMLButtonElement>(null);

  const openMenu = (focusFirst: boolean) => setMenu((m) => ({ open: true, session: m.session + 1, focusFirst }));
  const closeMenu = (returnFocus: boolean) => {
    setMenu((m) => ({ ...m, open: false }));
    if (returnFocus) startRef.current?.focus();
  };

  // Click outside or Esc closes the menu.
  useEffect(() => {
    if (!menu.open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (menuRef.current?.contains(target) || startRef.current?.contains(target)) return;
      setMenu((m) => ({ ...m, open: false }));
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMenu((m) => ({ ...m, open: false }));
      startRef.current?.focus();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menu.open, menuRef]);

  return (
    <>
      <StartMenu
        ref={menuRef}
        id={MENU_ID}
        open={menu.open}
        session={menu.session}
        focusFirst={menu.focusFirst}
        onClose={closeMenu}
        onOpenWindow={onOpenWindow}
      />
      <footer className={styles.taskbar}>
        <button
          ref={startRef}
          type="button"
          className={styles.start}
          aria-haspopup="menu"
          aria-expanded={menu.open}
          aria-controls={MENU_ID}
          onClick={(e) => (menu.open ? closeMenu(false) : openMenu(e.detail === 0))}
        >
          <PixelIcon name="monitor" className={styles.logo} />
          <span>{UI.start}</span>
          <span className={styles.tag} aria-hidden="true">
            {UI.placeholder}
          </span>
        </button>
        <div className={styles.tasks} role="group" aria-label={UI.openWindows}>
          {tasks.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`${styles.task} ${t.active ? styles.active : ''}`}
              aria-pressed={t.active}
              title={t.title}
              onClick={() => onTaskClick(t.id)}
            >
              {t.title}
            </button>
          ))}
        </div>
        <Clock />
      </footer>
    </>
  );
}

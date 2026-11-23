import { useRef } from 'react';
import Taskbar from './components/Taskbar/Taskbar.tsx';
import { UI } from './content/ui.ts';
import type { WindowId } from './wm/windowIds.ts';
import styles from './App.module.css';

export default function App() {
  const menuRef = useRef<HTMLDivElement>(null);

  const openWindow = (id: WindowId) => {
    console.info(`open window: ${id}`);
  };

  return (
    <>
      <main className={styles.desktop} aria-label={UI.desktop} />
      <Taskbar menuRef={menuRef} tasks={[]} onTaskClick={openWindow} onOpenWindow={openWindow} />
    </>
  );
}

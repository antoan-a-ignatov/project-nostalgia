// PLACEHOLDER: phone wallpaper (solid color) and launcher icons are placeholders, labeled on screen.
import { useEffect, useRef, useState } from 'react';
import portrait from '../../assets/self-portrait-site-png.png';
import { isSeparator, MENU, type MenuEntry } from '../../content/menu.ts';
import { UI } from '../../content/ui.ts';
import { WINDOW_TITLES } from '../../content/windows.ts';
import PixelIcon from '../../icons/PixelIcon.tsx';
import type { WindowId } from '../../wm/windowIds.ts';
import WindowBody from '../WindowBody/WindowBody.tsx';
import WindowButtonIcon from '../Window/WindowButtonIcon.tsx';
import styles from './PhoneHome.module.css';

/** Phone layout: portrait and a launcher list; each item opens its window full screen. */
export default function PhoneHome() {
  const [openId, setOpenId] = useState<WindowId | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Focus moves to the close button on open and back to the opening item on close. This runs
  // after the commit, once the home screen is no longer inert.
  useEffect(() => {
    if (openId) closeRef.current?.focus();
    else openerRef.current?.focus();
  }, [openId]);

  const close = () => setOpenId(null);

  useEffect(() => {
    if (!openId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenId(null);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [openId]);

  const open = (id: WindowId, opener: HTMLElement) => {
    openerRef.current = opener;
    setOpenId(id);
  };

  return (
    <div className={styles.phone}>
      <div className={styles.home} inert={openId !== null}>
        <span className={`${styles.tag} ${styles.wallpaperTag}`}>{UI.placeholderPhoneWallpaper}</span>
        <div className={styles.layout}>
          <section className={styles.portraitFrame} aria-labelledby="phone-portrait-title">
            <div className={styles.title}>
              <span className={styles.titleText} id="phone-portrait-title">
                {WINDOW_TITLES.portrait}
              </span>
            </div>
            <img className={styles.portrait} src={portrait} width={320} height={320} alt={UI.portraitAlt} />
          </section>
          <nav className={styles.launcher} aria-label={UI.launcher}>
            <span className={`${styles.tag} ${styles.launcherTag}`}>{UI.placeholderIcons}</span>
            <ul className={styles.list}>
              {MENU.map((item, i) =>
                isSeparator(item) ? (
                  <li key={`sep-${i}`} role="separator" className={styles.sep} />
                ) : (
                  <li key={item.label}>
                    <LauncherItem
                      entry={item}
                      controls={item.children ? `launcher-${i}` : undefined}
                      expanded={item.children ? expanded === item.label : undefined}
                      onToggle={() => setExpanded((e) => (e === item.label ? null : item.label))}
                      onOpen={open}
                    />
                    {item.children && (
                      <ul id={`launcher-${i}`} className={styles.sub} hidden={expanded !== item.label}>
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <LauncherItem entry={child} sub onOpen={open} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ),
              )}
            </ul>
          </nav>
        </div>
      </div>
      {openId && (
        <section className={styles.window} role="dialog" aria-modal="true" aria-labelledby="phone-window-title">
          <div className={`${styles.title} ${styles.windowTitle}`}>
            <span className={styles.titleText} id="phone-window-title">
              {WINDOW_TITLES[openId]}
            </span>
            <button ref={closeRef} type="button" className={styles.close} aria-label={UI.close} onClick={close}>
              <WindowButtonIcon name="close" />
            </button>
          </div>
          <div className={styles.body}>
            <div className={styles.scroll} tabIndex={0} role="region" aria-labelledby="phone-window-title">
              <WindowBody id={openId} />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

interface LauncherItemProps {
  entry: MenuEntry;
  sub?: boolean;
  controls?: string;
  expanded?: boolean;
  onToggle?: () => void;
  onOpen: (id: WindowId, opener: HTMLElement) => void;
}

function LauncherItem({ entry, sub, controls, expanded, onToggle, onOpen }: LauncherItemProps) {
  const className = `${styles.item} ${sub ? styles.subItem : ''} ${entry.children ? styles.hasSub : ''}`;
  const content = (
    <>
      <PixelIcon name={entry.icon} className={styles.icon} />
      <span>{entry.label}</span>
      {entry.placeholder && <span className={styles.tag}>{UI.placeholder}</span>}
    </>
  );

  if (entry.action?.type === 'link' && !entry.disabled) {
    return (
      <a className={className} href={entry.action.href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  const action = entry.action;
  return (
    <button
      type="button"
      className={className}
      aria-expanded={expanded}
      aria-controls={controls}
      aria-disabled={entry.disabled || undefined}
      onClick={(e) => {
        if (entry.disabled) return;
        if (entry.children) onToggle?.();
        else if (action?.type === 'window') onOpen(action.window, e.currentTarget);
      }}
    >
      {content}
    </button>
  );
}

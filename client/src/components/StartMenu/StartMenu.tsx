// PLACEHOLDER: menu icons are placeholder art; the side strip labels them.
import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent, type Ref } from 'react';
import { flushSync } from 'react-dom';
import { isSeparator, MENU, type MenuEntry } from '../../content/menu.ts';
import { UI } from '../../content/ui.ts';
import PixelIcon from '../../icons/PixelIcon.tsx';
import type { WindowId } from '../../wm/windowIds.ts';
import styles from './StartMenu.module.css';

interface StartMenuProps {
  ref: Ref<HTMLDivElement>;
  id: string;
  open: boolean;
  /** Changes every time the menu opens, which resets submenu state. */
  session: number;
  focusFirst: boolean;
  onClose: (returnFocus: boolean) => void;
  onOpenWindow: (id: WindowId) => void;
}

// The menu stays rendered while closed (hidden with visibility, which also removes it from
// the tab order and accessibility tree), so it keeps its real size for measuring.
export default function StartMenu({ ref, id, open, session, focusFirst, onClose, onOpenWindow }: StartMenuProps) {
  return (
    <div ref={ref} className={`${styles.menu} ${open ? styles.open : ''}`}>
      <div className={styles.strip} aria-hidden="true">
        {UI.placeholderIcons}
      </div>
      <MenuBody key={session} id={id} focusFirst={focusFirst} onClose={onClose} onOpenWindow={onOpenWindow} />
    </div>
  );
}

const MENU_HAS_CHILDREN = MENU.map((item) => !isSeparator(item) && Boolean(item.children));

interface MenuBodyProps {
  id: string;
  focusFirst: boolean;
  onClose: (returnFocus: boolean) => void;
  onOpenWindow: (id: WindowId) => void;
}

const itemsIn = (list: Element): HTMLElement[] =>
  Array.from(list.children)
    .map((li) => li.firstElementChild)
    .filter((el): el is HTMLElement => el instanceof HTMLElement && el.dataset.menuitem === 'true');

function MenuBody({ id, focusFirst, onClose, onOpenWindow }: MenuBodyProps) {
  const [openSub, setOpenSub] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (focusFirst && listRef.current) itemsIn(listRef.current)[0]?.focus();
  }, [focusFirst]);

  const openSubmenu = (index: number, focusChild: boolean, li: HTMLElement) => {
    flushSync(() => setOpenSub(index));
    if (focusChild) {
      const sub = li.querySelector('ul');
      if (sub) itemsIn(sub)[0]?.focus();
    }
  };

  const activate = (entry: MenuEntry, index: number | null, e: MouseEvent<HTMLElement>) => {
    if (entry.disabled) {
      e.preventDefault();
      return;
    }
    if (entry.children && index !== null) {
      // detail is 0 for keyboard-triggered clicks.
      openSubmenu(index, e.detail === 0, e.currentTarget.parentElement as HTMLElement);
      return;
    }
    // Focus leaves the menu before it hides; opening a window then moves focus into that window.
    if (entry.action?.type === 'window') {
      onClose(true);
      onOpenWindow(entry.action.window);
    } else if (entry.action?.type === 'link') {
      onClose(true);
    }
  };

  const hover = (index: number | null, e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    e.currentTarget.focus({ preventScroll: true });
    if (index === null) return;
    setOpenSub(MENU_HAS_CHILDREN[index] ? index : null);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const item = e.target as HTMLElement;
    if (item.dataset.menuitem !== 'true') return;
    const list = item.closest('ul');
    if (!list) return;
    const items = itemsIn(list);
    const i = items.indexOf(item);
    const li = item.parentElement as HTMLElement;
    const inSub = list !== listRef.current;
    const topIndex = Number(li.dataset.index);
    switch (e.key) {
      case 'ArrowDown':
        items[(i + 1) % items.length].focus();
        if (!inSub) setOpenSub(null);
        break;
      case 'ArrowUp':
        items[(i - 1 + items.length) % items.length].focus();
        if (!inSub) setOpenSub(null);
        break;
      case 'Home':
        items[0].focus();
        break;
      case 'End':
        items[items.length - 1].focus();
        break;
      case 'ArrowRight':
        if (inSub || !MENU_HAS_CHILDREN[topIndex]) return;
        openSubmenu(topIndex, true, li);
        break;
      case 'ArrowLeft':
      case 'Escape': {
        if (inSub) {
          const parent = list.parentElement?.firstElementChild;
          setOpenSub(null);
          if (parent instanceof HTMLElement) parent.focus();
        } else if (e.key === 'Escape') {
          onClose(true);
        } else {
          return;
        }
        break;
      }
      case 'Tab':
        onClose(false);
        return;
      default:
        return;
    }
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <ul ref={listRef} id={id} role="menu" aria-label={UI.startMenu} className={styles.list} onKeyDown={onKeyDown}>
      {MENU.map((item, i) => {
        if (isSeparator(item)) return <li key={`sep-${i}`} role="separator" className={styles.sep} />;
        const isOpen = openSub === i;
        return (
          <li key={item.label} role="none" data-index={i} className={styles.row}>
            <MenuItemButton
              entry={item}
              expanded={item.children ? isOpen : undefined}
              onClick={(e) => activate(item, i, e)}
              onPointerEnter={(e) => hover(i, e)}
            />
            {item.children && (
              <ul role="menu" aria-label={item.label} className={styles.submenu} hidden={!isOpen}>
                {item.children.map((child) => (
                  <li key={child.label} role="none">
                    <MenuItemButton
                      entry={child}
                      sub
                      onClick={(e) => activate(child, null, e)}
                      onPointerEnter={(e) => hover(null, e)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}

interface MenuItemButtonProps {
  entry: MenuEntry;
  sub?: boolean;
  expanded?: boolean;
  onClick: (e: MouseEvent<HTMLElement>) => void;
  onPointerEnter: (e: PointerEvent<HTMLElement>) => void;
}

function MenuItemButton({ entry, sub, expanded, onClick, onPointerEnter }: MenuItemButtonProps) {
  const className = `${styles.item} ${sub ? styles.subItem : ''} ${entry.children ? styles.hasSub : ''}`;
  const content = (
    <>
      <PixelIcon name={entry.icon} className={styles.icon} />
      <span>{entry.label}</span>
      {entry.placeholder && <span className={styles.tag}>{UI.placeholder}</span>}
    </>
  );
  const common = {
    className,
    role: 'menuitem',
    tabIndex: -1,
    'data-menuitem': 'true',
    'aria-disabled': entry.disabled || undefined,
    onClick,
    onPointerEnter,
  } as const;

  if (entry.action?.type === 'link' && !entry.disabled) {
    return (
      <a {...common} href={entry.action.href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return (
    <button
      {...common}
      type="button"
      aria-haspopup={entry.children ? 'menu' : undefined}
      aria-expanded={expanded}
    >
      {content}
    </button>
  );
}

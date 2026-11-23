// PLACEHOLDER: project entries, contact entries and the pixel art link are placeholders (see PLACEHOLDERS.md).
import type { IconName } from '../icons/pixelIcons.ts';
import type { WindowId } from '../wm/windowIds.ts';

export type MenuAction = { type: 'window'; window: WindowId } | { type: 'link'; href: string };

export interface MenuEntry {
  label: string;
  icon: IconName;
  action?: MenuAction;
  children?: readonly MenuEntry[];
  disabled?: boolean;
  /** Shows a PLACEHOLDER tag next to the label. */
  placeholder?: boolean;
}

export type MenuItem = MenuEntry | { separator: true };

export const isSeparator = (item: MenuItem): item is { separator: true } => 'separator' in item;

/** One definition drives both the desktop Start menu and the phone launcher. */
export const MENU: readonly MenuItem[] = [
  { label: 'About Me', icon: 'person', action: { type: 'window', window: 'about' } },
  { label: 'Experience', icon: 'document', action: { type: 'window', window: 'experience' } },
  {
    label: 'Certifications',
    icon: 'certificate',
    children: [
      { label: 'AZ-104', icon: 'certificate', action: { type: 'window', window: 'cert-az104' } },
      { label: 'AWS Cloud Practitioner', icon: 'certificate', action: { type: 'window', window: 'cert-aws' } },
    ],
  },
  {
    label: 'Projects',
    icon: 'folder',
    children: [
      // PLACEHOLDER: project entries, replaced by Antoan's real projects.
      { label: 'Project 1', icon: 'document', placeholder: true, action: { type: 'window', window: 'project-1' } },
      { label: 'Project 2', icon: 'document', placeholder: true, action: { type: 'window', window: 'project-2' } },
    ],
  },
  {
    label: 'Hobbies',
    icon: 'palette',
    children: [
      // PLACEHOLDER: pixel art URL, replaced by the real link.
      { label: 'Pixel Art', icon: 'picture', placeholder: true, action: { type: 'link', href: 'https://example.com/' } },
      { label: 'Coming Soon', icon: 'hourglass', disabled: true },
    ],
  },
  {
    label: 'Contact',
    icon: 'card',
    children: [
      // PLACEHOLDER: contact entries (no email, no phone), replaced by real links.
      { label: 'Contact 1', icon: 'globe', placeholder: true, action: { type: 'link', href: 'https://example.com/' } },
      { label: 'Contact 2', icon: 'globe', placeholder: true, action: { type: 'link', href: 'https://example.com/' } },
    ],
  },
  { separator: true },
  { label: 'Credits', icon: 'star', action: { type: 'window', window: 'credits' } },
];

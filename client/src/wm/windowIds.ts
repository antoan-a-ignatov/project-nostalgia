export const WINDOW_IDS = [
  'experience',
  'about',
  'portrait',
  'cert-az104',
  'cert-aws',
  'project-1',
  'project-2',
  'credits',
] as const;

export type WindowId = (typeof WINDOW_IDS)[number];

export const PORTRAIT_ID: WindowId = 'portrait';

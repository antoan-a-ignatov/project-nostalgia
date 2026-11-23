// PLACEHOLDER: certification and project windows have no real content yet. Each entry says
// what replaces it.
import type { WindowId } from '../wm/windowIds.ts';

export const PLACEHOLDER_WINDOWS: Partial<Record<WindowId, string>> = {
  'cert-az104': 'AZ-104 certification details: issuer, date, credential link.',
  'cert-aws': 'AWS Cloud Practitioner certification details: issuer, date, credential link.',
  'project-1': 'Project entry: summary, stack, repository link.',
  'project-2': 'Project entry: summary, stack, repository link.',
};

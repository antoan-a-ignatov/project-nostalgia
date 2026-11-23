import { describe, expect, it } from 'vitest';
import { ICON_COLORS, ICON_SIZE, ICONS, toRuns } from './pixelIcons.ts';

describe('pixel icons', () => {
  it.each(Object.entries(ICONS))('%s is a 16x16 grid using known colors', (_, rows) => {
    expect(rows).toHaveLength(ICON_SIZE);
    for (const row of rows) {
      expect(row).toHaveLength(ICON_SIZE);
      for (const c of row) expect(c === '.' || c in ICON_COLORS, `unknown color "${c}"`).toBe(true);
    }
  });

  it('merges same-colored pixels in a row into one run', () => {
    expect(toRuns(['kk.w'])).toEqual([
      { x: 0, y: 0, width: 2, color: ICON_COLORS.k },
      { x: 3, y: 0, width: 1, color: ICON_COLORS.w },
    ]);
  });
});

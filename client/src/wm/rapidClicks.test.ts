import { describe, expect, it } from 'vitest';
import { recordClick } from './rapidClicks.ts';

const clickAt = (stamps: number[], count = 5, windowMs = 2000) => {
  let times: number[] = [];
  const results: boolean[] = [];
  for (const t of stamps) {
    const r = recordClick(times, t, count, windowMs);
    times = r.times;
    results.push(r.triggered);
  }
  return results;
};

describe('recordClick', () => {
  it('triggers on the 5th click within 2 seconds', () => {
    expect(clickAt([0, 300, 600, 900, 1200])).toEqual([false, false, false, false, true]);
  });

  it('does not trigger when clicks are spread over more than 2 seconds', () => {
    expect(clickAt([0, 600, 1200, 1800, 2400, 3000])).toEqual([false, false, false, false, false, false]);
  });

  it('needs a fresh burst after triggering', () => {
    expect(clickAt([0, 100, 200, 300, 400, 500, 600, 700, 800])).toEqual([
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
    ]);
  });

  it('drops clicks older than the window', () => {
    // 0 and 100 fall out of the window by 2100, so 2100 is only the 4th recent click.
    expect(clickAt([0, 100, 1500, 1800, 2100]).at(-1)).toBe(false);
  });
});

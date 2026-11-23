/**
 * Records a click and reports whether `count` clicks landed within `windowMs`.
 * Returns the timestamps to keep; they reset after a trigger, so the next one
 * needs a fresh burst.
 */
export function recordClick(
  times: readonly number[],
  now: number,
  count: number,
  windowMs: number,
): { times: number[]; triggered: boolean } {
  const recent = [...times.filter((t) => now - t < windowMs), now];
  if (recent.length >= count) return { times: [], triggered: true };
  return { times: recent, triggered: false };
}

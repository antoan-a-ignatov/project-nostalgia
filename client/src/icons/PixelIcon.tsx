// PLACEHOLDER: renders placeholder pixel icons, replaced by Antoan's pixel art.
import { ICON_SIZE, ICONS, toRuns, type IconName, type PixelRun } from './pixelIcons.ts';

const runCache = new Map<IconName, PixelRun[]>();

function runsFor(name: IconName): PixelRun[] {
  let runs = runCache.get(name);
  if (!runs) {
    runs = toRuns(ICONS[name]);
    runCache.set(name, runs);
  }
  return runs;
}

interface PixelIconProps {
  name: IconName;
  /** Integer scale keeps every pixel sharp. */
  scale?: number;
  className?: string;
}

export default function PixelIcon({ name, scale = 2, className }: PixelIconProps) {
  const size = ICON_SIZE * scale;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={`0 0 ${ICON_SIZE} ${ICON_SIZE}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {runsFor(name).map((r) => (
        <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.width} height={1} fill={r.color} />
      ))}
    </svg>
  );
}

// Title bar button glyphs drawn on a pixel grid and shown at 2x so every pixel stays sharp.

const GLYPHS = {
  minimize: { w: 8, h: 8, paths: ['M1 6h6v2H1z'] },
  maximize: { w: 9, h: 9, paths: ['M0 0h9v9H0zM1 2v6h7V2z'] },
  restore: { w: 8, h: 9, paths: ['M2 0h6v6H6V2H3v1H2z', 'M0 3h6v6H0zM1 5v3h4V5z'] },
  close: {
    w: 8,
    h: 7,
    paths: [
      'M0 0h2v1H0zM6 0h2v1H6zM1 1h2v1H1zM5 1h2v1H5zM2 2h4v1H2zM3 3h2v1H3zM2 4h4v1H2zM1 5h2v1H1zM5 5h2v1H5zM0 6h2v1H0zM6 6h2v1H6z',
    ],
  },
} as const;

export type GlyphName = keyof typeof GLYPHS;

export default function WindowButtonIcon({ name }: { name: GlyphName }) {
  const g = GLYPHS[name];
  return (
    <svg
      width={g.w * 2}
      height={g.h * 2}
      viewBox={`0 0 ${g.w} ${g.h}`}
      shapeRendering="crispEdges"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {g.paths.map((d) => (
        <path key={d} d={d} fillRule="evenodd" />
      ))}
    </svg>
  );
}

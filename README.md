# project-nostalgia

A one-page personal site for recruiters and interviewers, styled as a minimalist take on a Windows 98 desktop.

Live site: to be added.

## Status

Under rebuild. The page currently shows the desktop wallpaper only.

## Run locally

Requires Node.js 26.x.

```
cd client
npm install
npm run dev
```

Other scripts, all run from `client/`:

- `npm run build`: type-check and build into `client/dist`
- `npm run lint`: ESLint
- `npm test`: unit tests (Vitest)

## Project structure

- `client/`: the Vite + React + TypeScript app. Vercel builds from this folder.
- `client/src/assets/`: wallpaper and portrait.
- `client/public/`: favicon.

## Placeholders

Content and art that are still placeholders are listed in [PLACEHOLDERS.md](PLACEHOLDERS.md).

## Credits

- Wallpaper and portrait: Antoan Ignatov's own pixel art.
- Site built with Claude (Anthropic).

# project-nostalgia

A one-page personal site for recruiters and interviewers, styled as a minimalist take on a Windows 98 desktop.

Live site: to be added.

## Status

Under rebuild. The desktop has a taskbar with a live clock, a Start menu with submenus and keyboard support, and windows that drag, resize, minimize, maximize and close. Experience and About Me show the real text; certifications, projects and contact links are placeholders. Screens under 768px wide or 500px tall get a phone layout: a launcher list that opens each window full screen.

## Edit content

All text lives in `client/src/content/`, separate from the components:

- `experience.ts`: jobs and education for EXPERIENCE.TXT
- `about.ts`: ABOUT_ME.NFO
- `menu.ts`: Start menu entries, links and icons
- `placeholderWindows.ts`, `credits.ts`: certification, project and credits windows
- `windows.ts`: window titles
- `ui.ts`: interface labels

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
- `client/src/components/`: taskbar, clock, Start menu, window frame and the phone layout.
- `client/src/wm/`: window manager state as one pure reducer, with unit tests.
- `client/src/content/`: all site text and the menu definition.
- `client/src/icons/`: pixel icons stored as 16x16 character grids.
- `client/src/assets/`: wallpaper and portrait.
- `client/public/`: favicon.

## Placeholders

Content and art that are still placeholders are listed in [PLACEHOLDERS.md](PLACEHOLDERS.md).

## Credits

- Wallpaper and portrait: Antoan Ignatov's own pixel art.
- Site built with Claude (Anthropic).

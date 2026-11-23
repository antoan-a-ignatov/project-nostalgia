# project-nostalgia

A one-page personal site for recruiters and interviewers, styled as a minimalist take on a Windows 98 desktop. It shows my experience, a short profile and links in draggable windows on a pixel art wallpaper.

Live site: to be added.

## What it does

- Desktop (768px wide and 500px tall or more): a taskbar with a Start menu, a live clock in the visitor's locale, and windows that drag, resize (minimum 240x160), minimize, maximize and close. Opening windows one after another cascades them so every title bar stays visible, and nothing opens under the Start menu.
- Phone (under 768px wide or under 500px tall): a home screen with the portrait and a launcher list. Each entry opens its window full screen.
- Keyboard: the Start menu works with arrow keys, Home/End, Enter and Esc. Window buttons are labeled buttons, and opening a window moves focus into its text so it can be scrolled.
- No Microsoft assets. All icons are original 16x16 pixel drawings, and the font is the system stack (Tahoma, Verdana, sans-serif).

## Run locally

Requires Node.js 26.x.

```
cd client
npm install
npm run dev
```

Other scripts, all run from `client/`:

- `npm run build`: type-check and build into `client/dist`
- `npm run preview`: serve the production build
- `npm run lint`: ESLint
- `npm test`: unit tests (Vitest)

## Project structure

- `client/`: the Vite + React + TypeScript app. Vercel builds from this folder.
- `client/src/wm/`: window manager state as one pure reducer, with 37 unit tests covering layout, Start menu avoidance, cascading, clamping, resizing and the portrait rules.
- `client/src/components/`: taskbar, clock, Start menu, window frame and the phone layout. Styles are CSS Modules.
- `client/src/content/`: all site text and the menu definition.
- `client/src/icons/`: pixel icons stored as 16x16 character grids and rendered as inline SVG.
- `client/src/assets/`: wallpaper and portrait.
- `client/public/`: favicon.

Runtime dependencies are only `react` and `react-dom`. The production JavaScript is 79 KB gzipped, most of it React.

## Edit content

All text lives in `client/src/content/`, separate from the components:

- `experience.ts`: jobs and education for EXPERIENCE.TXT
- `about.ts`: ABOUT_ME.NFO
- `menu.ts`: Start menu entries, links and icons
- `placeholderWindows.ts`, `credits.ts`: certification, project and credits windows
- `windows.ts`: window titles
- `ui.ts`: interface labels

To replace an icon, edit its grid in `client/src/icons/pixelIcons.ts` (one character per pixel, colors listed at the top of the file).

## Placeholders

Content and art that are still placeholders are listed in [PLACEHOLDERS.md](PLACEHOLDERS.md) and labeled "PLACEHOLDER" on the site.

## Testing and known limits

- Automated: unit tests for the window manager and the icon grids. The interface has no automated browser tests yet.
- Manual: checked in Chromium at 1920x1080, 1366x768, 1024x768, 375x812 and 812x375. Firefox, Safari, iOS Safari and Android Chrome have not been tested.
- The portrait stays at 320 CSS pixels. On 125% or 150% display scaling its pixels are not an exact integer scale.
- Screens narrower than 352px don't fit the portrait frame.
- Switching between the phone and desktop layouts (for example rotating a tablet) resets the windows, the same as a reload.

## Credits

- Wallpaper and portrait: Antoan Ignatov's own pixel art.
- Site built with Claude (Anthropic).

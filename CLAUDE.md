# project-nostalgia: working rules for Claude

## Scope
- Claude builds this site autonomously, following the build plan named at the start of the session. For this repository these rules override the mentor rules in the global CLAUDE.md: Claude writes the code, runs the commands and makes implementation decisions within the plan.
- The public writing rules in the global CLAUDE.md still apply to README.md and PLACEHOLDERS.md.
- No plan or milestone references in file content or commit messages.
- The app stays in `client/`. Vercel builds from there.

## Stop and ask only when
- a dependency outside the allowed list below is needed;
- a change outside this folder is needed;
- anything needs the GitHub remote, Vercel, an account, or a push;
- two plan requirements contradict with no sensible reading;
- the build stays broken after three different fix attempts.

Everything else: decide, add one line with the reasoning to `RUN-LOG.md`, and continue. Missing content gets a placeholder and a log entry, not a stop.

## Never
- Push, change remotes, publish packages, or touch Vercel.
- Use Microsoft assets: logos, icons, fonts, sounds.
- Write new site text. Existing EXPERIENCE.TXT and ABOUT_ME.NFO text is kept word for word (layout changes and obvious typo fixes allowed, each fix logged); everything else is a placeholder.

## Dependencies
- Runtime: `react`, `react-dom`.
- Dev: what the Vite `react-ts` template installs, plus `vitest`.
- No CSS framework, router, drag/resize library or UI kit. Styling uses CSS Modules.

## Placeholders
- Every placeholder image is visibly labeled "PLACEHOLDER" on the site.
- A `PLACEHOLDER:` comment at the top of each file containing one, and next to each placeholder image or value, saying what replaces it.
- `PLACEHOLDERS.md` in the repo root lists every placeholder. Delete it when the list is empty.

## Code
- Site text lives in data files under `client/src/content/`, never inside components.
- Window manager state is one pure reducer module with vitest unit tests.
- Import paths match file name case exactly. Windows ignores case; Vercel's Linux build does not.
- `package.json` keeps `"engines": { "node": "26.x" }`.

## Before every commit
- `npm run lint`, `npm run build` and `npm test` pass in `client/`.
- Browser pane check at 1920x1080, 1366x768, 1024x768, 375x812 and 812x375, with no console errors.
- No leftover template references, no unmarked placeholders.
- README.md reflects the current state.

## Run log
`RUN-LOG.md` is local only (excluded from git). Append: date, milestone, decisions, typo fixes, problems.

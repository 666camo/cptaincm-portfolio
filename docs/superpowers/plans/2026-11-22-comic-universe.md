# Comic Universe Implementation Plan

**Goal** — Add a persistent Comic Universe theme to the existing portfolio.

**Architecture** — Use one React page tree with a theme context for the navbar controls and the ambient Hero effect. Apply theme colors and decoration through CSS scoped to the root theme. Set the saved theme in `index.html` before the page paints.

**Spec** — `D:/portofolio/planT.md` and the current chat.

## Baseline

- Dark Cinematic v1.6 is the reference for the `Full Stack Developer` Hero, wordmark loader, direct anchor navigation, and sticky stack at desktop and phone widths.
- Both themes use the current portrait artwork. Phone and reduced-motion views show the original portrait. Desktop pointer reveal keeps the current Canvas pipeline.
- Capture the Dark Hero at 375, 768, 1024 and 1440 px. Back up source and both portrait hashes before implementation.

## Tasks

- [x] Add a Playwright check for Dark default, the switch's accessible pressed state, a saved Comic theme after reload, and preserving the current scroll and Dialog focus. Run it against v1.6 and confirm it fails on the missing theme.
- [x] Add `src/app/ThemeProvider.tsx` and mount it in `src/main.tsx`. Add the HTML bootstrap and the reusable `ThemeToggle` to the desktop navbar and compact menu. Ensure blocked storage permits switching for the session.
- [x] Add Comic tokens to `src/styles/tokens.css` and scoped styling to `src/styles/comic.css`. Apply paper, ink, red and yellow to the Hero, About, project panels, Toolkit, timeline, Activity, Contact, Footer and menu. Keep project artwork separate from its frame.
- [x] Keep one portrait effect. Disable the moving glow, contours and web rendering in Comic and draw the decorative background with static CSS and SVG. Style stack scrims through tokens and test theme switching during a sticky transition.
- [x] Compare both themes at desktop and narrow sizes, including keyboard, touch, reduced motion, blocked storage, deep links, and 200% zoom. Check dark visuals against the baseline and profile hover and scroll plus switching. Run `npm run typecheck` and `npm run build`.

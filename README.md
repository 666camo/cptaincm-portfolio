# cptaincm. — Alif Rifky’s portfolio

A React, TypeScript and Vite portfolio. The three-column Hero adapts the opening portrait dissolve and liquid pointer trail from the KIMI reference. The navigation links to the flow anchors for Home, About and Projects. On desktop the full-width masthead contracts into a floating top dock. The wordmark moves left and a digital clock displays Bandung time (WIB) on the right. Desktop adds GitHub and LinkedIn when configured. Below 900px, or on a short coarse-pointer screen, a bottom dock shows Contact in place of the social group. The theme switch uses the existing preference. About slides over Hero, then Selected Works slides over About at all viewport sizes. Up to 639px, the outgoing panel darkens at full width. Reduced motion uses regular scrolling. Its spider-web background responds to the pointer with a 2D spring simulation. The later sections use the editorial pacing of Lumora.

The current marker follows the last section start above the reading line (40% of the viewport, capped at 260px). Toolkit, Experience and Activity clear the marker. Contact is highlighted only on layouts with a Contact item. Section offsets are remeasured on layout changes. Fragment links keep native browser history and keyboard navigation.

## Run locally

Run these commands from the folder containing this README and `package.json`.

```sh
npm ci
npm run dev
```

Open the localhost address printed by Vite. To check and inspect the production bundle, run:

```sh
npm run typecheck
npm run build
npm run preview
```

## Replace sample content

| File | Content to supply |
| --- | --- |
| `src/data/about.ts` | Approved biography and an optional concrete example with a project link |
| `src/data/projects.ts` | Real projects, screenshots, responsibilities, features, and verified demo/source URLs. For the featured project, supply the challenge and solution in `caseStudy`. |
| `src/data/tech.ts` | Confirmed technologies |
| `src/data/experience.ts` | Confirmed roles, organizations, dates, and descriptions |
| `src/data/site.ts` | Verify email and Instagram. Add LinkedIn, GitHub and an optional `resume` URL. Place a supplied PDF in `public/resume/`. |
| `src/data/activity.ts` | GitHub/WakaTime availability. Add an actual public widget or a server-side integration when configured. |
| `index.html` | Final search metadata and social sharing image before publication |

Update the matching data file and set `isPlaceholder` to `false` when the approved content is in place. The sections and their entrance animations accept the same data structures. Keep service tokens outside the frontend bundle.

## Portraits and motion

Runtime portraits live in `public/assets/portraits/`. The theme mapping in `src/data/portraits.ts` selects the cinematic real portrait for Dark or the naturally lit real portrait for Comic. All three WebPs share a transparent 2048 × 1364 frame. Both themes use the same Miles image, face registration and pointer mask. Dark draws a striped trail with a colored rim. Comic draws halftone dots with an ink rim. Touch devices load only the real portrait. With a fine pointer, reduced motion and Data Saver offer a keyboard-accessible still-image switch. The project serves Oswald, Space Grotesk and DM Mono locally with their notices under `public/licenses/`.

## Browser QA checklist

- [x] Check layout at 375×812, 390×844, 768×1024, 1024×768, 1440×900, 1920×1080 and 844×390 landscape in Chromium.
- [ ] Repeat the visual checks at browser zoom and on physical devices.
- [x] Check the desktop opening dissolve and pointer trail. Verify that the original portrait and the web return to rest.
- [x] Test the pointer reveal, its return to the real portrait, and the reduced-motion and touch presentations.
- [x] Test desktop navigation and contact, the mobile dock and theme switch, both stage transitions, and section entrances.
- [ ] Check the skip link and history navigation with assistive technology.
- [ ] Measure layout shift, largest contentful paint, interaction latency and animation frame timing in the browser.
- [ ] Confirm content, contact links, resume and permission to use the portrait artwork before publication.

See [Implementation status](IMPLEMENTATION_STATUS.md) for verification results and outstanding items.

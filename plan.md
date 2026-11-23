# CPTAINCM Portfolio — Implementation Plan

> **Status:** Ready for development · **Version:** 1.6 · **Date:** 21 November 2026  
> **Project:** Personal developer portfolio `cptaincm.`  
> **Stack:** React + TypeScript + Vite  
> **Design direction:** Hybrid KIMI × Lumora — cinematic hero, editorial content, accessible interactions  
> **Purpose of this file:** Implementation roadmap and acceptance criteria. **This plan does not constitute website implementation.**

---

## 1. Project Goals

Build a distinctive yet professional personal portfolio for **Alif Rifky / cptaincm.** that:

1. Makes a strong first impression with a **KIMI-inspired cinematic hero**.
2. Immediately tells visitors **who the developer is**, **what they do**, and **where to explore projects/contact**.
3. Provides a high-quality **real-photo → Spider-Man reveal** interaction without sacrificing usability or performance.
4. Shows projects, capabilities, experience, and contact information in a **clean Lumora-inspired editorial layout**.
5. Uses **replaceable dummy data** outside confirmed branding and hero information; real content can be entered later without altering components.
6. Works on desktop, tablet, mobile, keyboard-only navigation, and reduced-motion settings.

**Primary audiences:** recruiters, potential freelance clients, and fellow developers.  
**Design priorities:** content clarity → accessibility/responsiveness → smooth performance → cinematic polish.

### Out of scope for the first iteration

- Backend, CMS, database, authentication, or admin dashboard.
- Real-time statistics requiring credentials before providers are configured.
- Elaborate full-body 3D models or recreating KIMI's entire WebGL helmet implementation.
- Inventing professional credentials, client projects, or analytics numbers.
- Deploying with unreviewed, fictitious accomplishments.

---

## 2. Confirmed Decisions (Do Not Change Without User Approval)

| Area | Decision |
| --- | --- |
| Branding | All-lowercase `cptaincm.`; `cptain` off-white, `cm.` Spider Red |
| Wordmark font | Space Grotesk Bold (initial choice; verify visual rendering) |
| Overall palette | Void black + spider red + midnight blue + off-white |
| Main layout inspiration | KIMI dominates hero and sticky stacked transitions; Lumora dominates content/editorial portions |
| Framework | React + TypeScript + Vite |
| Hero composition | Three desktop columns with name and full `Full Stack Developer` headline on the left, original portrait in the center, and specialty/location plus calls to action on the right |
| Hero role | `Full Stack Developer • Creative Problem Solver` |
| Hero photo crop | Bottom edge hidden by **hero viewport/container clipping**, no bottom gradient fade |
| Default portrait | User's original photo with original patterned dark shirt, Meshy relight with its baked red/blue lighting |
| Reveal portrait | User-supplied transparent black/red Miles Morales Spider-Man image, same approximate pose |
| Cursor interaction | **KIMI B–A–C** with a Hero-wide striped trail and an aligned Miles reveal within the portrait |
| Desktop background | Void black, crimson and midnight-blue glow, quiet contours, and spider-web strands that bend and rebound near the cursor |
| Scroll presentation | Sticky stack **Hero → About → Selected Projects** at every viewport size, then normal scrolling |
| Hero actions | Primary `Explore Projects`, secondary `Let's Connect`, tertiary `Download Resume` link |
| Remaining content | Replaceable dummy data (clearly marked until replaced) |
| Development sequence | Working foundations and layout first; cinematic shaders and advanced motion after baseline functions |

**Clarification:** The “60% KIMI × 40% Lumora” ratio describes overall design influence, **not an animation quota** or requirement for every section.

---

## 3. Visual Design System

### 3.1 Colors

| Token | Hex | Usage |
| --- | --- | --- |
| `color.background` | `#0B0B10` | Primary void-black canvas |
| `color.accent` | `#E62439` | Wordmark `cm.`, large display accent, brand decorations |
| `color.accentReadable` | `#FF5266` | Small red text on dark surfaces where contrast is needed |
| `color.midnight` | `#182747` | Ambient background and deeper cool tones |
| `color.foreground` | `#F4F1EE` | Headlines, wordmark `cptain`, main text |
| `color.muted` | `#B6B6C4` | Secondary copy; recheck actual rendered contrast |

- Treat palette values as **semantic tokens**, not ad-hoc color literals scattered across components.
- Red `#E62439` on `#0B0B10` is about **4.37:1**: do not use that pairing for normal-sized text where AA requires 4.5:1. Use readable accent instead.
- Test foreground contrast against **all animated gradient frames**, not only the flat black background.
- Maintain clear focus indications and readable button text.

### 3.2 Typography

- **Display candidate:** Oswald, for dramatic cinematic headlines.
- **Interface/body and wordmark:** Space Grotesk.
- Use one semantic H1, `Full Stack Developer`, arranged on two lines in the left desktop column.
- Body baseline: approximately **16px** with readable line height; avoid tiny metadata becoming essential information.
- Use fluid type sizing and explicit safe areas to prevent text/photo overlap.
- Maintain straightforward heading hierarchy and text wrapping at narrow widths / zoom.

### 3.3 Visual language

- Primary background remains deep dark, not bright KIMI cyan/white.
- Rounded elements only where purposeful; avoid generic oversaturated glassmorphism.
- One consistent vector icon family (e.g., Lucide); no emoji as structural UI icons.
- Motion supports the content rather than continually competing with it.

---

## 4. Section Architecture

### 01 — Hero / Landing

**Content:**
- Desktop navbar puts the `cptaincm.` wordmark on the left, section links with current-section feedback in the center, and the contact action on the right. Compact screens use the accessible menu.
- Identity: `Alif Rifky`; role: `Full Stack Developer • Creative Problem Solver`; location when used: Bandung, Indonesia.
- Visual H1: `Full Stack` and `Developer` on separate lines in the left column. The right column contains the specialty, location and calls to action.
- Large original seated portrait **in the center**, occupying substantial height on desktop.
- Desktop opens with Miles briefly visible before a top-to-bottom dissolve reveals the real portrait. Touch and reduced-motion users start with the real portrait.
- CTA hierarchy: `Explore Projects` (primary), `Let's Connect` (secondary), `Download Resume` (tertiary text link).
- Animated dark background with ambient light, contour lines and spring-driven web strands.
- Intro: `cptaincm.` wordmark, optional visual 000→100 asset-loading indicator, then restrained staggered entrance.

**Layout requirements:**
- At wide desktop widths, the text rails sit beside the center portrait, with no text obscuring its face.
- Subject lower boundary is clipped by the Hero container at the viewport bottom, not blended with gradient.
- On medium layouts, reduce type/photo scale and allow flexible repositioning.
- On tablets/mobile, stack heading and identity above the portrait, with actionable CTAs still accessible.
- For short-height windows/landscape, allow the section to grow vertically so important copy and buttons aren't cropped.
- Hide decorative contour layers behind text; establish safe z-index and text legibility zones.

### 02 — About Me / “Beyond the code.”

- Editorial, slightly asymmetric Lumora-style section.
- Large heading, a one-paragraph sample biography and an optional concrete example linked to a project. Sample copy is labeled.
- Optional factual identity/education snippets when user-approved data is available.
- Avoid another oversized portrait that competes with the Hero.
- Subtle scroll text reveal; no full-screen shader or unnecessarily complex hover interaction.
- Arrives over Hero through the first sticky-stacked transition.

### 03 — Selected Projects / “Selected Works.”

- On desktop the featured case displays a large preview beside its challenge, role and solution. On smaller screens the preview sits above the case details.

- Three dummy projects initially: **one featured wide project** and **two supporting cards**.
- Example placeholders only: `Nexus Dashboard`, `Orbit Commerce`, `Flow Booking`.
- Each data object: `id`, `title`, `slug`, `category`, `summary`, `role`, `stack[]`, `cover`, `features[]`, `links.demo`, `links.source`, `featured`, `isPlaceholder`, and optional `caseStudy` with the problem and solution.
- Large previews, clean type, gentle image zoom/hover and reveal; **do not repeat KIMI liquid effect** on project cards.
- Never create clickable demo/GitHub buttons pointing to invented domains. Show disabled/sample states until real links exist.
- Second and final sticky-stacked transition arrives here; regular scroll follows.

### 04 — Tech Stack / “My Arsenal”

- Data-driven technology groups (frontend, backend, tools, etc.).
- Dummy technologies are examples, not automatically claims of proficiency.
- Simple grid with accessible labels and restrained staggered entrance.

### 05 — Experience / “My Journey”

- Editorial vertical timeline; dummy entries until genuine dates/roles are supplied.
- Actual past instructor experience can be added later with user-approved wording.
- Avoid fabricated dates, companies, metrics, or accomplishments in a published version.

### 06 — Developer Activity

- GitHub and WakaTime modules with **honest placeholders** until APIs, tokens, and widget endpoints are available.
- No simulated coding statistics shown as real.
- Hide or label unavailable widgets gracefully; reserve layout space to avoid shifting.
- Optional contribution “snake” visualization can be integrated when the user's workflow assets are configured and verified.

### 07 — Contact / “Let's Build Something.”

- Large closing typography, direct contact CTA, social links when confirmed.
- Dummy/placeholder addresses must not be clickable or published as real destinations.
- Prefer simple actionable email/social links over adding a backend contact form in v1.
- Footer returns to lowercase two-color `cptaincm.` branding.

---

## 5. KIMI Liquid Reveal — Interaction Specification

### 5.1 Two image layers

- `portrait-real`: original user photo, original dark patterned shirt, supplied Meshy red/blue lighting, and transparent background.
- `portrait-miles`: user-supplied Miles version, transparent background.
- Position both in the **same wrapper and coordinate space**, with matching display size and top/center alignment.
- **Do not block initial development** because the source PNGs have different canvas heights; start with CSS/object-position alignment, then verify in an overlay test.
- If needed, add nondestructive transparent padding/crop or adjust visual positioning during QA. **Do not stretch the character** merely to match canvas dimensions.

### 5.2 Desktop behavior: B–A–C

**B — Strong KIMI reveal:**
- Moving the cursor over the portrait reveals Miles only within a dynamic liquid/distorted mask.
- Pointer speed stretches the trail along its path. One mask covers the whole Hero and feeds both the striped background trail and the portrait blend.

**A — Fast smooth return:**
- When movement stops or pointer exits, reveal intensity falls off promptly and smoothly; no abrupt visible snap.
- Do not permanently toggle the default portrait through mouse hover.

**C — Cinematic accents:**
- A thin crimson edge follows the trail. A brighter edge follows the one-time opening wipe from the top of the image down.
- Effects must not cause visible silhouette jitter or color flashes.

**Engineering approach:** Prototype a masked 2D/Canvas pipeline first; consider a lightweight WebGL shader only if it materially improves the KIMI feel and passes performance tests. Keep both images in sync under all parallax/motion. Avoid a full 3D character reconstruction.

### 5.3 Non-hover presentation

- Touch, reduced motion and an unavailable Canvas 2D context show the supplied Meshy portrait as a static image.
- No essential site information may be locked behind interaction with the image.

### 5.4 Asset acceptance

- Both images genuinely transparent (alpha), cleanly cut out, no checkerboard baked into artwork.
- Similar camera angle, head, torso, shoulder, and arm positions.
- No obviously doubled silhouette during reveal at head/shoulder boundaries.
- Hero's bottom clip remains correct while the section transitions.
- Check artwork usage permissions before public/commercial deployment.

---

## 6. Animation & Scroll System

### 6.1 Background animation budget

1. Base background (`#0B0B10`) — **static**.
2. Red/blue ambient glow — **slow animation**.
3. KIMI-inspired contour lines — **slow low-contrast drift**, allowed to pause/reduce during active image reveal.
4. Spider-web strands — a Canvas 2D spring mesh bends locally as the pointer approaches, transmits the disturbance to adjacent strands and settles at rest. Touch and reduced-motion keep the web still.

Do not add constant particles, heavy glitch, lightning flashes, or an always-following pointer background. Stop or suspend invisible Hero animations when Hero leaves the viewport.

### 6.2 Sticky-stacked sections

- Apply visual stack only to **Hero → About → Selected Projects**.
- As the next section rises, the outgoing surface darkens behind it. It scales to 0.90 above 639px and stays full-width up to 639px. Thin web strands along the incoming edge straighten with scroll progress and fade once the transition settles.
- Do not assume an exact opacity/scale is final: tune to readability and visual continuity.
- **Avoid scroll hijacking and long forced waiting**; anchors to `#projects` and `#contact` must remain reliable.
- Enable the stack on compact and short viewports. Tall content scrolls through first and pins when its lower edge reaches the bottom of the viewport. Reduced motion uses normal scrolling.
- Everything after Projects scrolls normally.

### 6.3 Intro loader

- Start the Miles dissolve while the opening overlay is active, with a 720 ms maximum opening window. Later image loads enable pointer reveal and leave the displayed portrait in place.

- Brand `cptaincm.` with matching two-color wordmark.
- If using 000→100, progress must correspond to actual critical asset readiness or be clearly presented as decorative; no artificial lengthy gate.
- Users should see key content quickly even if secondary effects fail to initialize.
- Do not block interaction while decorative entrance sequences complete.

### 6.4 Motion principles

- Limit each viewport to one dominant animation and one restrained supporting motion.
- Prefer `transform` / `opacity` for DOM transitions; avoid layout reflow and scroll event overwork.
- Make animations interruptible and honor `prefers-reduced-motion`.
- Use consistent easing/duration tokens rather than independently guessed timings.

---

## 7. Technical Architecture (Proposed)

```text
cptaincm-portfolio/
├─ public/
│  ├─ assets/
│  │  ├─ portraits/
│  │  │  ├─ portrait-real.png
│  │  │  └─ portrait-miles.png
│  │  ├─ projects/                # replaceable dummy visuals
│  │  └─ icons/
│  └─ resume/                    # only when real resume is supplied
├─ src/
│  ├─ app/
│  │  └─ App.tsx
│  ├─ components/
│  │  ├─ layout/                  # Navbar, Menu, Footer
│  │  ├─ hero/                    # PortraitLayers, LiquidReveal, AmbientBackground
│  │  ├─ motion/                  # Loader, StickyStack, ScrollReveal
│  │  └─ ui/                      # Buttons, SectionHeader, ProjectCard
│  ├─ sections/
│  │  ├─ Hero.tsx
│  │  ├─ About.tsx
│  │  ├─ Projects.tsx
│  │  ├─ TechStack.tsx
│  │  ├─ Experience.tsx
│  │  ├─ DeveloperActivity.tsx
│  │  └─ Contact.tsx
│  ├─ data/
│  │  ├─ site.ts                # brand, headline, profile, CTA labels
│  │  ├─ about.ts               # dummy bio
│  │  ├─ projects.ts            # dummy project array
│  │  ├─ tech.ts
│  │  ├─ experience.ts
│  │  └─ activity.ts             # honest placeholder states
│  ├─ hooks/                    # viewport, reduced motion, pointer/motion helpers
│  ├─ styles/
│  │  ├─ tokens.css
│  │  └─ global.css
│  ├─ types/
│  └─ main.tsx
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
└─ plan.md
```

**Implementation notes:**
- Use typed data objects and reusable components; do not hardcode project copy across UI files.
- Keep effects modular. A broken shader should fall back to static portraits, not break the whole page.
- Consider GSAP + ScrollTrigger for the KIMI-style stacked sections **after** confirming basic native scrolling and anchor links work.
- Use Lenis only if truly necessary, only after checking accessibility and scroll conflicts; smooth scrolling is optional.
- Split/lazy-load noncritical effects and below-the-fold sections where sensible.
- Secrets/tokens must remain outside the public client bundle.

---

## 8. Dummy Data & Content Replacement Rules

- Brand identity and hero decisions are **confirmed**; do not turn them into fictional personal claims.
- Every dummy record should be marked `isPlaceholder: true` (or similar) and editable in one place.
- Suggested data types: `SiteConfig`, `Project`, `ExperienceEntry`, `TechnologyGroup`, `ActivitySource`.
- Project placeholders have valid local placeholder art but **no invented external URLs**.
- Statistics modules use `not-connected`/`no-data` states rather than fake achievements.
- Resume download is shown as non-deceptive pending/disabled text until a file exists.
- Before launch, check each remaining dummy content field, link, and image in a **content replacement checklist**.

---

## 9. Implementation Roadmap

### Phase 0 — Assets and setup

- [ ] Initialize React + TypeScript + Vite project.
- [ ] Organize and copy **existing user-provided portraits** into the project.
- [ ] Verify alpha channels, display dimensions, and fallback rendering.
- [ ] Set up typography loading, color tokens, base reset, responsive conventions.
- [ ] Add data model with clearly labeled dummy content.
- **Exit criterion:** app builds; original portrait renders on void-black background; type and branding correct.

### Phase 1 — Static, responsive full page

- [ ] Create Navbar, Footer, Hero and all planned sections with dummy data.
- [ ] Implement split heading and portrait-centered desktop layout.
- [ ] Make tablet/mobile layouts without overlap or hidden primary CTA.
- [ ] Wire anchor navigation to Projects and Contact.
- [ ] Provide accessible menu with Escape-to-close and focus management.
- **Exit criterion:** full site navigable with effects switched off; layout usable at target breakpoints.

### Phase 2 — Cinematic Hero & reveal prototype

- [ ] Implement ambient glow, quiet contours and the spring-driven web.
- [ ] Create aligned `portrait-real`/`portrait-miles` layers.
- [ ] Prototype KIMI B–A–C liquid mask, pointer speed trail, quick fade, localized lighting.
- [ ] Show the original portrait on touch and with reduced motion.
- [ ] Add nonblocking intro loader and staggered entrance.
- **Exit criterion:** real → Miles interaction works and returns smoothly; fallback works without advanced renderer.

### Phase 3 — Sticky stack & section polish

- [ ] Add Hero → About → Projects stacked transitions without obstructing scroll/anchors.
- [ ] Apply Lumora-style typography and restrained reveals in About.
- [ ] Add project card hover zoom and link states.
- [ ] Ensure effects shut off when offscreen, and simplify motion on lower-end devices.
- **Exit criterion:** transitions feel coherent and never prevent users from accessing content.

### Phase 4 — UX, accessibility, performance

- [ ] Check keyboard-only navigation, logical focus order and visible focus rings.
- [ ] Check screen reader semantics, alt text, correct H1 and CTA labels.
- [ ] Validate normal-text contrast >=4.5:1 and non-text meaningful UI >=3:1.
- [ ] Check touch targets (~44px+ preferred), mobile portrait/landscape, no horizontal scroll.
- [ ] Verify reduced-motion behavior and no hover-only essential action.
- [ ] Compress responsive images, optimize fonts and code splitting.
- [ ] Profile frame drops during active reveal and stacked scroll; tune or fall back as needed.
- [ ] Audit assets and real-vs-dummy content; remove dead links.
- **Exit criterion:** accepted on desktop/mobile with no critical accessibility, animation, or navigation defects.

### Phase 5 — Real content, QA, deployment (after approval)

- [ ] Replace dummy About, Projects, Stack, Experience and Contact data.
- [ ] Add verified GitHub/WakaTime connections only when configured.
- [ ] Add actual resume, social links, metadata, SEO/OG image, favicon.
- [ ] Recheck all content claims, permissions, links, device behavior, and production bundle.
- [ ] Deploy to selected host only when requested and credentials/access are available.

---

## 10. Testing and Acceptance Criteria

### Required viewport coverage

- Mobile: **320px**, **375px**, and a larger phone width; portrait + landscape.
- Tablet: **768px**.
- Laptop: **1024px** and common short-height screens.
- Desktop: **1440px** and large display.
- Test browser zoom / enlarged text to ensure no inaccessible or clipped essentials.

### User journeys

- [ ] Landing immediately shows name, role, and primary CTA.
- [ ] Wordmark exactly reads **`cptaincm.`**, all lowercase, with two-color distinction.
- [ ] The real portrait appears at rest after the desktop opening wipe, and immediately on touch and reduced motion.
- [ ] Moving the pointer reveals Miles with the irregular B–A–C trail. The portrait returns at idle or on exit, and the nearby web springs back.
- [ ] The original portrait remains visible at all sizes wherever the decorative reveal is inactive.
- [ ] Crop at hero bottom hides source image cutoff at rest and during sticky transition.
- [ ] Headline and CTAs remain readable without portrait overlap at tested widths.
- [ ] Stacked scroll operates only over the first three sections and doesn't hijack navigation.
- [ ] Project and contact navigation works immediately even if animations are busy or disabled.
- [ ] Placeholder records are clearly identified; no fictitious URLs or analytics masquerade as real.
- [ ] Site remains usable when Canvas/WebGL is disabled, fails, or the user requests reduced motion.

### Indicative quality goals (to measure, not assert beforehand)

- Aim for Core Web Vitals **LCP <= 2.5s**, **CLS <= 0.1**, **INP <= 200ms** under an agreed measurement profile.
- Target smooth 60fps interaction on capable desktop hardware (about 16.7ms per frame); degrade gracefully on weaker hardware.
- No blocking loader for decorative animation; responsive page is usable before optional effects finish.
- Avoid extra animation and image bytes when device capabilities/network are limited.

---

## 11. Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| Real and Miles images are not pixel-perfectly aligned | Overlay verification and non-destructive positioning; accept small differences until they become visibly distracting |
| Liquid mask too heavy | Start with 2D mask prototype, profile, selectively upgrade; static/crossfade fallback |
| Overanimated background | Glow and contours drift slowly. The web reacts locally and stops when settled or offscreen. |
| Short viewport crops headline/CTA | Allow section growth; simplify hero composition at narrower/shorter breakpoints |
| Sticky scroll blocks anchors/focus | No scroll hijacking; fallback to standard document flow when necessary |
| Bright red small copy fails AA | Use `#FF5266` for normal-sized red text and test over gradients |
| Placeholder project content accidentally published | `isPlaceholder` flags and prelaunch content audit |
| Unavailable stats/resume/links | Explicit unavailable states, no fabricated numbers or fake download |
| Third-party character artwork in public portfolio | Verify asset rights/usage and deployment context before publishing |

---

## 12. Definition of Done

The first functional version is considered **complete for review** when:

1. Full responsive site builds successfully in React + TypeScript + Vite.
2. Brand, Hero, two portrait layers and KIMI B–A–C interaction behave as specified.
3. About and Projects flow into each other with accessible, non-blocking sticky transitions.
4. The rest of the sections render with clearly replaceable dummy data and correct interaction states.
5. No critical content is hidden by animation, photo overlap, or narrow viewports.
6. No severe regressions in keyboard/touch/reduced-motion behavior.
7. Performance is measured and heavy effects are reduced or disabled where necessary.
8. Remaining sample content and unpublished integrations are explicitly documented.

---

## 13. Reference Sources and Design Guardrails

- **User-provided KIMI reference:** inspiration for cinematic hero, pointer-responsive reveal feel, loader, and initial sticky-stacked sections. **Adapt**, do not reproduce branding or racing content.
- **User-provided Lumora reference:** inspiration for editorial typography, whitespace, story flow, readable project cases, and softer scroll reveals.
- **UI UX Pro Max skill:** [Repository](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill), [SKILL.md](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/.claude/skills/ui-ux-pro-max/SKILL.md), [UX Quick Reference](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/.claude/skills/ui-ux-pro-max/references/quick-reference.md).
- UI/UX priority order: accessibility → interaction/touch → performance → style consistency → responsive layout → typography/color → meaningful motion.
- **Status of skill application:** documented rules reviewed and applied to planning; the repository's `search.py --design-system` generator has **not** been run here. If used later, reconcile its suggestions against all locked user decisions above.

---

**Execution note:** Version 1.6 tightens the opening window and contains project thumbnails at narrow widths. Review uses editable sample content in `src/data/`. See `IMPLEMENTATION_STATUS.md` for QA evidence and open items.

# Implementation status — cptaincm.

Updated 22 November 2026.

## Implemented for local review

- React, TypeScript and Vite with local fonts, metadata and a favicon.
- Three desktop Hero columns place the name and full `Full Stack Developer` heading on the left, the portrait in the center, and specialty, location, and actions on the right. Compact screens keep the text in normal document flow.
- The desktop Hero opens with Miles, then reveals the original portrait with a top-to-bottom dissolve. A shared, capped-resolution field draws the striped trail across the Hero and reveals Miles where it overlaps the portrait. The Meshy image returns at rest.
- Crimson and midnight-blue illumination over a void-black base. Canvas 2D web strands bend and rebound near the pointer, with a softer web behind text and controls. Touch and reduced motion use a still web and show the original portrait.
- The desktop masthead has direct section links with current-section feedback and a contact action. Compact screens use the native menu. About rises over the pinned and dimmed Hero, then Selected Works rises over About. The stack works on mobile, tablet and short viewports. Phone-width panels darken at full width. Decorative strands straighten at the incoming edge as the panels cross. Reduced motion uses normal flow.
- The Hero uses the supplied Meshy relight at its original brightness. The Miles layer is proportionally scaled and repositioned around the face for closer head and shoulder alignment.
- Headings, project cards, skill groups, experience rows, and activity cards animate as they enter view. The editorial sections retain editable sample content and explicit labels for unavailable links and integrations. About links from its short example to the featured Nexus case study, whose large preview sits beside the challenge, role and solution on desktop and above them on compact screens.
- Comic Universe brings ivory paper, ink rules, red headings, yellow accents and static halftone to every section. Dark Cinematic is the first-visit theme. The Comic Universe toggle appears in the navbar from 480 px and inside the menu below that width. The choice is restored before React renders and can change while the menu is open or the stack is mid-transition.
- Both themes share the same portrait assets and desktop reveal. Touch uses the still portrait and leaves the Miles asset unloaded. The Comic backdrop replaces the animated glow, contours, and web with static decoration.

## Verified

- TypeScript and the Vite production build pass.
- Version 1.6 passed the project-thumbnail and menu checks at 320 × 568, 375 × 812, 390 × 844, and 844 × 390. Chromium verified that a delayed Miles image enables pointer reveal after the opener closes, and that timely image loads still play the opening dissolve.
- Playwright Chromium verified both pinned transitions and draw order at 1280 × 650, 1024 × 700, 768 × 960, 390 × 844, 844 × 390 and 1440 × 900. It checked intermediate scroll positions, the phone-width scale, direct anchors and reduced motion.
- The Hero and case-study runs checked the quieter web, blue rim, pointer reveal and return to the real portrait, two responsive case-study layouts, and the About link to the sample. Scroll-driven seam tension and its reduced-motion fallback were also checked.
- Playwright verified the full-Hero trail at both sides and near the bottom, its blend across the face, its return to rest, CTA click-through, and the touch and reduced-motion fallbacks. Both WebPs have transparent alpha and use a 2048 × 1364 canvas.
- Comic QA passed at 320, 375, 768, 844, 1024 and 1440 px, with theme persistence, pre-paint selection, blocked storage, keyboard, menu focus, touch, reduced motion, and a 640 px zoom-equivalent layout. Dark section geometry and colors matched v1.6 in the 1440 px comparison. Both portrait hashes matched the backup.
- In a local 1440 × 900 Chromium sample, the 95th-percentile frame interval during theme switching was 17.0–17.2 ms. This measurement describes the test device and browser.

In version 1.5, a local Chromium run at 1440 × 900 sampled 103 frames during movement across the Hero. The median frame interval was 16.7 ms and the 95th percentile was 16.9 ms. Lab LCP was 360 ms and CLS was 0.0017. Cross-browser checks on physical devices, INP and field Web Vitals remain open.

## Phase 5 dependencies

- Approved biography, project assets and links, verified skills and experience, and final contact details.
- Resume PDF, final social sharing image, and permission for the intended use of the portrait artwork.
- Verified GitHub/WakaTime publishing configuration and a hosting choice when deployment is requested.

# Interaction specification

## Shared state model

Both navigation modes must drive one presentation state. The current scene is derived from the single canonical chapter/scroll position; the camera, overlay, progress indicator, and active menu item all read the same scene ID.

Recommended state fields:

- activeSceneId: one of the 15 stable scene IDs.
- locale: th or en.
- reducedMotion: user preference or system preference.
- visualProfile: full, simplified, or static fallback.
- fullscreen: actual browser fullscreen state, not a separate assumed state.

Do not let a click-navigation index and a scroll-scene index advance independently.

## Click-based presentation

- Previous and Next move to the prior/next scene anchor using native scrolling. The scroll controller then updates activeSceneId and the visual timeline.
- Keyboard left/right may navigate scenes when focus is within the presentation. Do not intercept those keys from form controls or unrelated page areas. Escape exits fullscreen or closes the scene menu.
- A scene menu lists concise Thai/English scene labels and moves to the selected anchor. The current item is indicated in text and visually.
- Progress reports the current scene and total, for example 03 / 15, and exposes the same value to assistive technology.
- Fullscreen is an optional enhancement through the browser Fullscreen API. Provide a visible exit control and retain a useful inline layout if the API is unavailable or denied.

## Scroll-driven experience

- Each scene has one semantic DOM chapter/anchor with a stable scene ID.
- A single presentation-level ScrollTrigger coordinator maps the visible chapter/scroll range to the active scene and the scene's camera/data reveal progress.
- Scene-specific motion is tied to a single timeline or progress range. Avoid independent scroll listeners in scene components.
- Keep scene text in normal document flow or a stable overlay. Scrolling should not move small labels unpredictably around the 3D subject.
- Scene transitions may use slow camera reframing, simple object reveal, or diagram steps; do not combine several effects when one clear visual transition is enough.

## Synchronization and lifecycle

1. User scroll, click, or keyboard navigation changes the document position.
2. The shared coordinator determines the active scene and within-scene progress.
3. React presentation state, progress/menu state, DOM content, and the 3D scene receive that same state.
4. The active scene's timeline is updated; outgoing scene timelines are paused and cleaned up.

Clicking Next should scroll to an anchor rather than setting a separate camera state. This makes manual scrolling and button navigation converge on the same source of truth. Use native scroll behavior to avoid adding a scroll plugin solely for navigation. Respect browser history only if a later prototype demonstrates a clear need; it is not required for this phase.

## Language switching

- Thai and English use the same scene IDs and content IDs. Switching language replaces only localized copy and accessible labels.
- Preserve the current scene and approximate scroll position during a language change.
- Keep numeric values, units, and source context in content data rather than rebuilding them in UI components.
- Do not localize or alter stable IDs.

## Reduced motion and compatibility profiles

- Read the operating-system prefers-reduced-motion setting and provide a visible user control to reduce motion.
- Reduced-motion mode disables camera scrubbing, looping objects, particle motion, parallax, and animated number counters. Use fixed camera compositions and instant or short opacity transitions; content and navigation remain complete.
- Simplified mode limits geometry, texture resolution, shadow quality, simultaneous visible objects, and effects. Prefer diagrams and static scene composition.
- Static fallback shows the same headings, figures, units, scene sequence, and text alternatives without WebGL. If WebGL setup fails or the context is lost, keep the HTML presentation usable.
- Mobile and tablet layouts keep overlays in a readable DOM column, avoid text over busy backgrounds, and show one focal object or a 2D graphic per scene.

## Accessibility and input behavior

- Use semantic headings, buttons, and navigation landmarks. All controls have visible focus, descriptive labels, and adequate contrast.
- Provide a transcript/linear reading view containing every source item, including supporting details not shown in the scene's primary layer.
- Announce scene changes and progress politely without reading the entire scene on every scroll tick.
- Treat Canvas visuals as supplementary: provide a concise scene description and expose all essential information as DOM text.
- Keep the user's focus on the activated navigation control or move it intentionally to the destination scene heading; do not create focus traps outside fullscreen.

## Recommended technical coordination

- GSAP/ScrollTrigger owns scene progress and timelines; the presentation controller owns the active scene ID and locale.
- Register one coordinator near the presentation shell. Scene modules provide timeline hooks or camera presets but do not create competing global triggers.
- Use the existing GSAP dependency; do not add ScrollToPlugin unless a later implementation requirement proves native scrolling inadequate.
- Clean up timelines, event listeners, and ScrollTriggers when a scene unmounts. Load only the active or imminent scene's optional model.


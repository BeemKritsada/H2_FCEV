# Implementation roadmap

## Scope

Phase 3 ends with specifications. This roadmap sequences future implementation and does not begin any of it. Preserve the existing React, TypeScript, Vite, Three.js, React Three Fiber, Drei, GSAP/ScrollTrigger, and i18next foundation. Avoid a broad directory rewrite.

## Recommended implementation phases

| Phase | Focus | Planned work | Exit criteria |
| --- | --- | --- | --- |
| 4 | Visual system and presentation shell | Define type scale, contrast, spacing, scene viewport, DOM overlay rules, loading/error state, and responsive layout. Build shell only after approval of storyboard and editorial wording. | Empty/sample scene shell reads well in Thai and English on desktop and mobile; no source content is duplicated in component code. |
| 5 | Navigation, locale, and synchronization | Implement the shared active-scene state; chapter anchors; Previous/Next; scene menu; keyboard behavior; progress; language switch; fullscreen fallback; reduced-motion controls. | Click, keyboard, and manual scroll always converge on the same scene ID and content. |
| 6 | Shared Three.js environment and first visual scene | Add one persistent React Three Fiber Canvas; shared camera and lighting presets; lazy loading; WebGL error fallback; prototype the generic heavy-duty truck in the opening/logistics use. | A single truck composition works in the hero and one logistics setting, with static/2D fallback and no per-scene duplicate canvas. |
| 7 | Core 3D and technical diagrams | Add approved truck/station/industrial environment assets only where they add explanatory value. Build the production-share chart, electrolysis flow, infrastructure status graphic, cold-chain diagram, rail silhouettes, and barrier diagrams. | Each data-heavy scene remains readable without 3D; all 3D models have provenance/license records and stay within the approved source context. |
| 8 | Content integration and responsive behavior | Bind scene registry entries to stable content IDs; integrate all 18 content sections; provide transcript/detail layers; finish mobile/tablet compositions and bilingual labels. | Every source content ID is reachable in the primary scene or a supporting detail/transcript layer in both locales. |
| 9 | Performance, accessibility, and compatibility | Profile on representative desktop/mobile devices; tune geometry, textures, lazy loading, DPR, shadows, reduced motion, keyboard/screen-reader behavior, context-loss fallback, and browser support. | No content depends on WebGL; motion preferences are honored; measured budgets and supported browsers are documented. |
| 10 | Production and offline delivery | Validate static Vite output and base path for DirectAdmin; deploy only when domain/hosting details are approved. Separately choose and implement the Windows offline wrapper, asset packaging, and offline verification. | Online static build loads from its target path; offline package is a separately tested artifact. No offline installer is implied by the current relative-path build. |

## Recommended technical ownership

- src/scenes/: scene registry entries and scene-specific composition. Keep current opening, overview, technology, applications, and closing folders; place scene modules in the closest existing topic folder rather than adding parallel top-level structures.
- src/three/: shared camera presets, lighting, materials, loaders, common environment and generic object helpers. Keep scene-specific model composition in src/scenes/.
- src/animations/: GSAP timelines and the one ScrollTrigger coordination layer. Each scene owns its local reveal sequence; the presentation shell owns global scene progress and cleanup.
- src/components/presentation/: presentation shell, previous/next, scene menu, progress, language/fullscreen/reduced-motion controls, chapter anchors, data overlays, and transcript/details.
- src/content/th/ and src/content/en/: all localized text, labels, source references, and editorial-context copy. Components refer to IDs; they do not restate values.
- src/app/: compose the presentation shell, locale initialization, and fallback state. Avoid embedding a second scene-navigation state machine here.
- public/models/ and public/textures/: only approved, licensed assets with recorded provenance. Keep paths and asset loading lazy.

## State and rendering recommendation

Use a stable scene registry that refers to scene IDs, content IDs, camera presets, an optional scene component, asset requirements, and a concise accessible description. The presentation controller owns locale, activeSceneId, and user motion/quality preferences. The single Canvas reads that state. ScrollTrigger maps chapter progress into the same state; button and keyboard controls navigate chapter anchors.

Keep the Canvas mounted once to reduce context churn, but mount/render only the active scene's optional heavy objects and dispose their resources when leaving. Start with a capped pixel ratio, limited shadow sources, and low texture sizes; tune after measurement rather than claiming a performance target now. A DOM/SVG fallback must retain the same source text and values.

## Decisions and approval gates

- Asset availability: no models or textures were confirmed in the project. Select and license the generic heavy-duty truck before production modeling.
- Scene count: 15 is the recommended plan; confirm whether the user prefers a shorter presentation before fixing the navigation taxonomy.
- Closing copy: the proposed Thai/English closing line in storyboard.md is editorial synthesis and awaits approval.
- Source questions: verify provisional regional/vehicle/mine transliterations, slide 5's early-2026 wording, the 98% production-share total, and the slide 19 missing city list. Keep the supplied content unchanged until resolved.
- Device support: decide minimum browser/device targets and quality thresholds before performance tuning; none are measured in this planning phase.
- Claim sourcing: obtain claim-level references before public/investor use. The source deck itself provides only the GGII April 2026 attribution for the final station totals.
- Offline package: choose the wrapper and local asset strategy in its later phase; this phase does not select a package technology.

## Phase 3 completion gate

Before Phase 4 starts, review the 15-scene order, the mapping table, the proposed closing line, and the asset priority list. The full site, models, visual UI, and animations remain future work.


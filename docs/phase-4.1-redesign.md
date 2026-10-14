# Phase 4.1 — Bright presentation redesign

Implemented locally in C:\web\H2_FCEV on 2026-10-12. This supersedes the earlier dark visual direction only; the approved content, scene identities/order, storyboard narrative, and numerical ledger are retained.

## Files changed

- src/styles/global.css: complete bright visual system, responsive composition, local fonts, compact controls, menu, and reduced-motion treatment.
- src/components/presentation/OpeningScene.tsx (new): DOM title and themes, independent map/vehicle layers, H₂ accents, SVG blue ribbons.
- src/components/presentation/HeroTruck.tsx (new): local concept image with a replaceable future-model slot.
- src/components/presentation/ChinaMap.tsx (new): reusable sourced silhouette with localized descriptions.
- src/components/presentation/SceneContainer.tsx: opening/closing composition and shared editorial scene variants; safe fallback for sections without paragraphs.
- src/components/presentation/SceneVisual.tsx: source-derived production bars, map, vehicle, process, station, refrigeration, and rail templates.
- src/components/navigation/SceneOverview.tsx: modal semantics, initial focus, focus containment, and focus restoration.
- src/app/App.tsx: keyboard navigation and scroll reset when switching scenes; existing locale/menu/fullscreen state retained.
- src/content/schema.ts: paragraph property marked optional, matching the existing approved content shape.
- src/content/en/common.json and src/content/th/common.json: new UI/visual labels only.
- public/assets/: locally bundled image, fonts, map, source feature, licenses, and manifest.
- scripts/prepare-china-map.mjs (new): reproducible SVG generation from the retained source feature.
- README.md, docs/visual-assets.md, docs/phase-4.1-redesign.md: implementation status, provenance, and verification.
- eslint.config.js: excludes the already Git-ignored .tmp/ directory so temporary browser profiles and QA artifacts are not linted as application source.

## Visual implementation

The opening uses white/light-blue space, royal-blue H2 FCEV typography, deep-navy secondary type, a large realistic daylight truck illustration, a separate geographic silhouette, restrained molecules, three non-quantified editorial themes, and a layered blue lower ribbon. Content and controls are real React/HTML elements. Mobile stacks text and imagery, keeps controls reachable, and allows vertical reading instead of shrinking a desktop slide.

All 15 scene templates share the bright typography and colors. The secondary media varies by subject: unnormalized 56/21/21 production bars, clean energy-process sequences, a station schematic, independent passenger/freight rail illustrations, cold-chain power lanes, and orange accents for barriers. These are foundations for detailed scene assets, not a claim that every scene now has production 3D.

The closing reuses the approved presentation title and vehicle motif; the unapproved closing synthesis in the planning document has not been promoted into final copy.

## Content integrity

The two source section JSON files, both presentation-title modules, glossary data, and source-number ledger were not edited. Existing previews remain connected to their original content IDs. No supplied numerical claim was changed. Production shares use a 0–100% scale without normalizing the total of 98%. The new themes are qualitative presentation themes only.

The previous regions scene tried to index a missing paragraphs array. The renderer now safely uses the existing source list when no paragraph is supplied. No source wording was rewritten to fix this.

## Verification

Final result: TypeScript, ESLint, production build, relative-base offline build, and content checks all passed. All 180 browser combinations passed with no JavaScript/console/network asset errors. Fullscreen entry and exit succeeded. Source-file hashes matched the pre-edit snapshot.

The built production bundle and offline bundle were also served independently (offline under /offline/): images and both fonts loaded, locale switching and next-scene navigation worked, and no external runtime asset request occurred. See .tmp/qa/build-report.json.

- TypeScript: `npm.cmd run typecheck`.
- ESLint: `npm.cmd run lint`.
- Production: `npm.cmd run build`.
- Relative-base offline foundation: `npm.cmd run build:offline`.
- Existing numeric/content ledger: `npm.cmd run content:check`.
- Browser: isolated headless Microsoft Edge through its DevTools protocol, using the existing installed browser (no browser/test dependency installation).
- 180 scene/language/viewport combinations: 15 scenes × EN/TH × 1920×1080, 1440×900, 1024×768, 768×1024, 390×844, 320×740.
- Checks cover scene progression and boundaries, translated headings, image completion, local font loading, horizontal overflow, menu jump/close, focus restoration, previous/next, keyboard navigation, and fullscreen entry/exit.
- JavaScript exceptions, console errors, and failed HTTP assets are monitored.
- Representative opening desktop/tablet/mobile and secondary-scene screenshots visually reviewed. Local evidence and detailed matrix: .tmp/qa/.
- Visual review found and fixed a 320px scrollbar-width overflow; the final matrix compares document scroll width against client width, including scrollbar space. Controls stay sticky and the conceptual-vehicle label stays clear of the energy ribbon.
- Motion is a single short title/content entrance, disabled by prefers-reduced-motion. There is no looping animation or autoplay.

The primary browser automation runtime failed to initialize because of its Windows sandbox helper. The installed Edge headless fallback completed browser verification. This verifies Chromium behavior and emulated viewport sizes; actual Safari/iPad hardware has not been tested.

## Remaining assets and next step

See [visual-assets.md](visual-assets.md) for exact provenance, prompt, and outstanding model/map needs. Next: review the visual direction against the actual reference image, then replace selected concept/schematic layers with licensed, technically reviewed vehicle and industrial assets. Keep all source data and bilingual labels in the DOM; add only purposeful motion after asset review.


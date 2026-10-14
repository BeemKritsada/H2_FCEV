# Scene 27 — cold-chain comparison

The existing scene `scene-refrigerated-logistics` remains unchanged. The new `scene-cold-chain-comparison` is inserted at position 27, after `scene-rail-specialized`. The presentation now has 31 scenes.

The two supplied cutout images were inspected before use, then copied byte-for-byte from `dist/assets/images/logistics/` into the persistent `public/assets/images/cold-chain/` directory. Both are 1672 × 941 RGBA PNG files with transparency and matching three-quarter camera perspective. The page serves lossless WebP copies from the same directory (about 40% smaller); a decoded-pixel comparison found identical alpha and identical color at every visible pixel. No replacement, low-poly model, or generated vehicle was introduced.

| Side | Permanent asset | SHA-256 | Size |
| --- | --- | --- | ---: |
| Left · BEV | `public/assets/images/cold-chain/bev-refrigerated-truck.png` | `429A5319B2C296C68743047BEA861C0B36C15C5F6E8989D4434D2093FD5E2B3B` | 1,711,520 bytes |
| Right · FCEV | `public/assets/images/cold-chain/fcev-refrigerated-truck.png` | `B06542C55C064D1AF81822421AC171072877AA3DD5EFE080029E39B019579A92` | 1,719,657 bytes |

The served files are `bev-refrigerated-truck.webp` (1,037,086 bytes) and `fcev-refrigerated-truck.webp` (1,033,104 bytes).

These are illustrative renders, not verified production truck models. The scene says so in its source note. There is no missing asset for the requested comparison.

All figures come from the existing `refrigerated-transport` section, source slide 14: FCEV refueling 10–15 minutes, BEV charging at least 1–2 hours, and FCEV range 500–800 km. The copy labels them as scenario-dependent and avoids an unsupported BEV range, payload value, or energy-efficiency percentage. Thai and English content is in separate new locale files; the original section data is unchanged.

The four topic states are Energy Load, Payload, Refueling / Charging Time, and Driving Range. Time is selected by default. The two truck images stay mounted while the topic detail changes. The existing `StateNumberSequence` remembers each topic's first-view count in the presentation session, including after language changes and scene revisits. The FCEV time counts before the BEV time. GSAP entrance and detail timelines are cleaned up when the component unmounts or the topic changes.

QA: `npm run build`, `npm run lint`, content/reference and Batch 1–5/8 checks, and browser checks for Scene 27 and the earlier batches passed. Browser checks covered 1920 × 1080, 1440 × 900, 1366 × 768, and 390 × 844 in Thai and English, all four topics, image loading, navigation 26–28, first-selection count order, language/revisit stability, rapid topic changes, reduced motion, layout bounds, and console output. The Vite build retains its existing warning about chunks larger than 500 kB.

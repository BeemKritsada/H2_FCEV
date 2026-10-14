# Phase 4.1 visual assets

All runtime files are local. No image, font, map, or model is hotlinked. Asset URLs respect Vite's base path.

| Asset | Local file | Origin / rights | Notes |
| --- | --- | --- | --- |
| Generic hydrogen truck | public/assets/images/hydrogen-truck.jpg | Generated with the built-in Imagegen tool on 2026-10-12. No third-party stock/model license is asserted. | 1536 × 1024, JPEG quality 88, 265,312 bytes. Generic conceptual illustration, not a real model or technical reference. Original generated PNG remains in the tool's generated-images folder. |
| China silhouette | public/assets/maps/china-outline.svg | [Natural Earth admin-0, 1:110m](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson), [public-domain terms](https://www.naturalearthdata.com/about/terms-of-use/). | Extracted CHN feature, geographic outline only. No operational routes, pins, or invented regional boundaries. |
| Map source | public/assets/maps/china-source.geojson | Same Natural Earth dataset and terms. | Retained source feature for reproducibility. Run `node scripts/prepare-china-map.mjs` to rebuild the silhouette. Equirectangular projection, 35° standard parallel. Natural Earth geometry/boundary conventions are retained; this is a geographic orientation graphic. |
| Inter variable, Latin | public/assets/fonts/inter-latin.woff2 | [Fontsource distribution](https://cdn.jsdelivr.net/fontsource/fonts/inter:vf@latest/latin-wght-normal.woff2), [upstream OFL](https://github.com/google/fonts/blob/main/ofl/inter/OFL.txt). | 48,256 bytes. Local license: public/assets/licenses/Inter-OFL.txt. |
| Noto Sans Thai variable, Thai | public/assets/fonts/noto-sans-thai.woff2 | [Fontsource distribution](https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-thai:vf@latest/thai-wght-normal.woff2), [upstream OFL](https://github.com/google/fonts/blob/main/ofl/notosansthai/OFL.txt). | 26,924 bytes. Local license: public/assets/licenses/NotoSansThai-OFL.txt. Latin glyphs use Inter. |
| Station / rail / energy ribbon | React inline SVG in SceneVisual.tsx / OpeningScene.tsx | Original code-authored graphics for this project. | Schematics and visual composition only, not verified engineering assets. |
| Interface and process icons | Existing lucide-react dependency | Package's ISC license. | Reuses the installed icon system. No new dependency. |

## Hero generation prompt

Built-in Imagegen was used; no CLI or API-key workflow was used.

```text
Use case: product-mockup
Asset type: standalone hero illustration for a bright premium hydrogen logistics presentation website, not a website screenshot.
Primary request: a visually convincing modern generic hydrogen fuel-cell heavy-duty articulated truck, white and silver cab with restrained royal blue trim and small H2 marking, long silver cargo trailer. Three-quarter front view, cab at lower left and trailer receding toward upper right. Complete vehicle including all wheels visible. Photorealistic high-end industrial advertising visualization, correct plausible truck proportions and engineering, detailed wheels, polished white paint, dark windows, clean blue accents.
Scene/backdrop: a pale concrete logistics apron with subtle road markings, a distant low industrial warehouse and faint container-port cranes. Bright soft daylight, very pale blue-white sky fading to pure white at all image edges. Low horizon. Sparse environment, vehicle dominates lower two-thirds. Landscape 3:2 composition.
Constraints: no brand names or logos, no human figures, no infographic, no map, no title, no statistics, no typography other than a small H2 marking on cab. This is a generic conceptual vehicle, not a specific real model. Do not depict an engineering cutaway, decorative energy streams, neon lighting, or dark backgrounds. Entire truck sharp, premium realistic photography-style rendering. The image will sit on white with a separately coded map and text.
```

The generated image was inspected and converted to JPEG using System.Drawing, without changing the picture content. The truck image is only one media layer: titles, typography, geography, themes, molecules, curves, controls, and all source text are independent DOM/CSS/SVG.

## Replacement contract

`HeroTruck` owns a replaceable media slot, aspect ratio, alt text, and localized caption. Its optional children can contain a future approved GLB/GLTF renderer, with the JPEG retained as a low-power/reduced-motion fallback. No WebGL canvas or fabricated low-quality model is added in this phase. The media layers expose `data-visual-layer` hooks for later controlled GSAP transitions.

## Outstanding

- The reference image itself was not present among the supplied files; visual matching follows the written brief. A direct image-to-result comparison remains outstanding.
- A licensed, technically reviewed generic hydrogen heavy-duty truck GLB/GLTF is still needed for actual 3D.
- Accurate refrigerated truck, passenger train, freight locomotive, and industrial/station assets remain later-phase work. Current secondary scenes intentionally use schematics.
- The source has region and city names, but no verified point coordinates or service-route geometry. Those require reviewed data before adding markers/routes or administrative detail.


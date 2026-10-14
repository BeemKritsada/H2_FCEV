# Batch 7 visual assets and evidence

All three scene photographs are saved under `public/assets/images/rail/` as optimized WebP files. Source photographs are factual vehicle references; there are no generated locomotive substitutes. The UI text is rendered by React, not baked into images.

| Scene | File | Vehicle / presentation role | Format and ratio | Camera and background | Transparency | Source |
| --- | --- | --- | --- | --- | --- | --- |
| 21 | `freight-2400.webp` | 2,400 kW hydrogen freight locomotive; industrial hero | WebP, 1108 × 739, 3:2 | Front view at the 2024 Batuta–Zhunge’er loading test, daylight industrial rail facility | No | [CHN Energy report and photograph](https://www.ceic.com/gjnyjtwwEn/xwzx/202404/a9485e0a063c4ae0ac7825b1a0db73f6.shtml) |
| 22 | `mining-700.webp` | 700 kW hydrogen shunting locomotive | WebP, 1200 × 1016, approx. 6:5 | Three-quarter view hauling cars in snow; real project photograph | No | [CRRC Datong product page](https://www.crrcgc.cc/zcdt/2025-09/28/article_2025092811504928556.html) |
| 22 | `industrial-1400.webp` | 1,400 kW hydrogen locomotive | WebP, 1080 × 720, 3:2 | Three-quarter view inside industrial workshop; real vehicle photograph in a manufacturer-attributed report | No | [CRRC model report](https://www.crrcgc.cc/crrcgc/2021-06/16/article_5E6286A002724FED9915DE6BA50BB487.html), [photograph in CRRC-attributed report](https://www.sohu.com/a/473494511_121119000) |
| 23 | Existing `china-source.geojson` | Geographic outline for location nodes | GeoJSON, vector | Geographic projection; no fabricated rail routes | N/A | [Natural Earth](https://www.naturalearthdata.com/) |

Scene 21 also cites [CRRC's continuous-operation report](https://www.crrcgc.cc/zjen/2024-09/03/article_2024090316061425776.html). The 2,400 kW locomotive and 10,000-tonne level-track test were reported in 2024, so the scene does not present 2026 as the launch year.

There is no blocking visual asset gap. A wider official side-angle photograph of the 2,400 kW locomotive and a higher-resolution manufacturer-hosted photograph of the 1,400 kW locomotive would improve a future visual pass. Before public redistribution of the photographs, confirm the relevant source permissions.

Scene 23's nine city markers use approximate city-center coordinates. The three provincial/regional markers are representative points, not verified test-site coordinates. The supplied slide names the five orange project cities and three freight regions without enough detail to verify their exact current project status; the UI labels these conservatively rather than treating them as operating services.

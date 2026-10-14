# 3D and visual asset plan

## Current project inventory

The project structure contains planned asset directories, but the inspected scene, three, animation, component, and public asset folders contain no confirmed 3D models, textures, or authored illustration files. No external asset has been downloaded or assumed available. Every item below is a future requirement or option, not an existing project asset.

## Classification

1. Essential 3D model.
2. Optional 3D model.
3. Better implemented as a diagram or 2D graphic.
4. Not needed.

| Asset | Classification | Scenes | Production guidance | Reuse and integrity notes |
| --- | --- | --- | --- | --- |
| Generic hydrogen heavy-duty logistics truck | 1 — Essential 3D model | 01, 06, 07, 13, 15 | One high-quality, generic tractor/truck model with restrained materials and clear cab/trailer proportions. Keep H2 equipment subtle unless a verified design reference is supplied. | Reuse in opening/closing and logistics. Do not identify it as a specific Chinese model or imply exact source performance. |
| Hydrogen refrigerated truck | 2 — Optional 3D model | 08 | A distinct box-body/refrigeration configuration or a separately modeled cooling-body kit, with the refrigeration unit visually distinct from the fuel-cell system. | Do not use the general truck model as evidence that all configurations have identical range/payload. |
| Hydrogen refueling station | 2 — Optional 3D model | 05, 06, 14 | A low-detail bay with dispenser and safe clear space; no invented brand, station layout, pressure signage, or geographic location. | Reuse one generic station. Put counts/status in HTML or a 2D graphic. |
| Fuel-cell stack and truck powertrain | 3 — Better as diagram/2D graphic | 07, 13 | Use a labeled system diagram if a technical explanation is needed. A detailed cutaway requires a verified configuration. | Do not invent component layout or imply the source supplies engineering specifications. |
| Hydrogen storage cylinders/tanks | 3 — Better as diagram/2D graphic | 04, 07 | Use simple schematic cylinders with neutral labels only if the content calls for them. | No pressure, size, count, or vehicle-specific configuration beyond the source. |
| Electrolyzer | 3 — Better as diagram/2D graphic | 04, 10 | Diagram renewable electricity to water electrolysis to hydrogen, matching source wording. A simple block is enough. | Avoid adding efficiency, water consumption, operating pressure, or process claims. |
| Wind turbines and solar panels | 2 — Optional 3D model | 04, 10 | Reuse a small, low-detail horizon or use 2D icons; animate only when it explains the flow. | Do not depict generation or production amounts not supplied in the source. |
| Steel production equipment | 3 — Better as diagram/2D graphic | 09, 13 | Use a process flow or simplified furnace silhouette rather than a detailed blast furnace/DRI model. | Keep the Zhanjiang project, planned Hebei/Shandong projects, and trial status distinct. |
| Chemical plant equipment | 3 — Better as diagram/2D graphic | 09 | Use labeled ammonia/methanol process blocks and industrial silhouettes. | Avoid detailed plant design or production-capacity figures not in the source. |
| Hydrogen passenger train and tram | 2 — Optional 3D model | 11 | If 3D is approved, use separate generic train and tram models with distinct callouts; otherwise use 2D silhouettes and an attribute table. | No one model should represent all named vehicles. Verify names and specifications per project. |
| Hydrogen freight/mining locomotive | 2 — Optional 3D model | 11 | A model distinct from the passenger train; begin with a neutral silhouette or diagram until an accurate reference is available. | Keep 2,400 kW, 700 kW, and 1,400 kW contexts attached to their own source description. |
| China outline and regional cluster map | 3 — Better as diagram/2D graphic | 02, 05, 12 | Use an appropriately licensed vector outline with restrained region fills and text labels. | The source does not provide station coordinates or service routes. Use no fabricated point markers. |
| Port, mine, and steel logistics environments | 2 — Optional 3D model | 07, 09 | Build one modular, low-detail industrial set only if the truck scene needs depth; prioritize a clear route and truck silhouette. | Reuse generic environmental pieces, but label named locations only as source text, not as exact geospatial depictions. |
| Buses, passenger cars, two-wheelers, airport shuttles, waste trucks, container tractors, vessels, drones, tourist vehicles | 3 — Better as diagram/2D graphic | 06, 11, 12 | Use a consistent icon/silhouette family for the breadth of modes. | Avoid a large catalog of tiny 3D objects that competes with the story. |
| Decorative hydrogen molecule, floating labels, particle cloud | 4 — Not needed | None | Omit unless a later visual test proves a specific explanatory purpose. | Do not use generic particles as a substitute for a process explanation. |
| Volumetric fog, high-resolution environment textures, branded marks | 4 — Not needed by default | None | Avoid by default; use only after a visual/performance test and asset-rights check. | Not required to achieve the requested industrial style. |

## Asset acquisition and review

- No model or texture is treated as available until its file, license, source, and technical fit have been checked.
- Prefer original low-poly/stylized models or properly licensed assets with documented attribution. Do not download or include unlicensed files.
- Keep any later asset manifest outside scene code, with owner/source, license, file path, approximate texture sizes, and intended scenes.
- Use compressed GLB for browser delivery where suitable, load only assets needed by the active scene, and provide a static/2D fallback.
- Reserve high detail for the single heavy-duty truck. Use diagrams when their labels and values matter more than geometry.
- Do not bake source values, place names, or language-specific labels into a model texture; render those in accessible HTML/DOM layers so Thai and English remain clear.

## Proposed production order

1. Approve the generic heavy-duty truck reference and license.
2. Create a station/port/mine mood board and choose whether a reusable industrial backdrop is worth the performance cost.
3. Produce the electrolyzer/energy flow, percentage bars, locomotive/tram silhouettes, and region map as 2D/vector first.
4. Add optional 3D models only where a prototype shows that motion or spatial understanding improves the explanation.


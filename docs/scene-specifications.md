# Scene specifications

## Shared conventions

The specifications below describe future implementation targets only. Scene text stays in the DOM and reads from the prepared locale content IDs. The 3D canvas is supplementary. Scroll and click navigation share the canonical active scene ID and within-scene progress described in interaction-spec.md.

Performance notes are planning estimates, not measurements. Use a single restrained focal subject, lazy-load optional assets, and keep a readable 2D/DOM fallback. Each scene may be opened directly through click navigation or reached by scroll; the same state and content must result.

## 01 — Opening

- Identity: scene-opening; Thai: H2 FCEV สำหรับโลจิสติกส์ในจีน; English: H2 FCEV for Logistics in China; source: presentation title, slide 1. Objective: introduce hydrogen and logistics. Main message: the presentation concerns hydrogen fuel-cell vehicles in logistics in China.
- Composition: primary subject is one generic heavy-duty truck. Foreground: a small amount of ground plane and truck silhouette. Midground: restrained dock/industrial forms. Background: deep navy, horizon lights. Use a cyan edge light, white title at upper-left, and no data overlays. Desktop can use a wide side-front view; mobile uses a closer static crop with title in a separate DOM column.
- Motion: fade/reveal the truck and title; slow camera drift only if reduced motion is off; no wheel-spin loop. On scroll, reveal the title once and settle. Click navigation lands on the opening anchor. Exit is a gentle camera pullback toward Scene 02.
- Information: title only. No statistics. Alt description says “A hydrogen heavy-duty truck in a dark industrial setting.”
- Performance: medium polygon budget for the one truck; no simultaneous secondary models; one compressed GLB and small texture set. Mobile and low-power fallback is a still truck silhouette or illustration; reduced motion is static.

## 02 — China's hydrogen-energy system

- Identity: scene-china-scale; Thai: ระบบพลังงานไฮโดรเจนของจีน; English: China's Hydrogen Energy System; source: china-hydrogen-overview, slide 2. Objective: establish scale and value-chain scope. Main message: the source describes annual production above 36.5 million tonnes and a broad industry chain.
- Composition: primary visual is a flat China outline and a horizontal production-to-use chain. Foreground: selected chain node. Midground: map silhouette. Background: dark navy grid-free field. Cyan connects process nodes; white heading and two large text figures/claims remain in a fixed overlay. Mobile stacks map above the text.
- Motion: chain nodes appear one at a time; no geographic route animation. Scroll progresses through the chain; click enters the same start state. Exit sends the chain line toward Scene 03.
- Information: “Hydrogen energy in China”; 2026 data context; annual production exceeds 36.5 million tonnes; supply-chain scope. Keep “most complete” and “first” attributed to the source claim.
- Performance: low geometry; prefer SVG for the map and DOM for nodes. No textures required. Mobile uses a static map and text; lower-performance mode removes map animation.

## 03 — Production mix

- Identity: scene-production-mix; Thai: โครงสร้างการผลิตไฮโดรเจน; English: Hydrogen Production Structure; source: hydrogen-production-structure, slide 3. Objective: explain the production shares as stated. Main message: three production categories have stated values that do not total 100%.
- Composition: primary visual is three horizontal bars on the same 0–100 scale. Foreground: direct percentage labels. Midground: restrained coal/by-product/natural-gas line symbols. Background: dark industrial wall. Use muted slate for fossil/feedstock rows and cyan for text accents; labels stay outside the bars. Mobile uses vertical rows with the same scale.
- Motion: reveal each bar once from zero to its source value, with motion disabled in reduced mode. No pie/donut. Click and scroll resolve to the same bar values; exit leaves the bars legible before Scene 04.
- Information: 56% coal-derived grey hydrogen, 21% industrial by-products, 21% natural gas. Add a source note that the stated shares total 98% and the source does not explain the remainder.
- Performance: low geometry; DOM or SVG bars, no 3D equipment. No texture loading. Mobile and low-performance use static bars. Do not animate values as if they were changing data.

## 04 — Green hydrogen route

- Identity: scene-green-hydrogen; Thai: จากพลังงานหมุนเวียนสู่ไฮโดรเจนสีเขียว; English: From Renewable Power to Green Hydrogen; source: hydrogen-production-structure, slide 3. Objective: clarify the source's described process and project status. Main message: the source describes wind/solar-powered electrolysis and reports operating and under-construction capacity.
- Composition: primary diagram flows from wind/solar symbols to a water-electrolysis block, then a storage symbol. Use no detailed molecule animation. Foreground: one active step. Midground: simplified equipment shapes. Background: low-contrast horizon. Keep 250,000 tonnes/year and 900,000 tonnes as two separately labeled status figures; put “operating” and “under construction” in text. Mobile presents a vertical step diagram.
- Motion: a light pulse follows one connection at a time; camera stays almost fixed. Scroll reveals the process and then the two status labels. Click navigation starts at the same first step. Exit follows the line to Scene 05.
- Information: wind/solar electrolysis; operating capacity 250,000 tonnes/year; 900,000 tonnes under construction; Xinjiang, Inner Mongolia, Gansu; domestic equipment manufacturing above 90% may be a secondary detail layer. Do not add process efficiency or water-use data.
- Performance: low-to-medium. A simplified electrolyzer may be optional, but SVG blocks are the default. Limit animated lines to one. Mobile and low-power use static SVG/DOM.

## 05 — Stations and infrastructure

- Identity: scene-infrastructure; Thai: สถานีและโครงสร้างพื้นฐาน; English: Stations and Infrastructure; source: hydrogen-infrastructure, slide 4; station-counts-and-service-cities, slide 19. Objective: distinguish station status and delivery constraints. Main message: completed stations, planned projects, and forecasts are different states.
- Composition: primary subject is one generic station bay with a stationary truck. Foreground: status labels and count timeline. Midground: station silhouette. Background: faint regional-cluster labels and a separate pipeline diagram. Color marks are paired with text: completed, planned/under construction, forecast. Mobile removes the map layer and keeps the status list.
- Motion: dispenser light turns on; status figures reveal sequentially; camera does not orbit. Scroll reveals completed then planned then forecast. Click navigation enters the same sequence. Exit travels along a simple pipeline line.
- Information: 557 completed; 177 planned/under construction; more than 650 forecast by end-2026; about 60% regular public use; 4 clusters; storage/transport 30%–40% of retail price; pilot pipes versus scarce trunk pipelines. Include GGII April 2026 attribution for slide 19 figures and note that its city list is absent.
- Performance: medium only if the optional station model is used; otherwise low. One truck/station pair maximum. Reuse the generic truck; no station markers or invented locations. Mobile uses a static station symbol and DOM status labels.

## 06 — Vehicle deployment

- Identity: scene-vehicle-deployment; Thai: การใช้งานยานยนต์; English: Vehicle Deployment; source: vehicle-deployment, slide 5. Objective: show fleet composition and the source's time context. Main message: the source describes commercial-vehicle dominance and a market adjustment in early 2026.
- Composition: truck occupies the visual focus; passenger-vehicle silhouettes remain smaller and secondary. Foreground: commercial/passenger share labels. Midground: small fleet silhouette row. Background: dark road/yard. Use a simple split/range graphic rather than a 3D count of vehicles. Mobile shows one silhouette plus stacked values.
- Motion: fade in the truck, then reveal the fleet and monthly sales statements as separate time labels. No counter effect. Scroll/click share the same scene. Exit focuses on the truck for Scene 07.
- Information: approximately 40,000 cumulative vehicles at end-2025; nearly 3,600 vehicles/month at end-2025; over 95% commercial and under 5% passenger cars; heavy trucks above 65% of commercial vehicles; early-2026 adjustment. Keep the time wording and denominators visible.
- Performance: medium if the truck model is active; all other vehicle types can be SVG silhouettes. Load no fleet copies as individual meshes. Mobile/low-power uses one static truck silhouette. The source's early-2026 phrase remains an editorial note.

## 07 — Heavy-duty logistics

- Identity: scene-heavy-duty-logistics; Thai: รถบรรทุกหนักและโลจิสติกส์; English: Heavy-Duty Trucks and Logistics; sources: four-application-sectors-transport, slide 6; heavy-duty-truck-logistics, slide 9. Objective: explain truck use cases and their separate source claims. Main message: the source describes fixed routes and closed industrial settings as the most established use case.
- Composition: one truck moves through an abstract port or mine-to-plant route; do not show multiple sites as a precise map. Foreground: anchored specification text. Midground: truck. Background: simplified industrial geometry. Desktop allows a broad scene and narrow text rail; mobile fixes the truck image above a readable specification list.
- Motion: low-speed forward camera movement or parallax; no rapid wheel animation. Reveal one operating context at a time. Clicking to the scene or scrolling into it must not replay or alter values. Exit shifts the trailer silhouette to the cold-chain vehicle in Scene 08.
- Information: mines, ports, steel mills/plants, intercity freight; 3–5 minutes; 600–1,000 km; stable at -30°C; payload comparison; 10,000-tonne truck convoys and named locations; fixed routes/closed zones. Keep slide 6 and slide 9 as separate content layers and retain the differing location lists.
- Performance: medium. One truck, a few low-poly industrial forms, no crowd/traffic. Reuse the hero model only as a generic truck. Mobile keeps the model static; low-power falls back to SVG.

## 08 — Refrigerated freight

- Identity: scene-refrigerated-logistics; Thai: ขนส่งสินค้าเย็น; English: Refrigerated Freight; source: refrigerated-transport, slide 14. Objective: make the propulsion and cooling load distinction understandable. Main message: the source compares H2 and BEV refrigerated-freight constraints.
- Composition: primary visual is a distinct refrigerated box truck or a body kit showing a cooling unit. Foreground: separate propulsion and refrigeration labels. Midground: truck cutaway/side view. Background: clean cold-chain loading bay, not snow or a temperature claim. Use two clearly named comparison lanes in DOM. Mobile switches to a simple vehicle diagram.
- Motion: reveal the cooling and drive-system labels separately; no animated temperature or performance dial. Camera remains fixed. Click and scroll share the same reveal order. Exit cool-blue light transitions into the industrial process scene.
- Information: BEV propulsion and refrigeration demand; payload note; H2 refueling 10–15 minutes; BEV truck at least 1–2 hours; H2 refueling supports 500–800 km. Do not transfer general truck figures to this scene.
- Performance: medium only with a separate refrigerated model; a 2D side diagram is preferred until an accurate asset exists. One model and one small texture set maximum. Mobile and low-power use labeled SVG/HTML.

## 09 — Industrial applications

- Identity: scene-industry; Thai: การใช้ไฮโดรเจนในอุตสาหกรรม; English: Hydrogen in Industry; source: industrial-hydrogen-applications, slide 7. Objective: connect hydrogen with steel and chemical process examples. Main message: the source describes industrial shifts and projects with differing maturity.
- Composition: primary visual is a two-lane process diagram: ore reduction/steel and chemical feedstocks. Foreground: process labels and status terms. Midground: simplified furnace/chemical icons. Background: low-contrast steelworks. Labels remain fixed, not floating. Mobile places one process lane per viewport.
- Motion: show input-to-process-to-output with a single line sweep; camera remains static. Planned projects and small-scale trials are revealed only after operational examples. Click/scroll use the same sequence. Exit dims the process line into the energy-flow line in Scene 10.
- Information: Baowu Zhanjiang million-tonne-scale zero-carbon line; green hydrogen replacing coke; Hebei/Shandong projects planned; green ammonia/methanol; fertilizer, polypropylene, refining; one plant may reduce over 100,000 tonnes/year; building materials and non-ferrous trials. Keep “may,” “planned,” and “trial” qualifications.
- Performance: low. Use SVG/process diagrams and one abstract background; no detailed industrial machine. No simultaneous animated mechanisms. Mobile and fallback are static diagram plus text.

## 10 — Power generation and storage

- Identity: scene-power-storage; Thai: ผลิตไฟฟ้าและกักเก็บพลังงาน; English: Power Generation and Storage; source: power-and-energy-storage, slide 8. Objective: explain the source-described system pathway. Main message: the source presents hydrogen as one storage and generation scenario.
- Composition: primary visual is a five-step diagram: surplus wind/solar electricity, electrolysis, hydrogen storage, fuel-cell generation, grid. Secondary text identifies remote backup, CHP demonstrations, and small blending. Use a simple dark horizon only as a backdrop. Mobile presents a vertical flow.
- Motion: animate one connector at a time, not all nodes. Camera fixed. Scroll reveals each process step; clicking jumps to the scene and starts from a static or first-step state. Exit returns from grid line to transport infrastructure.
- Information: off-peak electrolysis, long-duration storage, peak fuel-cell power; remote islands, border camps and data centers; CHP demos; small hydrogen blending in coal boilers. Do not imply universal deployment.
- Performance: low; all graphics can be SVG/DOM. If renewable horizon is used, use few static meshes. Reduced motion/fallback shows all steps at once.

## 11 — Rail and specialized transport

- Identity: scene-rail-specialized; Thai: รถไฟและยานพาหนะเฉพาะทาง; English: Rail and Specialized Transport; sources: four-application-sectors-transport, slide 6; passenger-rail, slide 10; freight-and-mining-locomotives, slide 11. Objective: distinguish named transportation modes and specs. Main message: rail/tram and specialized uses are separate projects with separate attributes.
- Composition: three independent visual bays: passenger commuter train/tram, freight/mining locomotive, and other specialized/trial transport as a small icon strip. Foreground: project labels. Midground: separate silhouettes. Background: simple track/port geometry. Mobile uses a vertical list with one mode at a time.
- Motion: move a single silhouette a short distance along a straight line; no speed-based visual claim. Reveal each specification with its named subject. Click/scroll use the same project order. Exit reduces vehicles to map labels for Scene 12.
- Information: Chengdu train: 4 cars, 160 km/h, over 1,000 km, 15-minute refuel; Foshan/Gaoming tram: 2019, 6.5 km, 100 km; Chuan Chun Hao/Chuan Song Hao started passenger service in 2026; 2,400 kW Batu Ta mine locomotive, 10,000 tonnes, over 12 hours; 700 kW/1,400 kW trials; slide 6 buses, tram, commuter, river, mine, drone and tourist modes. Each value stays attached to its source vehicle/project.
- Performance: medium with one optional model at a time; use separate models for passenger and freight types. Texture detail low. Mobile/fallback uses labelled silhouettes. Flag names and “world's first” for verification.

## 12 — Regional deployment

- Identity: scene-regions; Thai: กลุ่มพื้นที่สาธิตและการใช้งาน; English: Regional Deployment; source: regional-deployment, slide 18. Objective: show the source's named regions and use cases. Main message: the source describes clusters and other locations without providing coordinates.
- Composition: flat map silhouette with one region label revealed at a time. Foreground: text panel of uses and named locations. Background: unmarked navy. Do not use point pins or route lines. Mobile uses a list or one region per screen, with the map simplified.
- Motion: highlight a broad region shape, then show its labels; no camera zoom to unsupported city coordinates. Click menu and scroll align on the same region. Exit removes the map labels rather than implying new supply lines.
- Information: Greater Bay Area and Guangdong; Beijing-Tianjin-Hebei; Yangtze River Delta source list; Chengdu-Chongqing; other areas; Guangdong 69 stations. Include the source's city/use examples. Mark Qingdong, Nannan, and the Shandong/Yangtze listing for review.
- Performance: low, preferably vector map. No 3D geography or map tiles. Mobile uses text-first region list. Static SVG is the full compatibility fallback.

## 13 — Advantages and use cases

- Identity: scene-advantages; Thai: ข้อได้เปรียบและโอกาสการใช้งาน; English: Advantages and Use Cases; sources: fcev-advantages, slide 13; hydrogen-industry-advantages, slide 15. Objective: organize source-stated advantages by application. Main message: the source links refueling, cold operation, heavy transport, storage, and industrial use to specific cases.
- Composition: one large typographic message changes across five beats; small supporting diagrams show a refueling hose, cold-weather truck, heavy freight, storage timeline, and industrial sectors. Background is consistent and dark. Mobile displays one beat per chapter section.
- Motion: dissolve between beats; no animated counter, snowstorm, or guaranteed range. Camera holds or uses a small reframe. Scroll/click select the same beat. Exit color shifts to the restrained amber/cyan barrier palette.
- Information: fast refueling; lower cold-weather loss claim; range/payload suitability; stated water by-product; storage for several months; steel/chemicals/long-distance trucks/shipping. Use source-qualifying language and avoid universal guarantees.
- Performance: low-to-medium. Reuse the truck, with diagrams for the other beats. One active visual beat at a time. Mobile and low-power use text/line icons.

## 14 — Costs and barriers

- Identity: scene-challenges; Thai: ต้นทุนและอุปสรรค; English: Costs and Adoption Barriers; sources: adoption-barriers, slide 12; industry-barriers, slide 16; remaining-challenges, slide 17. Objective: show the barriers without extrapolating a financial model. Main message: cost, station access, green-hydrogen share, service and business model constraints remain in the source.
- Composition: a single interrupted supply-to-fleet pathway. Position source labels at vehicle cost, refueling station, hydrogen price/supply, after-sales service, and business-model points. Keep one typography column; no dashboard tiles. Mobile stacks these points as a readable sequence.
- Motion: path slows/stops at each barrier, using simple fades only. No crashing objects or warning flashes. Scroll reveals the stages; click navigation lands on the same first barrier. Exit unblocks the path visually without suggesting a resolution.
- Information: 300,000 yuan starting price and 1.5–4x comparison; 35 MPa versus rare 70 MPa access; 44.5 yuan/kg and 25–30 yuan/kg source-stated competitive level; storage/transport and regional mismatch; uneven station access; green share; service/parts; subsidy-dependent business models. No ROI, TCO, break-even, or forecast.
- Performance: low; diagram and DOM text. No 3D required. Mobile/fallback uses static line and numbered text. Do not depend on color alone for barrier/status meaning.

## 15 — Closing

- Identity: scene-closing; Thai: เส้นทางไฮโดรเจนที่กำลังพัฒนา; English: Hydrogen Pathways in Development; source: editorial synthesis, no source closing section. Objective: close by reconnecting transport, industry, and energy. Main message: proposed editorial synthesis, not a claim or forecast from the source.
- Composition: return to the generic opening truck, now in a wider quiet composition with understated port/industrial forms. Foreground: proposed closing line and a clear source/edit status in the planning file; the final audience-facing approval marker is removed only after approval. Midground: truck. Background: connected industrial horizon, with no invented facility specifics.
- Motion: slow pullback or static wide frame. Scroll and click both lead to the same closing anchor. Offer a clear return-to-start control; no autoplay after arrival.
- Information: no new statistic. Proposed copy, pending user/editorial approval: “จากรถบรรทุกหนักสู่อุตสาหกรรมและพลังงาน: เส้นทางไฮโดรเจนที่กำลังพัฒนาในจีน” / “From heavy-duty trucks to industry and power: hydrogen pathways being developed in China.”
- Performance: reuse the opening truck asset; no new model or texture. Static wide image/illustration fallback. Reduced-motion mode uses a fixed composition.


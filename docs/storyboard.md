# Immersive 3D storyboard

## Purpose and recommendation

This is a production plan for a later implementation phase. It does not add a page, scene, model, animation, or interaction code. The story is organized into 15 scenes so the audience can follow the path from China's hydrogen system to transport and industry use cases, regional deployments, and the remaining barriers.

The storyboard uses a single persistent 3D canvas as a restrained visual layer behind accessible DOM text. A chapter in the scroll experience and a scene in click-based navigation refer to the same stable scene ID. Data remains in the prepared Thai and English locale files; scene definitions refer to content IDs instead of copying claims into component files.

## Recommended narrative order

| Order | Scene ID | Thai title | English title | Source references | Communication purpose | Visual anchor |
| --- | --- | --- | --- | --- | --- | --- |
| 01 | scene-opening | H2 FCEV สำหรับโลจิสติกส์ในจีน | H2 FCEV for Logistics in China | Presentation title, slide 1 | Establish hydrogen and heavy logistics as the subject. | A single heavy-duty truck in a quiet industrial night setting. |
| 02 | scene-china-scale | ระบบพลังงานไฮโดรเจนของจีน | China's Hydrogen Energy System | china-hydrogen-overview, slide 2 | Introduce the source's industry-chain and production-scale claims. | Restrained China silhouette linked to a linear supply-chain diagram. |
| 03 | scene-production-mix | โครงสร้างการผลิตไฮโดรเจน | Hydrogen Production Structure | hydrogen-production-structure, slide 3 | Show the three source-stated production shares without normalizing them. | Three horizontal value bars on a visible 0–100 reference scale. |
| 04 | scene-green-hydrogen | จากพลังงานหมุนเวียนสู่ไฮโดรเจนสีเขียว | From Renewable Power to Green Hydrogen | hydrogen-production-structure, slide 3 | Explain the source's wind/solar electrolysis route and project status. | Wind and solar icons feeding a simplified electrolyzer diagram. |
| 05 | scene-infrastructure | สถานีและโครงสร้างพื้นฐาน | Stations and Infrastructure | hydrogen-infrastructure, slide 4; station-counts-and-service-cities, slide 19 | Distinguish completed stations from planned projects and forecast. | One refueling bay beside a status-coded station-count graphic. |
| 06 | scene-vehicle-deployment | การใช้งานยานยนต์ | Vehicle Deployment | vehicle-deployment, slide 5 | Set out the fleet composition and its 2025/early-2026 context. | A heavy truck in front; passenger vehicles stay secondary. |
| 07 | scene-heavy-duty-logistics | รถบรรทุกหนักและโลจิสติกส์ | Heavy-Duty Trucks and Logistics | four-application-sectors-transport, slide 6; heavy-duty-truck-logistics, slide 9 | Explain the heavy-truck operating case and keep each slide's operating context traceable. | A truck moving between port, mine, and fixed-route industrial settings. |
| 08 | scene-refrigerated-logistics | ขนส่งสินค้าเย็น | Refrigerated Freight | refrigerated-transport, slide 14 | Present the source's propulsion, refrigeration, refueling, and range comparison. | A refrigerated truck with separate propulsion and cooling-system callouts. |
| 09 | scene-industry | การใช้ไฮโดรเจนในอุตสาหกรรม | Hydrogen in Industry | industrial-hydrogen-applications, slide 7 | Show steel and chemical examples without presenting trials as universal practice. | A simplified steel process and chemical feedstock flow. |
| 10 | scene-power-storage | ผลิตไฟฟ้าและกักเก็บพลังงาน | Power Generation and Storage | power-and-energy-storage, slide 8 | Explain the source-described wind/solar, hydrogen storage, and fuel-cell sequence. | An animated 2D energy-flow diagram over a restrained industrial horizon. |
| 11 | scene-rail-specialized | รถไฟและยานพาหนะเฉพาะทาง | Rail and Specialized Transport | four-application-sectors-transport, slide 6; passenger-rail, slide 10; freight-and-mining-locomotives, slide 11 | Keep passenger rail, trams, mine locomotives, and other trial modes distinct. | Separate passenger-train, tram, and freight-locomotive silhouettes. |
| 12 | scene-regions | กลุ่มพื้นที่สาธิตและการใช้งาน | Regional Deployment | regional-deployment, slide 18 | Locate only the clusters and names listed in the source. | A flat China map with region labels, no invented station coordinates. |
| 13 | scene-advantages | ข้อได้เปรียบและโอกาสการใช้งาน | Advantages and Use Cases | fcev-advantages, slide 13; hydrogen-industry-advantages, slide 15 | Group source-stated vehicle and industry advantages by use case. | Five restrained visual beats: refueling, cold operation, heavy freight, storage, industry. |
| 14 | scene-challenges | ต้นทุนและอุปสรรค | Costs and Adoption Barriers | adoption-barriers, slide 12; industry-barriers, slide 16; remaining-challenges, slide 17 | Present cost, infrastructure, green-hydrogen, service, and business-model limits. | One constrained supply-to-use pathway with data labels beside the affected stages. |
| 15 | scene-closing | เส้นทางไฮโดรเจนที่กำลังพัฒนา | Hydrogen Pathways in Development | Editorial synthesis; no source closing section | Return to the opening truck and close without an unsupported forecast. | The opening truck in a wider, calm industrial-energy composition. |

## Story arc

1. Establish the transport question, then move outward to China's reported energy scale.
2. Explain where hydrogen comes from and how the source describes green-hydrogen production.
3. Show the infrastructure and vehicle fleet before going close to the operational logistics cases.
4. Broaden from freight to refrigerated goods, industry, energy storage, rail, specialized vehicles, and regions.
5. Balance the stated advantages with the explicit barriers, then close with an editorially proposed synthesis.

The first scene carries no statistics. Every subsequent value is displayed with its original unit, year, status, and application context. Repeated values may appear in more than one source section only when the scene is explicitly showing those different source contexts; they are not combined into a new claim.

## Visual grammar

- Use deep navy/blue-black as the stable background, white for primary type, and cyan/electric blue for the hydrogen process path. Use a restrained secondary color for planned or under-construction status; keep status labels textual so color is not the only signal.
- Reserve the most detailed 3D treatment for the heavy-duty truck and, if assets are approved, one refueling scene. Use 2D diagrams for percentages, energy flows, timelines, and the China/region map.
- Keep one focal subject per scene. Place headings and data in stable HTML overlay regions with opaque or high-contrast backing where needed; do not attach small paragraphs to moving objects.
- Keep camera motion slow, short, and motivated by the story. A fixed camera or static diagram is an intentional fallback, not an incomplete state.
- Use the same truck asset in opening and closing only as a generic visual motif. Do not imply that it represents a named Chinese vehicle or a measured performance result.

## Data and editorial guardrails

- The production mix on slide 3 is 56%, 21%, and 21%. Show three direct values on a scale that does not normalize them to 100%; label that the source-stated shares total 98% and do not invent a remaining category.
- Keep the slide 5 statement of more than 65% of commercial vehicles separate from the slide 6 statement of 85% of the approximately 40,000 deployed fuel-cell vehicles. The denominators differ.
- Keep the general truck figures on slides 6 and 9 attached to their respective use-case descriptions. Do not blend them with refrigerated freight (slide 14), passenger trains/trams (slide 10), or mine locomotives (slide 11).
- On slide 4 and slide 19, show 557 completed, 177 planned/under construction, and more than 650 forecast by end-2026 with distinct status labels. Do not display the forecast as already built.
- The source's slide 19 title mentions cities with service but its body provides no city list. The infrastructure scene shows the national totals; the regional scene uses the names actually present on slide 18.
- Use the editorial review for unresolved transliterations, the slide 5 early-2026 wording, and claims without visible citations.
- Closing copy is an editorial proposal only and requires approval before it is treated as final presentation wording: “จากรถบรรทุกหนักสู่อุตสาหกรรมและพลังงาน: เส้นทางไฮโดรเจนที่กำลังพัฒนาในจีน” / “From heavy-duty trucks to industry and power: hydrogen pathways being developed in China.”


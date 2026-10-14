# Phase 4 — Batch 1: ฉาก 04–05

วันที่ 14 ตุลาคม 2026 · ขอบเขตตามคำสั่งผู้ใช้: ทำเฉพาะ Green Hydrogen Expansion และ Hydrogen Equipment Technology

## ผลตรวจและการเชื่อมฉาก

ก่อนแก้ไขมี 15 ฉาก ฉาก 04 เป็น diagram พลังงานลม/แสงอาทิตย์/การแยกน้ำ ส่วนตำแหน่ง 05 เดิมเป็นโครงสร้างพื้นฐาน เนื้อหาอุปกรณ์ 90%+ อยู่ใน section `hydrogen-production-structure` แต่ยังไม่มีฉากแสดงเฉพาะ จึงเพิ่ม `scene-equipment-technology` ที่ตำแหน่ง 05 แล้วเลื่อน infrastructure เป็น 06 โดยรักษา scene ID เนื้อหาและลำดับสัมพันธ์ของฉากเดิมทั้งหมด ปัจจุบันมี 16 ฉาก

เก็บ SHA-256 ของไฟล์ที่ต้องรักษา 14 ไฟล์และข้อความ i18next เดิมไว้ก่อนแก้ ผล `batch-one:check` ยืนยันว่าไฟล์ฉาก 02–03, global/reference CSS, motion helpers, App/navigation/controls, reference facts และ source sections ยังตรงกันทุก byte; ข้อความเดิมทุก key ใน TH/EN ไม่เปลี่ยน ตัวนับฉากรวมเปลี่ยนจาก 15 เป็น 16 ตามการแทรกฉากใหม่

## ฉาก 04

- ใช้พื้นที่ภาพประมาณ 65% ของ composition บน desktop: โรงงานแนวคิด 3D ประกอบด้วยกังหันลม แผงโซลาร์เซลล์ เครื่องแยกน้ำ และถังเก็บไฮโดรเจน
- กังหันเป็น geometry แยกที่หมุนจริง ใช้เส้นไฟฟ้าสีเขียววิ่งจากลมและแสงอาทิตย์เข้า electrolysis แล้วใช้เส้นสีน้ำเงินวิ่งไปการเก็บไฮโดรเจน ไม่มีการหมุนชิ้นส่วนในภาพถ่ายแบน
- แสดง 250,000 ตัน/ปี และ 900,000 ตันเป็นตัวเลขใหญ่และ reveal ตามลำดับ มีข้อความชัดเจนว่าหน่วยรายปีของค่าหลังยังต้องยืนยัน
- แสดงซินเจียง อินเนอร์มองโกเลีย กานซู และทรัพยากรลม/แสงอาทิตย์ทางตะวันตกเฉียงเหนืออย่างกระชับ
- มีลำดับกระบวนการ TH/EN: ลม+แสงอาทิตย์ → ไฟฟ้า → การแยกน้ำ → ไฮโดรเจนสีเขียว

## ฉาก 05

- ตัวเลข 90%+ เป็นจุดเด่น พร้อมคำอธิบายการผลิตอุปกรณ์หลักภายในประเทศ
- วางโมเดลขนาดใหญ่สามชนิดบนเวทีเดียว: electrolyzer, high-pressure hydrogen tank, fuel cell stack และใช้คำอธิบาย HTML ใต้แต่ละประเภท
- ใช้ GSAP reveal วัตถุตามลำดับและแถบสแกนบางเคลื่อนบนอุปกรณ์อย่างช้า ๆ ไม่สร้าง exploded view หรือกำหนดสเปกของผู้ผลิต
- ระบุข้อความเทคโนโลยีเทียบเท่ามาตรฐานโลกว่าเป็นคำอธิบายจากต้นฉบับ พร้อมบันทึกว่าขอบเขต ปี และเกณฑ์เปรียบเทียบยังต้องยืนยัน

## Assets และข้อจำกัดที่แสดงในงาน

ใช้ฟอนต์ Inter/Noto Sans Thai, lucide icons, design tokens และ MotionProvider/useSceneMotion เดิม โครงการไม่มีภาพโรงงานหรือโมเดลอุปกรณ์ที่ผ่านการตรวจสอบ จึงสร้างโมเดล 3D เชิงแนวคิดชั่วคราวและ SVG fallback โดยติดคำอธิบาย “โมเดลแนวคิดชั่วคราว · ไม่ใช่อุปกรณ์หรือสถานที่จริง” ทั้งสองภาษา ไม่มีภาพที่อ้างว่าเป็นสินค้าหรือโรงงานจริง

สิ่งที่ยังต้องจัดหาเพื่อเปลี่ยนจากภาพชั่วคราวเป็นงานภาพจริง:

1. ภาพ/วิดีโอ/โมเดลโรงงาน green hydrogen ที่มีสิทธิ์ใช้และระบุสถานที่ได้ ครอบคลุม wind/solar/electrolysis/storage; ชิ้นส่วนที่จะเคลื่อนไหวต้องเป็น layered asset หรือ 3D จริง
2. GLB/GLTF หรือ transparent product render ของ electrolyzer ที่ตรวจสอบรูปแบบทางเทคนิคแล้ว
3. GLB/GLTF หรือ transparent product render ของถังไฮโดรเจนความดันสูงที่ตรวจสอบแล้ว
4. GLB/GLTF หรือ transparent product render ของ fuel cell stack ที่ตรวจสอบแล้ว

รายละเอียดสิทธิ์และ replacement requirements อยู่ใน `public/assets/batch-one-manifest.json` โมเดลชั่วคราวไม่ได้อ้างจำนวนเซลล์ ขนาดจริง pressure rating หรือยี่ห้อ

## ข้อมูลที่ยังต้องยืนยัน

| รายการ | การจัดการในงาน |
|---|---|
| 250,000 ตัน/ปี | คงค่าตามต้นฉบับ; ปีและช่วงเก็บข้อมูลยังต้องตรวจสอบ |
| 900,000 ตัน | คงหน่วย “ตัน”; ไม่เติม “ต่อปี”; แสดงข้อสงสัยเรื่อง annual capacity ใกล้ตัวเลข |
| มากกว่า 90% | คงค่าต้นฉบับและ greater-than semantics; ยังต้องตรวจขอบเขตอุปกรณ์ ตัวหาร และช่วงเวลา |
| เทียบเท่ามาตรฐานโลก | ระบุว่าเป็นข้อความจากต้นฉบับ ไม่เปลี่ยนเป็นคำรับรองอิสระ |

หลักการอธิบายการแยกน้ำและโครงสร้างแบบ stack ใช้ตรวจทานระดับแนวคิดกับ [DOE: Hydrogen Production — Electrolysis](https://www.energy.gov/cmei/fuels/hydrogen-production-electrolysis) และ [DOE: Parts of a Fuel Cell](https://www.energy.gov/cmei/fuels/parts-fuel-cell) แหล่งเหล่านี้ไม่ได้ยืนยันตัวเลขตลาดจีนหรือรับรอง geometry ของโมเดลชั่วคราว

## Motion และการใช้ทรัพยากร

- มี Canvas เดียวในแต่ละฉากที่กำลังแสดง lazy-load renderer และใช้ library 3D ร่วมกับฉากแผนที่ ลดการดาวน์โหลดซ้ำ
- instancing สำหรับ plate stack และแผงโซลาร์เซลล์, DPR จำกัด 1–1.5, ไม่มี postprocessing หรือ real-time shadow passes
- หมุนกังหัน/เลื่อนพลังงาน/สแกนผ่าน useFrame โดยไม่ set React state ทุกเฟรม; ใช้ delta ที่จำกัดเพื่อไม่กระโดดหลังกลับเข้าแท็บ
- หยุด ambient rendering เมื่อ pause, reduced-motion, ซ่อนแท็บ, เปิด overview หรือ Canvas ออกจาก viewport; GSAP context ถูก revert และ listener/observer ถูกถอดเมื่อออกจากฉาก
- R3F จัดการ geometry/material disposal ของ declarative objects; fallback เป็น layered SVG ที่รองรับ pause และ reduced-motion เช่นกัน
- เปลี่ยนภาษาใช้ component เดิม ไม่มี locale ใน dependency ของ entrance timelines จึงรักษาฉากและจังหวะ animation

## ไฟล์ที่แก้

| ไฟล์ | การเปลี่ยนแปลง |
|---|---|
| `src/components/presentation/batch1/BatchOneScenes.tsx` | layout/ข้อมูล/คำอธิบายและการเชื่อม motion ของฉาก 04–05 |
| `src/components/presentation/batch1/HydrogenStage.tsx` | Canvas, กล้อง, entrance, energy flow, scan, visibility และ WebGL fallback |
| `src/components/presentation/batch1/IndustrialModels.tsx` | โมเดลแนวคิดชั่วคราวพร้อม instancing และ rotor จริง |
| `src/components/presentation/batch1/ConceptFallback.tsx` | SVG แบบแยกเลเยอร์สำหรับ loading/ไม่มี WebGL |
| `src/styles/batch-one-scenes.css` | CSS scoped เฉพาะฉากใหม่ ไม่แก้ approved styles |
| `src/content/batch-one-facts.json` | ตัวเลข/หน่วย/status และ key mapping กลาง |
| `src/content/{en,th}/common.json` | เพิ่ม batchOne และ sceneLabels.equipment; เก็บข้อความเดิมทุก key |
| `src/scenes/scene-config.ts` | เพิ่ม equipment scene ที่ 05 |
| `src/components/presentation/SceneContainer.tsx` | route ฉาก 04 และ 05 ไป components ใหม่ |
| `scripts/check-batch-one.mjs`, `docs/batch-one-protected-baseline.json` | ตรวจคง approved source/translation และค่าข้อมูล |
| `scripts/check-reference-render.mjs`, `package.json` | เพิ่ม checks สำหรับฉากใหม่และลำดับไปกลับ |
| `public/assets/batch-one-manifest.json`, `README.md`, รายงานนี้ | asset inventory, ข้อจำกัด และสถานะส่งมอบ |

## การตรวจรับ

| การตรวจรอบสุดท้าย | ผล |
|---|---|
| `npm.cmd run typecheck` และ TypeScript ใน production build | ผ่าน |
| `npm.cmd run lint` | ผ่าน ไม่มี lint errors |
| `npm.cmd run batch-one:check` | ผ่าน: 14 protected files byte-identical; ข้อความเดิมทุก key คงเดิม; ตัวเลขและหน่วยตรงต้นฉบับ |
| `npm.cmd run reference:check` | ผ่าน: key/placeholder/ตัวเลข TH/EN ตรงกัน |
| `npm.cmd run content:check` | ผ่าน: 19 source slides และ 18 sections ต่อภาษา พร้อม numeric ledger เดิม |
| `npm.cmd run reference:render` | ผ่าน: 16 ฉาก × 2 ภาษา; dispatch 03 → 04 → 05 → 06 และย้อนกลับ; qualifiers และ concept labels อยู่ใน output |
| `npm.cmd run build` | ผ่าน; มีคำเตือน shared 3D chunk เกิน 500 kB |
| Dev HTTP: components และ stylesheet ใหม่ | 200 จาก server เดิมพอร์ต 5173 |
| Browser interaction / ภาพ / GPU | ยังไม่ยืนยัน เพราะไม่มี browser session ในเครื่องมือ |

Build ล่าสุด: main JS 394.59 kB (gzip 115.53), CSS 40.92 kB (gzip 9.01), renderer ใหม่ HydrogenStage 10.75 kB (gzip 3.53), shared R3F/Three chunk 909.46 kB (gzip 240.99) ชุด 3D โหลดแบบ lazy และใช้ร่วมกัน ไม่ได้เพิ่ม dependency หรือซ่อน chunk warning

Node SSR smoke test ยังมี `THREE_CJS_DEPRECATED` warning จาก dependency pathway เช่นเดียวกับระยะก่อน แต่จบด้วย exit code 0 ผล render นี้ไม่ใช่หลักฐานว่า visual layout/GPU/คีย์บอร์ดหรือ fullscreen ผ่านใน browser จริง

ข้อจำกัดเครื่องมือ: CUA คืน `apps: []`, `browsers: []` จึงยังทดสอบกดปุ่มและจับภาพที่ 1920×1080 / 1440×900 / 1366×768 ไม่ได้ มี CSS responsive และเลื่อนได้เมื่อเนื้อหาเกินความสูง โดยไม่ย่อข้อความสำคัญจนเล็กเกินไป

พรีวิวใช้ dev server เดิมที่ `http://localhost:5173/` เปิดเมนูฉากแล้วเลือก 04 หรือ 05; รอบนี้ไม่เผยแพร่ production

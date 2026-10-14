# Phase 4 — Batch 2: ฉาก 06–08

วันที่ 14 ตุลาคม 2026 · พัฒนาใน `C:\web\H2_FCEV` · ไม่ deploy

## ขอบเขตและผลตรวจซอร์ส

ก่อนเริ่มมี 16 ฉาก: ฉาก 02–03 เป็น reference ที่อนุมัติแล้ว, 04–05 มีคอมโพเนนต์ Batch 1, 06 เป็นโครงสร้างพื้นฐานแบบเดิม ส่วนตำแหน่ง 07–08 เป็นการใช้ยานยนต์และขนส่งหนัก จึงพัฒนาฉาก 06 และแทรกฉากขยายเครือข่ายกับการจัดเก็บ/ขนส่งที่ตำแหน่ง 07–08 ตามคำสั่งใหม่ โดยย้ายเนื้อหาเดิมต่อจากนั้นไปเริ่มที่ 09 รวมเป็น 18 ฉาก รักษา ID, config และลำดับสัมพันธ์ของฉากเดิมทุกฉาก

เก็บ baseline ก่อนแก้ไข: SHA-256 ของไฟล์ที่ต้องรักษา 20 ไฟล์, config ฉาก และ common translations ทั้งสองภาษา ผลตรวจยืนยันว่าฉาก 02–05, CSS ของฉากที่อนุมัติ, global typography, source sections, App, navigation, presentation controls และ motion helpers เดิมไม่ถูกเปลี่ยน ข้อความเดิมใน common.json คงเดิมทั้งหมด

## ฉาก 06 — เครือข่ายสถานีเติมไฮโดรเจน

- จัดองค์ประกอบเป็นตัวเลข 557 ทางซ้ายและพื้นที่แผนที่ประมาณสองในสามทางขวา แสดงสถานะสร้างเสร็จแล้ว พร้อมระบุว่าคำกล่าวว่าใหญ่ที่สุดในโลกมาจากต้นฉบับ
- ใช้ GeoJSON Natural Earth ที่มีอยู่เดิม ทำ projection เดียวกันทั้ง outline และจุดอ้างอิงภูมิภาค ไม่สร้างจุดสุ่มแทนสถานี 557 แห่ง
- จุดอ้างอิง WGS84 ใช้กวางโจว ปักกิ่ง เซี่ยงไฮ้ และจุดกึ่งกลางเฉิงตู–ฉงชิ่งจาก GeoNames แสดงชื่อกลุ่มภูมิภาคด้วย DOM และหมายเลขสัมพันธ์กับแผนที่
- วงแหวน ~60% สาธารณะ และ ~40% สาธิต/อุตสาหกรรม ระบุชัดว่าค่าหลังเป็นส่วนที่เหลือโดยประมาณ ไม่แปลงเป็นจำนวนสถานี
- GSAP วาด outline และเปิดกลุ่มภูมิภาคตามลำดับ พร้อม pulse, สัญญาณสั้นภายในกลุ่ม และการขยับมุมมองเบา ๆ ไม่แสดงเส้นทางท่อหรือการเชื่อมสถานีข้ามภูมิภาคที่ไม่ได้ยืนยัน
- ชื่อสถานที่และภาพรวมยึดข้อมูลพิกัด แต่รัศมีวงและสัญญาณเป็นภาพแนวคิด ไม่ใช่ขอบเขตภูมิภาคหรือความหนาแน่นจริง

แหล่งพิกัด: [กวางโจว](https://www.geonames.org/advanced-search.html?q=Guangzhou), [ปักกิ่ง](https://www.geonames.org/search.html?q=beijing), [เซี่ยงไฮ้](https://www.geonames.org/search.html?country=CN&q=shanghai), [เฉิงตู/ฉงชิ่ง](https://www.geonames.org/search.html?country=CN) · พิกัดและสิทธิ์ [GeoNames](https://www.geonames.org/about.html) บันทึกไว้ใน facts/asset manifest พร้อมเครดิตบนฉาก

## ฉาก 07 — การขยายโครงสร้างพื้นฐาน

- แผนผังหมุดหมายขนาดใหญ่แยกสถานะ 557 สร้างเสร็จ, 177 ก่อสร้าง/วางแผน และ 650+ คาดการณ์สิ้นปี 2026
- โครงการ 177 แสดงเป็นแขนงการพัฒนาแยกจากยอดรวม ป้ายสถานะและตัวเลขอ่านได้ตั้งแต่เริ่ม ไม่ทำกราฟเส้นต่อเนื่องที่สื่อว่าเป็นยอดสะสมตามเวลา
- เปิดหมุดหมายด้วย GSAP ตามลำดับ มีสัญญาณผ่านแขนงโครงการ แล้วเน้นยอดคาดการณ์อย่างนุ่มนวล ภายหลังคงเฉพาะการเคลื่อนไหวของเส้นและวงสัญญาณ
- ระบุว่าโครงการที่วางแผนอาจไม่ได้เปิดใช้งานทั้งหมดทันวันคาดการณ์ ไม่ใช้ 734 แทนยอดคาดการณ์ และไม่เรียก 177 ว่าสร้างเสร็จ

## ฉาก 08 — การจัดเก็บและขนส่ง

- เวที 3D อุตสาหกรรมเดียว: เครื่องแยกน้ำ → ถังเก็บแรงดัน → รถขนส่งก๊าซแบบ tube trailer → สถานีเติม พร้อมข้อความ HTML ประกอบ
- นำ ElectrolyzerModel และ StorageTankModel จาก Batch 1 มาใช้โดยไม่แก้โมเดลเดิม เพิ่มโมเดลรถ สถานี ท่อนำร่องเฉพาะพื้นที่ และเกจแนวคิด
- ประกอบอุปกรณ์ด้วย GSAP จากซ้ายไปขวา ใช้อนุภาคไฮโดรเจนจำนวนน้อย รถขยับช้า และเข็มเกจเคลื่อนไหวเล็กน้อย กล้องคงมุมขณะอ่านข้อมูล
- ตัวเลข 30–40% สีส้มเป็นประเด็นต้นทุนหลัก พร้อมคำอธิบายสัดส่วนต่อราคาขายปลีกและผลต่อการขยายการใช้งาน
- แยกข้อความ “ท่อส่งนำร่องเปิดใช้งานแล้ว” กับ “ท่อส่งหลักข้ามภูมิภาคยังมีจำกัด” แสดงท่อจริงเฉพาะช่วงสั้นในแบบจำลอง ไม่สร้างเครือข่ายท่อทั่วประเทศ
- ระบุชัดว่าภาพและการไหลเป็นแนวคิด ไม่ใช่โรงงาน/เส้นทางจริง และเกจไม่มีค่าความดันที่วัดจริง

## Lifecycle, การนำเสนอ และประสิทธิภาพ

- ใช้ MotionProvider เดิม: หยุดเมื่อกด pause, เปิด overview, ซ่อนแท็บ หรือเปิด reduced motion; IntersectionObserver แยกทั้งระดับฉากและเวที 3D
- Canvas ใช้ frameloop แบบ demand เมื่อหยุด/หลุด viewport, จำกัด DPR 1–1.5, ไม่มีเงาและ postprocessing หนัก ไม่มี state update ทุกเฟรม
- GSAP contexts คืนค่าด้วย revert เมื่อ unmount/เปลี่ยน reduced motion, ถอด observer/listener และเริ่ม entrance ใหม่เมื่อกลับเข้าฉาก ไม่สร้าง ScrollTrigger เพิ่ม
- ตัวเลขและป้ายสถานะเป็น DOM คงที่ ไม่วิ่งวน และยังอ่านได้เมื่อเริ่มด้วย pause/reduced motion การสลับภาษาไม่เปลี่ยน active scene หรือ remount โมเดล
- ขาออกใช้สำเนาฉากแบบ inert/aria-hidden จางออก 220 ms พร้อมล้าง animation และสำเนาภายใน 300 ms; ป้องกันสำเนาจาก StrictMode effect replay และไม่เปลี่ยนระบบ navigation ใน App
- ไม่มี auto-advance; ใช้ปุ่มและคีย์บอร์ดเดิม
- 3D โหลดแบบ lazy มี error boundary, WebGL capability check และ SVG fallback เมื่อโหลดไม่สำเร็จหรือ context สูญหาย
- Build แยก LogisticsStage ประมาณ 6 kB ก่อน gzip; ชุด R3F/Three ที่ใช้ร่วมกันยังประมาณ 909 kB (gzip ประมาณ 241 kB) จึงมีคำเตือนเกิน 500 kB ไม่มี dependency ใหม่

## ช่องว่างของ assets

โมเดลรถ tube trailer, สถานีเติม และชุดท่อยังเป็น procedural concept ไม่มีภาพ/โมเดลสถานที่จริงที่ตรวจสอบแล้ว สิ่งที่ใช้แทนได้ภายหลังคือ GLB/GLTF ที่มีสิทธิ์ใช้งานและผ่านการตรวจเทคนิค แยกชิ้นส่วนที่จะเคลื่อน กำหนดหน่วยเมตร ใช้ polygon/material พอเหมาะ และมีภาพโปร่งใสสำหรับ fallback ไม่ต้องใช้ข้อมูลสถานีรายแห่งในการสื่อยอดรวมประเทศ

รายละเอียดอยู่ใน `public/assets/batch-two-manifest.json` ฉากระบุสถานะภาพจำลองทั้ง TH/EN แล้ว ไม่ต้องรออนุมัติเพื่อใช้งานโค้ดชุดนี้ แต่ยังไม่ถือว่าภาพจำลองเป็นอุปกรณ์จริงที่อนุมัติแล้ว

## ไฟล์ที่เปลี่ยน

ปรับไฟล์เดิม:

- `src/components/presentation/SceneContainer.tsx` — dispatch ฉาก 06–08
- `src/scenes/scene-config.ts` — แทรกสองฉากและรักษาลำดับเนื้อหาเดิม
- `src/i18n/index.ts` — รวมคำแปล Batch 2 เข้ากับ common namespace เดิม
- `package.json` — เพิ่มคำสั่ง batch-two:check
- `README.md` — เพิ่มสถานะและลิงก์รายงาน Batch 2

เพิ่มไฟล์:

- `src/components/presentation/batch2/BatchTwoScenes.tsx`
- `src/components/presentation/batch2/RegionalNetworkMap.tsx`
- `src/components/presentation/batch2/regionProjection.ts`
- `src/components/presentation/batch2/LogisticsStage.tsx`
- `src/components/presentation/batch2/LogisticsFallback.tsx`
- `src/components/presentation/batch2/useInfrastructureMotion.ts`
- `src/styles/batch-two-scenes.css`
- `src/content/batch-two-facts.json`
- `src/content/en/batch-two.json`
- `src/content/th/batch-two.json`
- `public/assets/batch-two-manifest.json`
- `scripts/check-batch-two.mjs`
- `docs/batch-two-protected-baseline.json`
- `docs/phase-4-batch-2.md`

สร้าง production artifact ใน `dist/` ด้วย build ตามปกติ ไม่ deploy

## ผลตรวจและข้อจำกัด

| การตรวจ | ผล |
| --- | --- |
| TypeScript / production build | ผ่าน |
| ESLint | ผ่าน ไม่มี error/warning |
| content:check | ผ่าน ตัวเลขต้นฉบับ 19 สไลด์และ 18 sections ต่อภาษาไม่เปลี่ยน |
| reference:check | ผ่าน key, ตัวเลข และ interpolation เดิม |
| batch-one:check | ผ่านไฟล์ป้องกันเดิม 14 ไฟล์ |
| reference:render | ผ่านการสร้าง HTML ของทั้ง 18 ฉาก TH/EN |
| batch-two:check | ผ่านไฟล์ป้องกัน 20 ไฟล์, config เดิม, TH/EN, สถานะตัวเลข, geographic projection, SSR ลำดับ 05→09 และย้อนกลับ รวม markup เมื่อ reduced motion |
| พรีวิว local | หน้าเว็บและโมดูล Batch 2 ตอบ HTTP 200 ที่ localhost:5173 |
| ภาพจริง 1920×1080 / 1440×900 / 1366×768 | ยังไม่ได้ตรวจ: เครื่องมือไม่มี browser session ให้ควบคุม |
| คีย์บอร์ด, เปลี่ยนภาษาในเบราว์เซอร์, pause/re-entry, exit, WebGL context loss | ตรวจโค้ดแล้ว แต่ยังไม่ได้ทดสอบเหตุการณ์จริงในเบราว์เซอร์ |

กำหนด CSS สำหรับทั้ง desktop และจอเตี้ย รวมถึง mobile/reduced motion แล้ว แต่ SSR ไม่วัด clipping, label overlap, font wrapping, frame rate หรือการทำงานของ GPU จึงไม่อ้างว่าผ่าน visual QA ต้องเปิดตรวจสองภาษาในขนาดเป้าหมายก่อนอนุมัติรูปลักษณ์สุดท้าย ไม่มีประเด็นที่ต้องขอสิทธิ์หรืออนุมัติก่อนส่งโค้ดเพิ่มเติม

คำเตือนที่ไม่ทำให้การตรวจล้มเหลว: ชุด Three.js เกินเกณฑ์ขนาด chunk และ dependency ฝั่ง SSR แจ้ง deprecation ของ require("three")

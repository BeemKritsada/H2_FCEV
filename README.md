# H2_FCEV

A bilingual Thai and English immersive presentation about hydrogen fuel cell electric vehicles and hydrogen energy technology.

## ระยะปัจจุบัน — Phase 4 / Batch 3: ฉาก 09–11

เพิ่มภาพรวมจำนวนรถไฮโดรเจน ตลาดช่วงเปลี่ยนผ่าน และโครงสร้างรถพาณิชย์ รวม 20 ฉาก รักษางานฉาก 02–08 และ refinement ล่าสุด ใช้ `npm.cmd run batch-three:check` ตรวจข้อมูล คำแปล ฐานเปอร์เซ็นต์ และลำดับ 08 → 09 → 10 → 11 → 12 ดู [รายงาน Batch 3](docs/phase-4-batch-3.md) สำหรับไฟล์ที่แก้ assets และข้อจำกัดของ QA งานนี้ยังไม่ได้ deploy

## ระยะก่อนหน้า — Phase 4 / Batch 1: ฉาก 04–05

ฉาก 02–03 อนุมัติแล้วและเก็บไว้ตามเดิม รอบนี้ปรับฉาก 04 เป็นโรงงาน green hydrogen แนวคิดที่มี motion และเพิ่มฉาก 05 แสดงอุปกรณ์หลักสามประเภทพร้อม 90%+ รองรับ TH/EN และ pause/reduced-motion ปัจจุบันมี 16 ฉาก โดย infrastructure เดิมเลื่อนไป 06 โมเดลโรงงาน/อุปกรณ์เป็นภาพชั่วคราวที่ระบุสถานะไว้ในงาน

ดู [รายงาน Phase 4 Batch 1](docs/phase-4-batch-1.md) สำหรับสิ่งที่แก้ assets ที่ขาด ข้อมูลที่รอยืนยัน และผลทดสอบ ใช้ `npm.cmd run batch-one:check` ตรวจว่าฉากที่อนุมัติและข้อความเดิมไม่เปลี่ยน และ `npm.cmd run reference:render` ตรวจการ render สองภาษารวมลำดับ 03 → 04 → 05 → 06

## ระยะก่อนหน้า — ฉากอ้างอิง 02–03

อัปเดต 14 ตุลาคม 2026: เพิ่มฉากภาพรวมจีนพร้อมแผนที่ 3D จากภูมิศาสตร์เดิม และฉากสัดส่วนการผลิตขนาดใหญ่ 56/21/21 ใช้ระบบ TH/EN และการนำทางเดิม มีปุ่ม pause/resume motion, reduced-motion และ SVG fallback แยกปีข้อมูล 2024 ที่ตรวจพบจากปีอ้างอิงการนำเสนอเดิม 2026

ยังรักษาฉากเดิมทั้ง 15 ฉาก การขยายเป็น 24 ฉากอยู่หลังการอนุมัติภาพ 02–03 ตาม MASTER PROMPT ดู [รายงาน audit และ mapping](docs/reference-scenes-audit.md), [ผลตรวจข้อมูล](docs/reference-data-verification.md) และ [รายงานส่งมอบ](docs/reference-scenes-delivery.md)

ตรวจเพิ่มเติมด้วย `npm run reference:check` และ `npm run reference:render` (คำสั่งหลังเป็น server-side rendering smoke test ไม่ใช่ browser visual test) บน PowerShell ที่ปิดการรันสคริปต์ใช้ `npm.cmd` แทน `npm`

## Previous phase

Phase 4.1 provides a bright white-and-blue bilingual presentation with 15 scenes, a responsive opening composition, a local concept truck image, a sourced China silhouette, and reusable infographic templates. Previous/next, scene menu, Thai/English switching, progress, fullscreen, and keyboard navigation are available. The approved source content and numerical ledger are preserved. Detailed 3D models and advanced animation remain future work.

See [the redesign report](docs/phase-4.1-redesign.md) and [asset sources, licenses, and generation prompt](docs/visual-assets.md).

## Development tools

- Node.js 24 LTS (Node.js 24 or newer)
- npm
- Git (optional for local development)

## Install

From the project directory, install the locked dependencies:

    npm ci

## Run locally

    npm run dev

Vite prints the local development URL in the terminal.

## Build and inspect

    npm run typecheck
    npm run lint
    npm run build
    npm run build:offline
    npm run preview

The production build is static and is written to dist/. The optional offline foundation build writes relative-path static files to dist-offline/ and does not create an app wrapper or installer. Vite source maps are disabled for production builds. The build base path defaults to / and can be set at build time with APP_BASE_PATH for a subpath or a future offline target.

## Planned next phase

ฉาก 02–03 อนุมัติแล้ว และฉาก 04–05 พัฒนาใน Batch 1 ตามรายงานข้างต้น งานฉากถัดไปให้ดำเนินตาม batch ที่ผู้ใช้ระบุ พร้อมจัดหาภาพ/โมเดลที่ตรวจสอบด้านเทคนิคและสิทธิ์ใช้งานแล้ว ตัวห่อโปรแกรม Windows ออฟไลน์ยังเป็นงานระยะหลัง

Batch 2 เพิ่มฉาก 06–08: แผนที่เครือข่ายสถานี, การขยายโครงสร้างพื้นฐาน และระบบจัดเก็บ/ขนส่งไฮโดรเจนแบบ 3D รวมเป็น 18 ฉาก ดู [รายงาน Batch 2](docs/phase-4-batch-2.md) และรัน `npm run batch-two:check` เพื่อตรวจข้อมูล คำแปล ลำดับฉาก และไฟล์ที่ต้องรักษา ภาพจริงและ GPU ยังรอ visual QA ในเบราว์เซอร์ ไม่มีการ deploy

## Presentation controls

Use the scene menu or previous/next buttons. Left/Right and PageUp/PageDown change scenes; Home/End go to the opening/closing. Escape closes the scene menu. Fullscreen depends on browser support. Reduced-motion preferences are respected. Fonts and artwork are bundled locally for offline compatibility.

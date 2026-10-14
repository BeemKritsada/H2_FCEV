# ส่งมอบ Phase 1–3: ระบบออกแบบและฉากอ้างอิง 02–03

วันที่ 14 ตุลาคม 2026

## สิ่งที่ทำแล้ว

- ตรวจโครงสร้างเดิมและทำ [inventory / mapping 15 ฉากเดิมไปยัง 24 ฉากที่วางแผน](reference-scenes-audit.md)
- ปรับ palette ตาม brief และเพิ่ม typography tokens ที่อิงทั้ง viewport width/height: title สูงสุด 68px, metric 140px, body 20–28px, labels 18–22px, notes 16–18px มี layout สำหรับจอเตี้ยและมือถือ โดยยอมให้เลื่อนเมื่อเนื้อหายาว
- ฉาก 02: headline ซ้าย, ตัวเลข >36.5, อันดับ #1, แผนที่ extruded 3D จาก GeoJSON เดิม, entrance/camera composition, เส้นขอบสว่างขึ้น, จุดภูมิภาคและพลังงานเคลื่อนไหว, คำอธิบายภาพเชิงแนวคิด และ SVG fallback
- ฉาก 03: กราฟกลางพื้นที่ 3 แท่ง, 56/21/21 บนฐาน 0–100 เดียวกัน, label และค่าขนาดใหญ่, GSAP bar growth, energy shimmer, คำอธิบายผลรวม 98% พร้อม semantic meter สำหรับ screen reader
- เก็บข้อมูลตัวเลขใหม่สำหรับการแสดงผลใน reference-facts.json โดยไม่เปลี่ยน source sections/ledger; [แยกปีข้อมูล 2024 ที่พบใน NEA จากปีอ้างอิงเดิม 2026](reference-data-verification.md)
- ปุ่มพัก/เล่น motion ใน navigation; เคารพ reduced-motion; หยุดเมื่อแท็บถูกซ่อน/เปิด overview/ภาพอยู่นอก viewport; เข้าฉากขณะ pause แล้วยังอ่านข้อมูลสุดท้ายได้
- เปลี่ยนภาษาผ่าน i18next เดิม ไม่ remount ฉากหรือเริ่ม GSAP ใหม่ ป้องกัน scene shortcut ขณะ focus ปุ่มเลือกภาษา
- คงฉากเดิม 15 ฉากและ navigation/fullscreen/overview ไว้ การเพิ่มฉาก 04–24 ตาม narrative ใหม่ยังไม่ได้ดำเนินการ รอ visual approval ตามคำสั่งผู้ใช้

## ไฟล์ที่แก้และเหตุผล

| ไฟล์/กลุ่มไฟล์ | หน้าที่ |
|---|---|
| `src/components/presentation/ReferenceScenes.tsx` | องค์ประกอบสองฉากที่มี layout เฉพาะ, semantic chart, source note, lazy loading และ error boundary |
| `src/components/presentation/LivingChinaMap.tsx` | Three.js / R3F geometry, motion, กล้อง responsive, WebGL fallback และ lifecycle |
| `src/components/presentation/AnimatedNumber.tsx` | count-up ผ่าน DOM พร้อมค่าคงที่สำหรับ screen reader |
| `src/components/motion/*` | motion context/provider และ GSAP scene lifecycle ที่ใช้ซ้ำได้ |
| `src/components/presentation/SceneContainer.tsx` | เลือก reference components เฉพาะฉาก 02–03 |
| `src/app/App.tsx` | เชื่อม motion provider กับ overview และการนำทาง |
| `src/components/navigation/TopNavigation.tsx` | เพิ่มปุ่ม pause/resume พร้อม TH/EN labels |
| `src/content/{th,en}/common.json` | ข้อความสองภาษาของฉากใหม่/หน่วย/หมายเหตุ/controls ใน i18next เดิม |
| `src/content/reference-facts.json` | ตัวเลขกลาง, original/verified year, สถานะ verification และ URL แหล่งอ้างอิง |
| `src/styles/global.css` | design tokens กลาง |
| `src/styles/reference-scenes.css`, `src/main.tsx` | presentation typography, layouts และ responsive/motion CSS |
| `scripts/check-reference-scenes.mjs` | ตรวจตัวเลขและ key/interpolation สองภาษาเทียบต้นฉบับ |
| `scripts/check-reference-render.mjs` | render ทุกฉากด้วย React server renderer ทั้งสองภาษา |
| `package.json` | เพิ่มสองคำสั่งตรวจ โดยไม่เพิ่ม dependency |
| `public/assets/reference-scenes-manifest.json` | asset inventory ของฉากอ้างอิงและข้อจำกัดความหมายของแผนที่ |
| `docs/reference-*.md`, `README.md` | รายงาน audit, assets ที่ขาด, verification, ผลตรวจและสถานะงาน |

## สถาปัตยกรรม animation และประสิทธิภาพ

App ยัง mount เฉพาะ active scene เมื่อออกจากฉากจะ cleanup GSAP context/tween, visibility listeners และ IntersectionObserver; R3F เป็นเจ้าของและ dispose declarative geometry/material ไม่มี ScrollTrigger เพิ่ม เพราะระบบเดิมใช้ manual scene navigation และไม่มี scroll timeline ที่ต้อง refresh เมื่อเปลี่ยนภาษา

GSAP ทำ entrance/ตัวเลข และ useFrame เปลี่ยนตำแหน่งวัตถุโดยไม่ set React state ทุกเฟรม ไม่มี postprocessing หรือโมเดลภายนอก จำกัด DPR 1–1.5 แผนที่มี observer ของพื้นที่ Canvas โดยตรง และใช้ `frameloop="demand"` เมื่อหยุด motion หรืออยู่นอกจอ ใช้เวลา delta แบบจำกัดเพื่อไม่กระโดดหลังกลับเข้าแท็บ

production build ล่าสุด: main JS ประมาณ 373.58 kB (gzip 110.77 kB), GSAP 82.83 kB (gzip 32.04 kB), lazy 3D chunk 923.73 kB (gzip 247.85 kB), CSS 30.04 kB (gzip 7.37 kB) ขนาด 3D ยังเกิน warning threshold 500 kB; เก็บคำเตือนไว้และโหลดเฉพาะเมื่อเข้าฉาก 02 ไม่ได้ปรับ threshold เพื่อซ่อนคำเตือน ยังไม่ได้วัด FPS/หน่วยความจำบน GPU เครื่องนำเสนอ

## ผลทดสอบจริง

| การตรวจ | ผล |
|---|---|
| `npm.cmd run typecheck` / TypeScript ใน build ล่าสุด | ผ่าน |
| `npm.cmd run lint` | ผ่าน |
| `npm.cmd run content:check` | ผ่าน: 19 source slides, 18 sections ต่อภาษา, ตัวเลขและ glossary IDs คงเดิม |
| `npm.cmd run reference:check` | ผ่าน: key/placeholder/ตัวเลขสองภาษาตรงกัน, shares ตรงต้นฉบับ, common scale และปีข้อมูลแยกกัน |
| `npm.cmd run reference:render` | ผ่าน: 15 ฉาก × 2 ภาษา, headings, accessible values 56/21/21, note 98%, ปี 2024/2026 ในฉาก 02 |
| `npm.cmd run build` | ผ่าน มีคำเตือนขนาด lazy 3D chunk ตามข้างต้น |
| `npm.cmd run build:offline` | ผ่าน; font URL เป็น relative และใช้ assets ในเครื่อง |
| HTTP dev preview + module ใหม่ | 200 ที่ `http://localhost:5173/`; ยืนยัน module ReferenceScenes ถูกเสิร์ฟ |
| Browser visual QA / console / fullscreen / keyboard / motion / WebGL loss | ยังไม่ตรวจใน browser จริง: CUA แจ้ง IAB ไม่พร้อม และ inventory ไม่มี browser session |
| 1920×1080, 1440×900, 1366×768, มือถือ | มี CSS รองรับ แต่ยังไม่ยืนยันการจัดวางด้วย screenshot จริง |

Node SSR smoke test แสดง deprecation warning ของเส้นทาง CJS ภายใน dependency Three.js; test จบด้วย exit code 0 แอปต้นทางใช้ ESM import และ production build ผ่าน ข้อความนี้ไม่ใช่ผล browser console test

## วิธีตรวจภาพเพื่ออนุมัติ

1. เปิด `http://localhost:5173/` ซึ่งเป็น dev server เดิมที่ตรวจว่าเสิร์ฟไฟล์ใหม่ได้ หากไม่ได้เปิด server แล้ว ให้รัน `npm.cmd run dev`
2. ใช้เมนูฉากไปฉาก 02 และ 03 สลับ EN/TH ขณะอยู่ในฉากเดิม ตรวจขนาดข้อความและสัดส่วนแท่ง
3. กดปุ่ม pause บนแถบด้านบน แล้วเดินหน้า/ย้อนหลัง ตัวเลขและเนื้อหาต้องยังอ่านได้ กด resume เพื่อตรวจพลังงานเคลื่อนไหว
4. ตรวจ fullscreen และจอเป้าหมาย 1920×1080 / 1440×900 / 1366×768 ก่อนอนุมัติแนวภาพสำหรับ Phase 4

จุดหยุดมาจาก MASTER PROMPT ของผู้ใช้ ใน Phase 3: “Pause for visual approval before proceeding to the remaining scenes.” งานรอบนี้เป็นการแก้ source ในเครื่อง ไม่มีการเผยแพร่ production

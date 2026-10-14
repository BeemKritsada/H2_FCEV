# ส่งมอบงานต่อเนื่อง Batch 5–6: ฉาก 15–20 และระบบตัวเลขกลาง

ตรวจวันที่ 14 ตุลาคม 2026 โครงการ `C:\web\H2_FCEV` งานนี้ต่อยอดโครงสร้างเดิม รวมฉากทั้งหมดเป็น 27 ฉาก โดยเก็บฉาก 12–14 จาก Batch 4 และฉากเดิมหลังส่วนโลจิสติกส์ไว้ ไม่มีการ deploy

## ผลงานที่ทำแล้ว

| ฉาก | ผลลัพธ์ |
|---|---|
| 15 | ภาพประกอบสมจริง 4 สถานการณ์: ท่าเรือ เหมือง โรงงานเหล็ก และทางหลวง จัดเป็น 2×2 พร้อมข้อความ TH/EN และระบุว่าเป็นภาพสร้างด้วย AI |
| 16 | รถบรรทุกแนวคิดจากภาพเดิม แสดงครบคัน; 3–5 นาที, 600–1,000 กม., −30°C นับตามลำดับ; ปุ่มเลือกเน้นสมรรถนะ; ข้อความด้านน้ำหนักบรรทุกมีเงื่อนไขตามเอกสาร |
| 17 | แผนที่จีนจาก GeoJSON เดิม จุดพื้นที่โดยประมาณ 5 แห่ง ไม่มีเส้นทางแต่งขึ้น; 10,000 ตันระบุชัดว่าเป็นระดับขบวนรถ/การดำเนินงาน |
| 18 | ภาพรถไฟ CRRC จริง แยกการเปิดตัวปี 2022 จากผลทดสอบปี 2024; 4 ตู้, 160 กม./ชม., 1,000+ กม., 15 นาที; ตัวเลขจัด 2×2 บนเดสก์ท็อปเพื่อไม่ชนเชิงอรรถ |
| 19 | ภาพรถรางฟอซานจริง; ปี 2019 คงที่; 6.5 กม. และ 100 กม. นับตามลำดับ; ใช้ถ้อยคำเชิงประวัติศาสตร์โดยไม่ยืนยันสถานะบริการปัจจุบัน |
| 20 | แสดง Qingchun Hao / 氢春号 และ Qingsong Hao / 氢凇号 พร้อมกันด้วยภาพรถจริง เลือกเน้นแต่ละเมืองได้ แยกวันจัดแสดงและวันเริ่มบริการ และจำกัดข้อกล่าวอ้างสิ่งแวดล้อมที่การใช้งานเซลล์เชื้อเพลิง |

ฉากเปิดแสดง “ข้อมูลอ้างอิงปี 2026” / “Reference Year: 2026” โดยไม่เปลี่ยนปีประวัติศาสตร์ หมายเหตุเรื่องการตรวจหน่วยของ 900,000 ถูกซ่อนจากหน้าจอทั้งสองภาษา แต่ข้อมูลต้นฉบับและข้อความภายในไฟล์แปลยังอยู่ และไม่เติมหน่วยต่อปีเอง

## ระบบตัวเลขและโครงสร้าง

`SceneNumberSequence` ใช้ GSAP timeline เดียวต่อฉาก เริ่มหน่วง 0.30 วินาที ตัวละ 0.85 วินาที เว้น 0.12 วินาที ใช้ `power2.out` เรียงตามลำดับ DOM ตัวเลขแต่ละตัวไม่เริ่มพร้อมกัน รองรับจำนวนเต็ม ทศนิยม ช่วงค่า เครื่องหมายลบ ค่าขีดจำกัด และหน่วย

App เก็บฉากที่เคยเข้าชมใน session เมื่อย้อนกลับจะแสดงค่าปลายทางทันที เปลี่ยนภาษา/เลือกรถ/เลือกโหมดไม่เริ่มนับใหม่ ปุ่มเริ่มนำเสนอใหม่ในฉากสุดท้ายล้างสถานะนี้ Reduced motion แสดงค่าปลายทาง ส่วน Pause/Resume หยุดและเล่น timeline ต่อได้ Cleanup ยกเลิก timeline เมื่อออกจากฉาก และ screen reader อ่านค่าจริงที่คงที่

ย้ายสถิติหลักที่แสดงอยู่ในฉาก 02–09, 11, 16–19, 21 และ 26 เข้าระบบกลาง ฉากที่ไม่มีสถิติหลักไม่เพิ่มตัวเลขใหม่ ปีประวัติศาสตร์ ลำดับฉาก ดัชนีตกแต่ง และตัวเลขในเชิงอรรถไม่ถูกนับขึ้น ฉาก 11 ยังคงตัวเลข 65%+ วัดภายในกลุ่มรถพาณิชย์ และแก้แถว grid ของภาพรถให้ไม่ดันภาพออกนอกกรอบ โดยคงระยะขยับลง 4px เดิม

โครงสร้าง scene navigation เดิมยังอยู่ Mount เฉพาะฉากปัจจุบัน, prefetch ภาพสำคัญของฉากถัดไป, ใช้ WebP, cleanup GSAP/IntersectionObserver และหยุด ambient motion เมื่อพักการนำเสนอ ใช้ภาพนิ่งกับการเคลื่อนกล้องเบา ๆ ไม่มีการหมุนภาพให้ดูเหมือน 360 องศา

## ไฟล์ที่เพิ่มหรือแก้

| กลุ่ม | ไฟล์ |
|---|---|
| ระบบกลาง | `src/components/motion/SceneNumberSequence.tsx`, `number-sequence-context.ts`, `number-format.ts`; `src/components/presentation/AnimatedNumber.tsx`; `src/styles/animated-number.css` |
| เชื่อมแอป | `src/app/App.tsx`, `src/components/presentation/SceneContainer.tsx`, `PresentationControls.tsx`, `OpeningScene.tsx`, `src/scenes/scene-config.ts`, `src/i18n/index.ts` |
| ย้ายตัวเลขเดิม | `src/components/presentation/ReferenceScenes.tsx`, `SourceStatisticText.tsx`, `batch1/BatchOneScenes.tsx`, `batch2/BatchTwoScenes.tsx`, `batch3/BatchThreeScenes.tsx`, `batch3/VehicleCarousel.tsx`, `batch3/useVehicleMarketMotion.ts` |
| แก้กรอบรถฉาก 11 | `src/styles/batch-three-scenes.css` — เพิ่มแถว `minmax(0, 1fr)` ในปุ่มภาพรถเพียงจุดเดียว |
| ฉากใหม่ | `src/components/presentation/batch5/BatchFiveScenes.tsx`, `assets.ts`, `useLogisticsMotion.ts`; `src/styles/batch-five-scenes.css` |
| เนื้อหา | `src/content/batch-five-facts.json`, `src/content/en/batch-five.json`, `src/content/th/batch-five.json` |
| ภาพ | WebP 9 ไฟล์ใน `public/assets/images/logistics/` และ `public/assets/images/rail/` ตาม [ทะเบียนภาพ](batch-five-assets.json) |
| การทดสอบ | `scripts/check-batch-five.mjs`, `check-batch-five-browser.mjs`, `authorized-number-migration.mjs`; ปรับ `check-batch-one.mjs`, `check-batch-two.mjs`, `check-batch-three.mjs`, `check-batch-four.mjs`, `check-reference-render.mjs` ให้ตรงข้อกำหนดล่าสุด |
| เครื่องมือและเอกสาร | `package.json`, `.gitignore`, `eslint.config.js`, รายงานนี้ และ `docs/batch-five-assets.json` |

ไฟล์ Batch 4 ที่มีอยู่ในงานค้าง ได้แก่ components `batch4/`, เนื้อหา `batch-four.json` ทั้งสองภาษา และ `batch-four-scenes.css` ถูกเก็บไว้และผ่านการตรวจฉาก 12–14 ไม่ได้เริ่มเขียนใหม่ ส่วน `src/main.tsx` ไม่จำเป็นต้องแก้

ชุดตรวจ hash ยังเทียบข้อมูลต้นฉบับ แปลเดิม ภาพเดิม และสไตล์ที่อยู่ใน baseline ตามเดิม ยกเว้น component 6 ไฟล์ที่จำเป็นต่อการย้ายตัวเลข/เริ่มใหม่/ซ่อนหมายเหตุ ซึ่งมีการตรวจค่าจริงและพฤติกรรมแทน ไม่ได้เขียน baseline ใหม่ให้ตรงผลลัพธ์โดยอัตโนมัติ แยกแคช Vite ของ SSR tests ไป `.tmp/vite-ssr-checks` เพื่อไม่ทำให้ dev server โหลด dependency เก่าจนเกิด 504 และให้ ESLint ข้ามไฟล์ build ใน `tmp/`

## ภาพและข้อมูลที่ยังต้องตรวจ

ภาพใหม่เก็บใน `public/` ทั้งหมด ไม่อ้าง `dist` เป็นแหล่งต้นฉบับ และไม่ลบภาพรถเดิม ภาพ 4 สถานการณ์สร้างด้วย ImageGen; ภาพรถบรรทุกสมรรถนะดัดแปลงจาก PNG เดิม; ภาพรถไฟและรถรางอีก 4 ภาพใช้ภาพจริงพร้อมเครดิต ไม่มีภาพแทนแบบ low-poly ทะเบียนภาพบันทึกขนาด ที่มา และ prompt ไว้ครบ

- **15 นาทีของรถไฟ:** คงค่าที่เจ้าของงานให้มา พร้อมหมายเหตุรอตรวจแหล่งเฉพาะ [บทความผู้จัดหาอุปกรณ์](https://www.hubersuhner.com/en/newsroom/blog-and-literature/blog/development-of-hydrogen-powered-trains-in-china) ใช้ยืนยันรถต้นแบบเดิม ขณะที่ [รายงานรัฐบาลปักกิ่งปี 2024](https://kw.beijing.gov.cn/xwdt/kcyx/xwdtcyfz/202403/t20240326_3818123.html) ใช้ประกอบผลทดสอบภายหลัง ไม่รวมเป็นสเปกชุดเดียวกัน
- **ฟอซาน:** ปีเริ่มบริการเชิงพาณิชย์อ้าง [CRRC](https://www.crrcgc.cc/sfgf/2020-01/07/article_F719648915B84137BE9AA13F75060793.html) ภาพจาก [รายงานเกาหมิง](https://m.thepaper.cn/newsDetail_forward_5109775) ถ้อยคำในฉากไม่ยืนยันว่าบริการยังเปิดในปี 2026
- **Qingchun Hao:** การเปิดตัว/จัดแสดงในปี 2025 มี [CRRC](https://www.crrcgc.cc/en/2025-11/06/article_2025110609290125210.html) และ [ภาพข่าววันที่ 17 ตุลาคม 2025](https://photo.china.com.cn/2025-10/17/content_118128154.shtml) ประกอบ วันเริ่มบริการผู้โดยสารยังไม่ยืนยัน จึงแยกข้อความไว้
- **Qingsong Hao:** แยก [เปิดให้เข้าชม 25 ธันวาคม 2025](https://www.jl.gov.cn/szfzt/2026/2026jlslh/jchm/202512/t20251229_3541788.html) ออกจาก [เริ่มทดลองบริการผู้โดยสาร 17 กุมภาพันธ์ 2026](https://www.jl.gov.cn/szfzt/gzlfz/gzdt/202603/t20260319_3596473.html)
- ยังไม่มีวิดีโอ/ภาพแยกเลเยอร์ให้รถเคลื่อนที่จริง ใช้การเคลื่อนกล้องกับภาพนิ่งอย่างจำกัด ภาพข่าวคงลายน้ำและเครดิต ไม่ได้อ้างสิทธิ์เผยแพร่ต่อแบบไร้ข้อจำกัด

## ผลตรวจ

| การตรวจ | ผล |
|---|---|
| TypeScript และ ESLint | ผ่าน |
| `content:check`, `reference:check`, `reference:render` | ผ่าน ข้อมูลต้นฉบับเดิมยังครบ และ render 27 ฉากได้ทั้ง TH/EN |
| `batch-one:check` ถึง `batch-five:check` | ผ่าน ตัวเลข หน่วย ตัวคูณ/ฐานสัดส่วน และลำดับฉากถูกต้อง |
| Browser ฉากใหม่ | ผ่าน 48 กรณี: 6 ฉาก × 2 ภาษา × 4 ขนาดจอ 1920×1080, 1440×900, 1366×768, 390×844 |
| Browser ฉากเดิมที่ย้ายตัวเลข | ผ่าน 40 กรณี: ฉาก 1,2,3,4,5,6,7,8,9,11 × 2 ภาษา × เดสก์ท็อป/มือถือ |
| การเลื่อนอ่านบนมือถือ | ผ่านอีก 12 กรณี: ทุกสถิติและเชิงอรรถในฉาก 15–20 ทั้ง TH/EN เลื่อนให้อยู่ระหว่างแถบนำทางบนและล่างได้ |
| พฤติกรรมตัวเลข | ผ่าน ลำดับทีละตัว, เครื่องหมาย/ช่วงค่า, เปลี่ยนภาษาระหว่างนับ, เปลี่ยนรถระหว่างนับ, ย้อนกลับ, explicit restart, pause/resume และ reduced motion |
| Console ใน production browser QA | ไม่พบ error |
| Dev server หลังแยกแคช | ฉาก 2,4,5,8,11,18,20 รวมโมดูล 3D โหลดสำเร็จ ไม่มี browser error |
| Production build แบบ clean output ใหม่ | ผ่าน `npm.cmd run build -- --outDir tmp/batch-five/production` |
| อัปเดต `dist` โดยเก็บ output เดิม | ผ่าน `npm.cmd run build -- --emptyOutDir false`; `dist/index.html` ชี้ชุดไฟล์ล่าสุดแล้ว |
| `npm.cmd run build` ที่ `dist` เดิม | ยังพบ Windows `EPERM` ตอนลบ `dist/assets`; เป็นข้อจำกัดการล้าง output เดิม จึงตรวจ build ใหม่ในโฟลเดอร์แยก |

ภาพหน้าจอและผลตรวจเครื่องอยู่ใน `tmp/batch-five/qa/` และ `report.json` (ไฟล์ชั่วคราวไม่เข้า Git) เดสก์ท็อปฉากใหม่แสดงเนื้อหาและเชิงอรรถเหนือแถบนำทางครบ มือถือเรียงแนวตั้งและเลื่อนอ่านได้ ไม่มี horizontal overflow

Bundle มีคำเตือนเกิน 500 kB: main JS ประมาณ 514.42 kB (gzip 143.86 kB), lazy React Three Fiber ประมาณ 909.46 kB (gzip 240.99 kB) ไม่ได้ปิดคำเตือนนี้ SSR มี Three.js CJS deprecation จาก dependency แต่ตรวจผ่าน ยังไม่ได้วัด FPS หรือทดสอบ WebGL context loss บนเครื่องฉายจริง

## เปิดตรวจงาน

- Dev server: `http://127.0.0.1:5175/`
- Production preview ที่ผ่าน browser QA: `http://127.0.0.1:5176/`
- เลือกฉาก 15–20 จากเมนูด้านบน และเลือก TH/EN
- ทดสอบการนับครั้งแรกด้วยการ reload หรือกด “เริ่มนำเสนอใหม่” ที่ฉากสุดท้าย การย้อนกลับฉากเดิมจะแสดงค่าจริงทันทีตามข้อกำหนด

หากต้องเปิด preview ใหม่ รัน `npm.cmd run build -- --outDir tmp/batch-five/production` แล้วรัน `npm.cmd run preview -- --outDir tmp/batch-five/production --host 127.0.0.1 --port 5176 --strictPort`

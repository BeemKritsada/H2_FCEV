# รายงานตรวจโครงสร้างและแผนปรับฉากอ้างอิง

วันที่ 14 ตุลาคม 2026 — ขอบเขต: Phase 1–3 ตามไฟล์ MASTER PROMPT

## ผลตรวจโครงสร้างเดิม

- React 19 + TypeScript + Vite; ติดตั้ง Three.js, React Three Fiber, Drei และ GSAP แล้ว แต่ยังไม่มี Canvas, useFrame, GSAP timeline หรือ ScrollTrigger ใน source เดิม
- `App.tsx` เก็บ activeIndex; mount เฉพาะฉากปัจจุบันด้วย key ของ scene ID การเปลี่ยนภาษาจึงรักษาฉากเดิมได้
- `scene-config.ts` มี 15 ฉาก อ้างอิง 18 content sections จากต้นฉบับ 19 สไลด์ ไม่ใช่ 24 ฉากตาม narrative ใหม่
- i18next มี namespace common และ JSON sections ภาษาไทย/อังกฤษ โครงสร้างตรงกัน ผ่าน content:check ก่อนแก้ไข ไม่สร้างระบบแปลใหม่
- มีปุ่มก่อนหน้า/ถัดไป, progress, scene overview พร้อม focus trap, fullscreen และคีย์บอร์ด ไม่มีระบบเลื่อนอัตโนมัติและไม่มี ScrollTrigger ที่ต้อง refresh
- SceneContainer ใช้ layout สองคอลัมน์เหมือนกันทุกฉาก ทำให้ฉาก production mix แสดงเนื้อหาซ้ำกับกราฟและใช้พื้นที่ไม่คุ้ม
- ตัวอักษรเดิมจำนวนมาก 8–18px; กราฟสูงเพียง 20px; ภาพทั้งหมดหยุดนิ่งหลัง CSS fade-up
- assets: รถบรรทุกแนวคิด JPEG, Natural Earth SVG/GeoJSON, ฟอนต์ Inter/Noto Sans Thai ในเครื่อง, ภาพ schematic SVG ไม่มี GLB, วิดีโอ หรือภาพรถไฟรุ่นจริง
- Git แสดงไฟล์เดิมเป็น untracked ทั้งโปรเจกต์ จึงรักษาไฟล์เดิมโดยตรง ไม่ reset, ไม่ clean และไม่สร้าง commit ในงานนี้

## รายการฉากที่มีอยู่จริงในรอบส่งมอบนี้

| ลำดับปัจจุบัน | Scene ID (ตัด prefix scene-) | สถานะ |
|---|---|---|
| 01 | opening | คงองค์ประกอบหน้าปกเดิม |
| 02 | china-scale | ปรับฉากอ้างอิงใหม่ |
| 03 | production-mix | ปรับฉากอ้างอิงใหม่ |
| 04 | green-hydrogen | คงฉากเดิม ใช้ typography กลางที่ปรับ |
| 05 | infrastructure | คงฉากเดิม ใช้ typography กลางที่ปรับ |
| 06 | vehicle-deployment | คงฉากเดิม ใช้ typography กลางที่ปรับ |
| 07 | heavy-duty-logistics | คงฉากเดิม ใช้ typography กลางที่ปรับ |
| 08 | refrigerated-logistics | คงฉากเดิม ใช้ typography กลางที่ปรับ |
| 09 | industry | คงฉากเดิม ใช้ typography กลางที่ปรับ |
| 10 | power-storage | คงฉากเดิม ใช้ typography กลางที่ปรับ |
| 11 | rail-specialized | คงฉากเดิม ใช้ typography กลางที่ปรับ |
| 12 | regions | คงฉากเดิม ใช้ typography กลางที่ปรับ |
| 13 | advantages | คงฉากเดิม ใช้ typography กลางที่ปรับ |
| 14 | challenges | คงฉากเดิม ใช้ typography กลางที่ปรับ |
| 15 | closing | คงองค์ประกอบปิดเรื่องเดิม |

## รายการฉากและ mapping ทั้ง 24 ฉากที่วางแผน

| ฉากใหม่ | หัวข้อ | ฉาก/section เดิม | แนวทางและสถานะ |
|---|---|---|---|
| 01 | หน้าปก | opening | รักษาหน้าปกเดิม |
| 02 | ภาพรวมจีน | china-scale / china-hydrogen-overview | ทำฉากอ้างอิงใหม่ |
| 03 | สัดส่วนการผลิต | production-mix / hydrogen-production-structure | ทำฉากอ้างอิงใหม่ |
| 04 | ไฮโดรเจนสีเขียว | green-hydrogen / hydrogen-production-structure | รออนุมัติภาพ 02–03 |
| 05 | อุปกรณ์ | ส่วนเดียวกับ 04 | ต้องแยกเนื้อหาอุปกรณ์จากฉากเดิม |
| 06 | เครือข่ายสถานี | infrastructure / hydrogen-infrastructure | ต้องแยกจากภาพรวมเดิม |
| 07 | การขยายสถานี | infrastructure / station-counts-and-service-cities | แยก actual / planned / forecast |
| 08 | การขนส่งไฮโดรเจน | infrastructure / hydrogen-infrastructure | ต้องแยกเรื่องต้นทุนขนส่ง |
| 09 | จำนวนรถ | vehicle-deployment | แยกตัวเลขปลายปี 2025 |
| 10 | การเปลี่ยนผ่านตลาด | vehicle-deployment | ต้องใช้ timeline เชิงคุณภาพ |
| 11 | รถเชิงพาณิชย์ | vehicle-deployment | รักษาฐานคำนวณ 65% ของ commercial |
| 12 | พลังงานลม–แสงอาทิตย์–ไฮโดรเจน | power-storage / power-and-energy-storage | เพิ่มสองโหมดใน Phase 4 |
| 13 | พลังงานกระจายศูนย์ | power-storage / power-and-energy-storage | แยกสถานการณ์สำรองไฟ |
| 14 | การเผาไหม้ร่วม | power-storage / power-and-energy-storage | ตรวจความหมาย H₂ / ammonia ก่อนทำภาพ |
| 15 | การใช้ในโลจิสติกส์ | heavy-duty-logistics / four-application-sectors-transport | ต้องมีภาพสี่การใช้งาน |
| 16 | สมรรถนะรถ | heavy-duty-logistics / heavy-duty-truck-logistics | แสดงเงื่อนไขเฉพาะรุ่น |
| 17 | ภูมิภาคโลจิสติกส์หนัก | heavy-duty-logistics + regions | ไม่สร้าง freight corridors สมมติ |
| 18 | รถไฟชานเมือง | rail-specialized / passenger-rail | ต้องมีภาพรุ่นจริงและแยกปีทดสอบ |
| 19 | รถรางฝอซาน | rail-specialized / passenger-rail | ตรวจสถานะบริการปัจจุบัน |
| 20 | รถรางท่องเที่ยว | rail-specialized / passenger-rail | ตรวจชื่อรุ่นและช่วงทดลอง/บริการ |
| 21 | หัวรถจักร 2,400 kW | rail-specialized / freight-and-mining-locomotives | ต้องระบุเงื่อนไข 10,000 ตัน |
| 22 | หัวรถจักรขนาดเล็ก | rail-specialized / freight-and-mining-locomotives | ไม่สร้างค่าลด CO₂ เฉพาะรุ่น |
| 23 | แผนที่รถไฟ | rail-specialized + regions | ต้องแยกชนิดโครงการ/สถานะ |
| 24 | สามอุปสรรค | challenges / adoption-barriers + remaining-challenges | ลำดับ focus โดยผู้นำเสนอ |

ฉากเดิมเพิ่มเติมที่ยังคงอยู่: refrigerated-logistics, industry, advantages และ closing ไม่ลบทิ้งเพื่อบังคับจำนวนฉากใหม่ ฉาก 01–15 ยังใช้ลำดับเดิมจนกว่าจะอนุมัติ Phase 4

## แผนก่อนแก้โครงสร้าง

1. เพิ่ม design tokens สีขาว/น้ำเงินและขนาดตัวอักษรที่สัมพันธ์กับทั้งความกว้างและความสูง เพิ่มขนาด control/label โดยให้ฉากเนื้อหายาวเลื่อนได้
2. เพิ่ม MotionProvider กลาง: pause, reduced motion, document visibility; ฉากที่ไม่อยู่บนหน้าจอหยุดทำงานและ cleanup เมื่อออกจากฉาก
3. เพิ่ม AnimatedNumber และ GSAP entrance แบบ scoped context; หลีกเลี่ยงการ reset เมื่อแปลภาษา
4. แยกเฉพาะ reference scenes ออกจาก generic SceneContainer; ใช้ numeric data กลางและข้อความใน i18next เดิม
5. สร้างแผนที่ 3D จาก GeoJSON เดิมจริง ไม่สร้างพรมแดนใหม่ ใช้จุดและเส้นแสดงแนวคิดพร้อมคำอธิบายว่าไม่ใช่ตำแหน่งสถานี/เส้นทางจริง
6. ทำแท่ง 56/21/21 บนฐานเดียวกัน 0–100% พร้อมค่าและ label ที่คงที่ มี energy shimmer เฉพาะแท่ง
7. ตรวจ typecheck, lint, content check, build/offline และตรวจ browser ตามเครื่องมือที่เข้าถึงได้ บันทึกข้อจำกัดตามจริง
8. หยุดหลัง Phase 3 เพื่ออนุมัติภาพ ตามคำสั่งผู้ใช้: “Pause for visual approval before proceeding to the remaining scenes.”

## ความเสี่ยงและการป้องกัน

- ข้อมูล 2026 หลายรายการไม่มี claim-level citation: เก็บ source ledger เดิมและทำ verification record แยก แสดงปีข้อมูลให้ชัด
- WebGL ล้มเหลวหรือ GPU อ่อน: lazy-load Canvas เฉพาะ scene 02, DPR จำกัด, ไม่มี postprocessing, SVG fallback
- layout ไทยยาวกว่าอังกฤษ: ใช้ grid สัดส่วนคงที่, natural wrap, minmax(0,...) และ responsive ที่อิงความสูง ห้ามย่อข้อมูลสำคัญจนอ่านไม่ได้
- mount/unmount และ React StrictMode: GSAP context.revert, remove listeners/observers, R3F dispose geometry ที่เป็นเจ้าของ
- ไม่มี browser session ให้ CUA ในการตรวจเริ่มต้น: server HTTP 200 แต่ยังไม่นับว่าได้ visual QA จะบันทึกผลจริงในรายงานส่งมอบ

## assets ที่ต้องใช้ในระยะถัดไป

| กลุ่มฉาก | asset ที่มี | สิ่งที่ขาด |
|---|---|---|
| 02–03 | Natural Earth map + SVG/DOM chart | ไม่มีสิ่งที่ต้องซื้อ/สร้างภาพใหม่ |
| 04–05 | process icons | ภาพโรงงานและอุปกรณ์ที่ตรวจสอบได้; โมเดลสำหรับการเคลื่อนไหวชิ้นส่วนจริง |
| 06–08 | station schematic + map | ข้อมูลขอบเขตคลัสเตอร์; diagram ขนส่งที่ผ่านการตรวจทางเทคนิค |
| 09–11, 15–17 | รถแนวคิด JPEG | รถบรรทุก/รถบัส/รถยนต์ GLB และภาพ port/mining/steel/intercity ที่ตรงบริบท |
| 12–14 | process icons | แบบระบบพลังงานและ boiler ที่ตรวจสอบแล้ว; ภาพ island/border/data center |
| 18–23 | rail SVG แนวคิด | ภาพหรือโมเดลรถรุ่นจริง พร้อมสิทธิ์ใช้และวันอ้างอิงแต่ละโครงการ |
| 24 | รถแนวคิด + station SVG | ภาพ dispenser 35/70 MPa และแหล่งราคาที่ระบุวัน/พื้นที่ |

assets ทุกชิ้นที่เพิ่มใน Phase 3 เป็น code-native geometry จากข้อมูลเดิม ไม่ได้สร้างภาพรถหรือโรงงานที่อาจถูกเข้าใจว่าเป็นรุ่นจริง

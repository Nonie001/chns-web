# CHNS Website

เว็บไซต์สภาเครือข่ายช่วยเหลือด้านมนุษยธรรม สำนักจุฬาราชมนตรี ใช้ Next.js 16 App Router, React 19, TypeScript และ Tailwind CSS 4

## สถานะ

โครงหน้าสาธารณะตาม sitemap อยู่ใน `src/app/(site)/` แล้ว ระบบหลังบ้านใช้ Supabase Auth, PostgreSQL/RLS และ private Storage สำหรับ Hero, ข่าว/บทความ, โครงการ, รายงาน, โลโก้ภาคี และเนื้อหาเด่น หน้าเว็บอ่านเฉพาะรายการที่เผยแพร่ ตัวอย่างภาพและเนื้อหาถูกนำเข้าเป็นฉบับร่างสำหรับพรีวิวหลังบ้าน และมีกฎฐานข้อมูลห้ามเผยแพร่รายการ mockup เว็บไซต์ตั้ง `noindex` ระหว่างรออนุมัติเนื้อหาและสื่อ คลังสื่อร่วมและ workflow หลาย role ยังไม่เสร็จ การรับชำระเงินยังไม่เปิด

## เอกสารหลัก

- [วิเคราะห์เอกสารต้นทาง](docs/website-analysis.md)
- [สถาปัตยกรรมและโครงไฟล์](docs/architecture.md)
- [โมเดลข้อมูลและกติกาเนื้อหา](docs/content-model.md)
- [ขอบเขตระบบหลังบ้าน](docs/admin.md)
- [ประเด็นรอตัดสินใจ](docs/decisions.md)
- [วิเคราะห์เว็บไซต์ตัวอย่าง](docs/reference-sites.md)
- [แผนพัฒนาทีละเฟส](docs/phases.md)
- [บันทึกความคืบหน้า](docs/progress.md)
- [ภาพและข้อมูล mockup](docs/mockup-assets.md)
- [สไลด์ภาพและวิธีตั้งค่าหลังบ้าน](docs/hero-carousel-admin.md)
- [ข่าว/บทความและวิธีใช้งานหลังบ้าน](docs/article-admin.md)
- [โครงการและวิธีใช้งานหลังบ้าน](docs/project-admin.md)
- [รายงาน PDF และวิธีใช้งานหลังบ้าน](docs/report-admin.md)
- [การเลือกเนื้อหาเด่นหน้าแรก](docs/homepage-features.md)
- [ตรวจหน้าแรกเทียบ Content Wireframe](docs/homepage-content-audit.md)
- [ตรวจผังเมนูและเส้นทางผู้ใช้](docs/navigation-audit.md)
- [การใช้งาน Supabase](docs/supabase-setup.md)
- [หน้าสถานะ 404, 500 และโหลดข้อมูล](docs/status-pages.md)
- [Project skill](.agents/skills/chns-web/SKILL.md)

## คำสั่งปัจจุบัน

```bash
npm install
npm run dev
npm run lint
npm run build
npm run supabase:verify
npm run backup:local -- --out /path/to/new-directory
```

ตั้งค่าแอปใน `src/app/`; เก็บ `public/`, `package.json`, `next.config.ts` และ `tsconfig.json` ที่รากโปรเจกต์ตาม convention ของ Next.js รุ่นนี้
ตั้งค่า `.env.local` ตาม `.env.example` แล้วอ่าน [คู่มือ Supabase](docs/supabase-setup.md) สำหรับการเพิ่มผู้ดูแล การนำเข้าข้อมูลเดิม และการสำรองข้อมูล

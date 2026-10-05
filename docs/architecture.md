# สถาปัตยกรรมเว็บไซต์ CHNS

สถานะ: โครงหน้าสาธารณะครบตาม sitemap สำหรับตรวจงาน; หลังบ้าน Hero, ข่าว/บทความ, โครงการ, รายงาน PDF, โลโก้ภาคี และ featured ใช้ Supabase Auth, PostgreSQL/RLS และ private Storage แล้ว

## เป้าหมายและขอบเขตรอบนี้

ใช้ codebase Next.js เดียวสำหรับเว็บสาธารณะและหลังบ้าน แต่แยก route, layout, feature และการเข้าถึงข้อมูลชัดเจน โค้ดเดิมย้ายเข้า `src/` แล้ว มีโครงหน้าสาธารณะครบหมวดหลัก โมดูลหลังบ้านใช้ Supabase และตรวจสิทธิ์ซ้ำที่ data access/action รายละเอียดอยู่ในคู่มือแต่ละโมดูล

## โครงไฟล์ที่จัดไว้

```text
.
├── .agents/skills/chns-web/SKILL.md  # แนวทางเฉพาะโปรเจกต์สำหรับเอเจนต์
├── docs/                              # แผนและบันทึกการตัดสินใจ
├── public/                            # ไฟล์เผยแพร่ได้เท่านั้น
├── supabase/                          # config, SQL migration และ RLS เป้าหมาย
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # root layout
│   │   ├── globals.css
│   │   ├── icon.png                   # สัญลักษณ์จากโลโก้ที่ผู้ใช้ส่งมา
│   │   ├── (site)/layout.tsx          # Header, Footer
│   │   ├── (site)/page.tsx            # route /
│   │   ├── (site)/about/...           # ประวัติ ทิศทาง โครงสร้าง
│   │   ├── (site)/departments/...     # รายชื่อและหน้าแต่ละฝ่าย
│   │   ├── (site)/projects/...        # รายชื่อและหน้าแต่ละโครงการ
│   │   ├── (site)/news/...            # รายชื่อและหน้าบทความ
│   │   ├── (site)/media|reports|centers|members|search/...
│   │   ├── (site)/participate/...     # สนับสนุนและสมาชิกองค์กร
│   │   ├── (admin)/admin/            # login และโมดูลคอนเทนต์ที่ตรวจ session
│   │   └── api/                      # เสิร์ฟภาพ/PDF ตามสถานะเผยแพร่/สิทธิ์
│   ├── components/
│   │   ├── ui/                         # primitives ข้าม feature
│   │   ├── site/                       # header, footer, breadcrumb
│   │   └── admin/                      # shell, navigation, table, form ของหลังบ้าน
│   ├── features/
│   │   ├── admin/                      # dashboard และ shell
│   │   ├── hero/                       # สไลด์หน้าแรก
│   │   ├── articles/                   # ข่าวและบทความ
│   │   ├── reports/                    # รายงาน PDF
│   │   ├── homepage/                   # เนื้อหาเด่น
│   │   ├── departments/
│   │   ├── projects/
│   │   ├── news/
│   │   ├── centers/
│   │   └── participation/
│   ├── content/static/                 # ข้อมูลที่เปลี่ยนไม่บ่อยและตรวจแล้ว
│   └── lib/
│       ├── auth/                       # session, permissions
│       ├── storage/                    # media/private uploads
│       ├── supabase/                   # client factory และ data access ปัจจุบัน
│       └── seo/                        # metadata, sitemap helpers
├── next.config.ts
└── tsconfig.json                       # @/* ชี้เข้า src/*
```

โฟลเดอร์ว่างที่มี `.gitkeep` เป็นจุดวางโมดูล ไม่ได้หมายความว่าฟังก์ชันนั้นถูกสร้างแล้ว `app/` ใช้เฉพาะ route และ layout; logic ของเนื้อหาควรอยู่ใน `features/` และการอ่าน/เขียนข้อมูลใน `lib/` หรือ data access layer ของ feature นั้น หน้าเฟส 1 ยังใช้ static content ขนาดเล็กใน `src/content/static/site.ts` และตั้ง `noindex` จนกว่าจะได้รับการอนุมัติให้เผยแพร่

## แผน route

| เว็บสาธารณะ `(site)` | หลังบ้าน `(admin)/admin` |
| --- | --- |
| `/`, `/about`, `/about/history`, `/about/direction`, `/about/structure` | `/admin/login` |
| `/departments`, `/departments/[slug]` | `/admin` dashboard |
| `/projects`, `/projects/[slug]` | `/admin/projects`, `/admin/projects/[id]` |
| `/news`, `/news/[slug]`, `/media`, `/reports`, `/search` | `/admin/articles`, `/admin/reports` |
| `/centers`; โลโก้องค์กรสมาชิกอยู่ที่ `/#network` และ `/members` ส่งต่อไปส่วนนั้น | `/admin/departments`, `/admin/centers`, `/admin/members` |
| `/participate`, `/participate/donate`, `/participate/membership`, `/contact`, `/privacy`, `/cookies` | `/admin/media`, `/admin/settings`, `/admin/users` |

เส้นทางเว็บสาธารณะในตารางมีหน้าแล้ว แต่ URL ยังต้องเทียบเว็บเดิมก่อนกำหนด redirect จริง Route group `(site)`/`(admin)` ไม่ปรากฏใน URL. ฝั่ง admin ที่ใช้งานแล้วมี `/admin/login`, `/admin`, `/admin/homepage/slides`, `/admin/homepage/features`, `/admin/articles`, `/admin/projects`, `/admin/reports` และ `/admin/partners` พร้อมหน้าเพิ่ม/แก้ โดยตรวจสิทธิ์ซ้ำที่ data access/action; พรีวิวเฉพาะข่าว/โครงการ โมดูลอื่นในตารางยังเป็นแผน

## ขอบเขตข้อมูล: hardcode กับหลังบ้าน

| เก็บในโค้ดเมื่ออนุมัติแล้ว | ให้แก้ผ่านหลังบ้าน |
| --- | --- |
| ชื่อองค์กรทางการ, ประวัติ/วิสัยทัศน์ที่อนุมัติ, คำอธิบายเชิงนโยบาย | ข่าว บทความ ประกาศ วิดีโอ |
| รายชื่อและคำอธิบายพื้นฐานของฝ่าย 8 ฝ่าย, slug, ลำดับการแสดง | โครงการ/แคมเปญ สถานะ ความคืบหน้า ผลลัพธ์ และหลักฐาน |
| โครง navigation, คำ UI, social/contact ที่มีผู้รับผิดชอบแก้ผ่าน release | Hero/แบนเนอร์เร่งด่วน, รายงาน, องค์กรสมาชิก/โลโก้, ศูนย์ประสานงาน |
| ประเภท/สถานะ/taxonomy ที่เป็นกติกาของระบบ | ภาพและไฟล์ที่มีสิทธิ์เผยแพร่, รายการ featured |

ข้อมูลที่ hardcode ควรเป็นไฟล์ TypeScript มีชนิดข้อมูลชัด ไม่ฝังสตริงกระจายตาม component และต้องมีเจ้าของข้อมูล/วันที่ตรวจล่าสุดเมื่อเป็นข้อมูลทางการ หากทีมงานต้องเปลี่ยนเองบ่อย ให้ย้าย field นั้นเข้า CMS โดยไม่เปลี่ยนหน้าที่เรียกใช้ ส่วนข้อมูลติดต่อสามารถเริ่มในโค้ดได้หลังยืนยันเบอร์กลาง; ถ้าต้องแก้ฉุกเฉินโดยไม่ deploy ให้ย้ายเข้า Settings ของหลังบ้าน

## สถาปัตยกรรมข้อมูลเป้าหมาย

1. **ฐานข้อมูล**: โมดูลคอนเทนต์ใช้ Supabase PostgreSQL/RLS; SQLite เดิมเก็บไว้ใน `.data/` เพื่อสำรองและนำเข้าย้อนหลัง ไม่อยู่ใน runtime เว็บ
2. **การเข้าถึงข้อมูล**: Server Component อ่านผ่าน server-only data access layer; public query คืนรายการ `published` และข้อยกเว้นเฉพาะข่าว/โครงการตัวอย่างที่เจ้าของเว็บขอให้เปิดด้วย `showcase_visible=true`; admin query ตรวจ session + role + ขอบเขตฝ่ายก่อนอ่านหรือเขียน และคืน DTO เท่าที่หน้าต้องใช้
3. **การแก้ไข**: ใช้ Server Actions สำหรับฟอร์มภายในเมื่อเหมาะสม หรือ Route Handlers สำหรับ webhook/ผู้ใช้ภายนอก ทุก mutation ตรวจสิทธิ์และ validate ข้อมูลซ้ำที่ server หลังเผยแพร่จึง revalidate หน้าที่เกี่ยวข้อง
4. **สื่อ**: เป้าหมายคือ private Supabase Storage; Route Handler ตรวจสถานะเนื้อหาก่อนคืนไฟล์ public/preview ไฟล์ที่ไม่มีสิทธิ์ไม่อยู่ใน `public/`
5. **ค้นหาและ SEO**: เริ่มจากฐานข้อมูลและ taxonomy สำหรับข่าว/โครงการ ก่อนเพิ่ม search service; หน้าเผยแพร่มี metadata, canonical, OG, sitemap และ redirect จาก URL เดิม
6. **ภาษา**: เว็บภาษาไทยก่อน; งานภาษาอังกฤษพักไว้ตามคำขอผู้ใช้

รายละเอียดการย้ายอยู่ใน [supabase-setup.md](supabase-setup.md) และหน้าสถานะอยู่ใน [status-pages.md](status-pages.md)

## เกณฑ์ก่อนเปิด admin โมดูลถัดไป

โมดูล Hero, Article, Project, Report และ Partner Logo มี auth/session, role admin, validation, audit และ private file access แล้ว มีคำสั่งสำรองข้อมูลในเครื่อง ก่อนขยายเป็น workflow หลายผู้ใช้ ต้องกำหนด role/scope/revision และทดสอบ backup/restore บนโฮสต์จริง

## แหล่งอ้างอิงทางเทคนิคในโปรเจกต์

อ่านคู่มือของ Next.js 16.3.6 ที่ `node_modules/next/dist/docs/01-app/` ก่อนแก้โค้ด โดยเฉพาะ `01-getting-started/02-project-structure.md`, `03-api-reference/03-file-conventions/src-folder.md`, `02-guides/authentication.md`, `02-guides/data-security.md` และ `01-getting-started/07-mutating-data.md`

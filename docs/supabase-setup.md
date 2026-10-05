# Supabase สำหรับ CHNS

สถานะ 26 กันยายน 2569: แอปใช้ Supabase Auth, PostgreSQL พร้อม RLS และ private Storage จริงแล้ว โปรเจกต์เชื่อมกับ CLI และ migration ทั้งหมดใน `supabase/migrations/` ถูกใช้กับโปรเจกต์นั้นแล้ว

## ตั้งค่าและรัน

1. ใส่ Project URL และ publishable/anon key ใน `.env.local` ตาม `.env.example` ห้าม commit ไฟล์นี้หรือใส่ `service_role` ในตัวแปร `NEXT_PUBLIC_*`
2. รัน `npm install` และ `npm run dev` หรือ `npm run build && npm run start`
3. เข้าหลังบ้านที่ `/admin/login` ด้วยบัญชี Supabase Auth ที่อยู่ใน `public.chns_admin_users` และมี `role='admin'`, `active=true`
4. ผู้ดูแลคนแรก `anas.aouming@gmail.com` ถูกสร้างแล้ว รหัสเริ่มต้นอยู่ใน `.data/supabase-admin-initial.txt` ซึ่งไม่อยู่ใน Git และอ่านได้เฉพาะเจ้าของไฟล์ หลังล็อกอินให้เปลี่ยนที่ `/admin/account` แล้วลบไฟล์รหัสเริ่มต้น

`scripts/provision-supabase-admin.mjs` ใช้ CLI ที่ล็อกอินแล้วและ service key เฉพาะระหว่างรันเพื่อสร้างบัญชีและบันทึกสิทธิ์ ไม่ควรใช้ซ้ำโดยไม่ตรวจผู้ใช้ใน Auth ก่อน เพิ่มผู้ดูแลคนถัดไปผ่านกระบวนการที่เจ้าของระบบอนุมัติ

## ข้อมูลและสิทธิ์

- เว็บสาธารณะอ่าน `status='published'` ผ่าน anon client และ RLS; ข้อยกเว้นเฉพาะข่าว/บทความจำลอง 11 ชิ้นและโครงการจำลอง 6 ชิ้นที่ตั้ง `showcase_visible=true` ตามคำขอให้เห็นบนหน้าเว็บ โดยติดป้ายตัวอย่างชัดเจน หลังบ้านตรวจ Supabase session และแถวสิทธิ์ใน `chns_admin_users` ก่อนอ่านหรือแก้ไข
- bucket `chns-content` เป็น private ไฟล์เผยแพร่จะอ่านได้เมื่อมีแถวเนื้อหาที่เผยแพร่และยืนยันสิทธิ์สื่ออ้างถึง path ตรงกัน ไฟล์ร่างอ่านได้เฉพาะผู้ดูแล
- mockup 3 สไลด์, 6 โครงการ, 11 ข่าว/บทความ และ 3 รายงาน ถูกนำเข้าเป็น `draft` พร้อม `is_mockup=true` กฎ CHECK ในฐานข้อมูลกันการเผยแพร่จนกว่าจะสร้างข้อมูลจริงแทน; ข่าว/บทความและโครงการมี `showcase_visible` สำหรับแสดงตัวอย่างบนเว็บ
- ภาคีและโลโก้ที่เผยแพร่แล้ว 47 รายการถูกย้ายจาก SQLite/ไฟล์ในเครื่องไป Supabase แล้ว SQLite เดิมยังอยู่ใน `.data/` เพื่อสำรองย้อนหลัง
- `npm run supabase:verify` ตรวจจำนวนข้อมูล การมองเห็นผ่าน anon การดาวน์โหลดภาพสาธารณะ/ภาพร่าง และการเข้าสู่ระบบของผู้ดูแล ต้องมีไฟล์รหัสเริ่มต้นอยู่จึงตรวจล็อกอินได้ หลังเปลี่ยนรหัสให้ทดสอบล็อกอินด้วยรหัสใหม่ด้วยตนเอง

## การเปลี่ยน schema และการย้ายข้อมูล

ใช้ `supabase db push` เพื่อใช้ migration ใหม่กับโปรเจกต์ที่ link แล้ว ตรวจ SQL ก่อน push เสมอ `npm run supabase:import` เป็นสคริปต์นำเข้าข้อมูลเก่าแบบ idempotent โดยอ่าน SQLite ที่ `.data/chns.sqlite` และภาพใน `assets/mockups/`; ไม่ใช่งานที่รันทุกครั้งตอน deploy สคริปต์ใช้ service key จาก CLI ในหน่วยความจำเท่านั้น

ยังไม่มีระบบ revision/การอนุมัติหลาย role, การสแกนไฟล์, และการสำรอง/กู้คืน Supabase แบบทดสอบจริง ห้ามถือว่าระบบเหล่านี้พร้อมใช้งานเพราะมี schema เบื้องต้น

อ้างอิง: [Supabase Auth และ Next.js](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs), [Storage access control](https://supabase.com/docs/guides/storage/security/access-control)

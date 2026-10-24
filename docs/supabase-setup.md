# Supabase สำหรับ CHNS

สถานะ 25 ตุลาคม 2569: แอปใช้ Supabase Auth, PostgreSQL/RLS และ Storage จริงแล้ว โปรเจกต์เชื่อมกับ CLI และ migration ทั้งหมดใน `supabase/migrations/` ถูกใช้กับโปรเจกต์นั้นแล้ว

## ตั้งค่าและรัน

1. ใส่ Project URL และ publishable/anon key ใน `.env.local` ตาม `.env.example` ห้าม commit ไฟล์นี้หรือใส่ `service_role` ในตัวแปร `NEXT_PUBLIC_*`
2. รัน `npm install` และ `npm run dev` หรือ `npm run build && npm run start`
3. เข้าหลังบ้านที่ `/admin/login` ด้วยบัญชี Supabase Auth ที่อยู่ใน `public.chns_admin_users` และมี `role='admin'`, `active=true`
4. ใช้อีเมลและรหัสผ่านปัจจุบันของบัญชีผู้ดูแล ไฟล์รหัสเริ่มต้นใน `.data/` อาจไม่ตรงกับรหัสที่เปลี่ยนไปแล้ว เปลี่ยนรหัสผ่านของบัญชีตนเองได้ที่ `/admin/account`

`scripts/provision-supabase-admin.mjs` ใช้ CLI ที่ล็อกอินแล้วและ service key เฉพาะระหว่างรันเพื่อสร้างบัญชีและบันทึกสิทธิ์ ไม่ควรใช้ซ้ำโดยไม่ตรวจผู้ใช้ใน Auth ก่อน เพิ่มผู้ดูแลคนถัดไปผ่านกระบวนการที่เจ้าของระบบอนุมัติ

## ข้อมูลและสิทธิ์

- เว็บสาธารณะอ่านเฉพาะ `status='published'` ผ่าน anon client และ RLS; หลังบ้านตรวจ Supabase session และแถวสิทธิ์ใน `chns_admin_users` ก่อนอ่านหรือแก้ไข
- bucket `chns-content` เป็น private ไฟล์เผยแพร่จะอ่านได้เมื่อมีแถวเนื้อหาที่เผยแพร่และยืนยันสิทธิ์สื่ออ้างถึง path ตรงกัน ไฟล์ร่างอ่านได้เฉพาะผู้ดูแล
- migration `20261025000100` ลบข้อมูล mockup เก่า 27 รายการและปิด RLS policy ที่เคยแสดงร่างตัวอย่าง ไฟล์ Storage ของรายการเหล่านั้นถูกลบแล้ว migration `20261025000200` ลบคอลัมน์ `showcase_visible`; `is_mockup` และ CHECK ยังอยู่เพื่อป้องกันข้อมูลตัวอย่างใหม่หลุดเผยแพร่
- Hero 4 สไลด์จากภาพที่ CHNS ส่งมาอยู่ใน private bucket `chns-content` และเผยแพร่ผ่านหลังบ้าน/Route Handler เท่านั้น หน้าแรกไม่มีภาพสำรองในโค้ด
- ภาพประกอบ CHNS 20 ภาพอยู่ใน public bucket `chns-editorial` ซึ่งเปิดให้อ่านได้เฉพาะภาพที่อัปโหลดแล้ว และไม่มี write policy สำหรับผู้ชม/ผู้ใช้ทั่วไป ภาพมาสก์ตกแต่งและโลโก้ยังเป็นไฟล์ของแอป
- ภาคีและโลโก้ที่เผยแพร่แล้ว 47 รายการอ่านจาก Supabase Storage โดยตรง ภาพรวมโลโก้ชุดเริ่มต้นอยู่ใน `chns-editorial`; SQLite เดิมยังอยู่ใน `.data/` เพื่อสำรองย้อนหลัง
- `npm run supabase:verify` ตรวจว่าไม่มี mockup ค้าง, ผู้ชมเห็นเฉพาะ published, และภาพ Hero/ภาพประกอบจาก Storage อ่านได้ คำสั่งนี้ไม่ทดสอบรหัสผ่านผู้ดูแล

## การเปลี่ยน schema และการย้ายข้อมูล

ใช้ `supabase db push` เพื่อใช้ migration ใหม่กับโปรเจกต์ที่ link แล้ว ตรวจ SQL ก่อน push เสมอ สคริปต์นำเข้าข้อมูล mockup เก่าถูกลบเพื่อไม่ให้สร้างรายการตัวอย่างซ้ำ SQLite ที่ `.data/chns.sqlite` ยังเก็บไว้เป็นข้อมูลเดิมสำหรับสำรองย้อนหลัง

ยังไม่มีระบบ revision/การอนุมัติหลาย role, การสแกนไฟล์, และการสำรอง/กู้คืน Supabase แบบทดสอบจริง ห้ามถือว่าระบบเหล่านี้พร้อมใช้งานเพราะมี schema เบื้องต้น

อ้างอิง: [Supabase Auth และ Next.js](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs), [Storage access control](https://supabase.com/docs/guides/storage/security/access-control)

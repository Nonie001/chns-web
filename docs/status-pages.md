# หน้าสถานะเว็บไซต์

| สถานะ | ตำแหน่ง | พฤติกรรม |
| --- | --- | --- |
| 404 | `src/app/not-found.tsx`, `(site)/not-found.tsx`, admin protected `not-found.tsx` | URL ไม่ตรง route หรือ `notFound()` จากเนื้อหาที่ไม่มี/ปิดเผยแพร่; ให้ลิงก์กลับหน้าแรกหรือหน้ารายการ |
| 403 | `src/app/forbidden.tsx` | บัญชีที่ล็อกอินแล้วแต่ไม่มี role `admin` เข้า route หลังบ้านจะได้หน้าไม่มีสิทธิ์; ใช้ `authInterrupts` ของ Next.js 16.3 |
| 500 | `src/app/error.tsx`, `(site)/error.tsx`, admin protected `error.tsx` | ข้อผิดพลาดระหว่าง render; ข้อความทั่วไปและปุ่มลองอีกครั้ง ไม่แสดงรายละเอียด error ต่อผู้ใช้ |
| Root layout error | `src/app/global-error.tsx` | fallback ที่มี `<html>`/`<body>` ของตัวเอง |
| Loading | `(site)/search/loading.tsx`, admin `homepage/features/loading.tsx` | แสดงข้อความสถานะและแถบโหลดที่หยุด animation เมื่อผู้ใช้เปิด reduced motion; ไม่ครอบหน้ารายละเอียด เพื่อให้ `notFound()` ตอบ HTTP 404 แทน 200 จาก streaming |
| ไม่ได้ล็อกอิน / ไม่มีสิทธิ์ admin | `requireAdminSession()` และ login form | ผู้ไม่ล็อกอินถูกส่งไป `/admin/login`; บัญชีที่ล็อกอินแล้วแต่ไม่ใช่ admin ได้ 403 จาก route หลังบ้าน ส่วนฟอร์ม login ปฏิเสธและออกจากระบบทันที |

ไฟล์ภาพและ PDF ที่ไม่มีสิทธิ์ดูตอบ 404 จาก Route Handler โดยตรง จึงไม่เผยแพร่หน้า HTML ของไฟล์ร่าง การเปลี่ยน Auth เป็น Supabase ต้องคงพฤติกรรมนี้ไว้ และเพิ่มการทดสอบ 401/403 ตามรูปแบบสิทธิ์หลาย role เมื่อเริ่ม workflow นั้น

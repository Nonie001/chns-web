import Link from "next/link";
import { SlideEditor } from "@/components/admin/slide-editor";

export default function NewSlidePage() {
  return (
    <>
      <div className="admin-page-header">
        <Link className="text-link" href="/admin/homepage/slides">
          ← กลับไปรายการ
        </Link>
        <p className="eyebrow">NEW SLIDE</p>
        <h1>เพิ่มสไลด์</h1>
        <p>อัปโหลดภาพสไลด์ที่ออกแบบข้อความไว้ในภาพแล้ว</p>
      </div>
      <SlideEditor />
    </>
  );
}

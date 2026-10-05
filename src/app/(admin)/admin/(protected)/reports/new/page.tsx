import Link from "next/link";
import { ReportEditor } from "@/components/admin/report-editor";

export default function NewReportPage() {
  return (
    <>
      <div className="admin-page-header">
        <Link className="text-link" href="/admin/reports">← กลับไปรายการ</Link>
        <p className="eyebrow">NEW REPORT</p><h1>เพิ่มรายงาน</h1>
        <p>สร้างร่างพร้อมแหล่งข้อมูลและไฟล์ PDF ที่มีสิทธิ์เผยแพร่</p>
      </div>
      <ReportEditor />
    </>
  );
}

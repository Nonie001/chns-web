"use client";

import { useActionState } from "react";
import { saveReportAction } from "@/features/reports/actions";
import type { Report } from "@/features/reports/types";

export function ReportEditor({ report }: { report?: Report }) {
  const [state, action, pending] = useActionState(saveReportAction, { error: null });
  return (
    <form className="slide-editor" action={action}>
      <input type="hidden" name="id" value={report?.id ?? ""} />
      <div className="slide-editor__fields">
        <label>
          Slug สำหรับ URL
          <input name="slug" defaultValue={report?.slug ?? ""} maxLength={80} pattern="[a-z0-9]+(-[a-z0-9]+)*" required />
        </label>
        <label>
          ปีรายงาน
          <input name="year" type="number" min="1900" max="2100" defaultValue={report?.year ?? new Date().getFullYear()} required />
        </label>
        <label className="slide-editor__wide">
          ชื่อรายงาน
          <input name="title" defaultValue={report?.title ?? ""} maxLength={160} required />
        </label>
        <label>
          ประเภทรายงาน
          <input name="kind" defaultValue={report?.kind ?? ""} maxLength={80} required />
        </label>
        <label>
          เจ้าของข้อมูล/แหล่งที่มา
          <input name="source" defaultValue={report?.source ?? ""} maxLength={180} required />
        </label>
        <label className="slide-editor__wide">
          คำอธิบาย
          <textarea name="summary" defaultValue={report?.summary ?? ""} maxLength={400} rows={4} required />
        </label>
        <label className="slide-editor__wide">
          ไฟล์ PDF {report ? "(ไม่เลือก = ใช้ไฟล์เดิม)" : "(บันทึกร่างได้โดยยังไม่แนบ)"}
          <input name="file" type="file" accept="application/pdf,.pdf" />
          <small>PDF ไม่เกิน 15 MB · ระบบให้ดาวน์โหลดเฉพาะหลังเผยแพร่</small>
        </label>
        {report?.fileKey && <div className="slide-editor__wide report-editor__file">
          <a href={`/api/report-files/${report.fileKey}`}>ดาวน์โหลดไฟล์ปัจจุบัน ↗</a>
          <label><input name="removeFile" type="checkbox" /> ลบไฟล์ PDF</label>
        </div>}
        <label className="article-editor__consent slide-editor__wide">
          <input name="fileRightsConfirmed" type="checkbox" defaultChecked={report?.fileRightsConfirmed ?? false} />
          ยืนยันว่ามีสิทธิ์เผยแพร่ PDF นี้บนเว็บไซต์ CHNS
        </label>
      </div>
      <p className="slide-editor__hint">{report?.status === "published" ? "รายงานนี้เผยแพร่อยู่ การบันทึกจะเปลี่ยนหน้าเว็บทันทีพร้อมบันทึกประวัติ" : "บันทึกแล้วจะยังเป็นร่าง ต้องแนบไฟล์และกดเผยแพร่จากหน้ารายการ"}</p>
      {state.error && <p className="admin-form-error" role="alert">{state.error}</p>}
      <button className="button button--accent" type="submit" disabled={pending}>{pending ? "กำลังบันทึก…" : "บันทึกรายงาน"}</button>
    </form>
  );
}

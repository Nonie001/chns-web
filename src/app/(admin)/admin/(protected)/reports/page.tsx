import Link from "next/link";
import { changeReportStatusAction } from "@/features/reports/actions";
import { listAdminReports } from "@/features/reports/report-store";

const statusLabels = { draft: "ร่าง", published: "เผยแพร่", archived: "เก็บถาวร" } as const;

export default async function AdminReportsPage({ searchParams }: PageProps<"/admin/reports">) {
  const reports = await listAdminReports();
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error.slice(0, 180) : null;
  return (
    <>
      <div className="admin-page-header admin-page-header--row">
        <div><p className="eyebrow">RESOURCES</p><h1>รายงานและเอกสาร</h1><p>จัดการไฟล์ PDF ที่องค์กรอนุมัติให้เผยแพร่</p></div>
        <Link href="/admin/reports/new" className="button button--accent">+ เพิ่มรายงาน</Link>
      </div>
      {error && <p className="admin-form-error" role="alert">{error}</p>}
      <div className="admin-slide-list">
        {reports.length === 0 ? <div className="admin-empty"><h2>ยังไม่มีรายงาน</h2><p>เพิ่มรายการแรกเป็นร่าง แล้วแนบ PDF ก่อนเผยแพร่</p></div> : reports.map((report) => (
          <article className="admin-panel admin-report-card" key={report.id}>
            <span className={`admin-status admin-status--${report.status}`}>{statusLabels[report.status]}</span>
            <h2>{report.title}</h2>
            <p>{report.kind} · ปี {report.year} · {report.fileKey ? "มี PDF" : "ยังไม่มี PDF"}</p>
            <div className="admin-slide-card__actions">
              <Link className="button button--dark" href={`/admin/reports/${report.id}`}>แก้ไข</Link>
              {report.fileKey && <a className="button button--dark" href={`/api/report-files/${report.fileKey}`}>ดาวน์โหลด PDF</a>}
              <form action={changeReportStatusAction}>
                <input type="hidden" name="id" value={report.id} />
                <input type="hidden" name="status" value={report.status === "published" ? "draft" : "published"} />
                <button type="submit">{report.status === "published" ? "ปิดเผยแพร่" : "เผยแพร่"}</button>
              </form>
              <form action={changeReportStatusAction}>
                <input type="hidden" name="id" value={report.id} />
                <input type="hidden" name="status" value={report.status === "archived" ? "draft" : "archived"} />
                <button type="submit">{report.status === "archived" ? "คืนค่าร่าง" : "เก็บถาวร"}</button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

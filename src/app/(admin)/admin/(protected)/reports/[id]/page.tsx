import Link from "next/link";
import { notFound } from "next/navigation";
import { ReportEditor } from "@/components/admin/report-editor";
import { getAdminReport } from "@/features/reports/report-store";

export default async function EditReportPage({ params }: PageProps<"/admin/reports/[id]">) {
  const { id } = await params;
  const report = await getAdminReport(id);
  if (!report) notFound();
  return (
    <>
      <div className="admin-page-header">
        <Link className="text-link" href="/admin/reports">← กลับไปรายการ</Link>
        <p className="eyebrow">EDIT REPORT</p><h1>แก้ไขรายงาน</h1>
        <p>สถานะปัจจุบัน: {report.status === "published" ? "เผยแพร่" : report.status === "draft" ? "ร่าง" : "เก็บถาวร"}</p>
      </div>
      <ReportEditor report={report} />
    </>
  );
}

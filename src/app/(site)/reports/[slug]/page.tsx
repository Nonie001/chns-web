import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedReport } from "@/features/reports/report-store";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/reports/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const report = await getPublishedReport(slug);
  return report ? { title: `${report.title} | CHNS`, description: report.summary } : { title: "ไม่พบรายงาน | CHNS" };
}

export default async function ReportDetailPage({ params }: PageProps<"/reports/[slug]">) {
  const { slug } = await params;
  const report = await getPublishedReport(slug);
  if (!report) notFound();
  return (
    <>
      <section className="detail-hero">
        <div className="shell">
          <p className="eyebrow eyebrow--light">{report.kind} · ปี {report.year}</p>
          <h1>{report.title}</h1>
          <p>{report.summary}</p>
          <Link className="text-link text-link--light" href="/reports">กลับไปหน้ารายงาน ↗</Link>
        </div>
      </section>
      <section className="section page-section">
        <div className="shell article-body">
          <p><strong>เจ้าของข้อมูล/แหล่งที่มา:</strong> {report.source}</p>
          {report.publishedAt && <p><strong>เผยแพร่:</strong> {new Intl.DateTimeFormat("th-TH", { dateStyle: "long" }).format(new Date(report.publishedAt))}</p>}
          <a className="button button--dark" href={report.fileUrl} download>ดาวน์โหลด PDF ↗</a>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { listPublishedReports } from "@/features/reports/report-store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "รายงานและเอกสาร | CHNS", description: "รายงานและเอกสารที่เผยแพร่โดย CHNS" };

export default async function ReportsPage({ searchParams }: PageProps<"/reports">) {
  const params = await searchParams;
  const query = (typeof params.q === "string" ? params.q : "").trim().slice(0, 80);
  const kind = typeof params.kind === "string" ? params.kind : "";
  const year = typeof params.year === "string" ? params.year : "";
  const reports = await listPublishedReports();
  const kinds = [...new Set(reports.map((report) => report.kind))].sort((a, b) => a.localeCompare(b, "th"));
  const years = [...new Set(reports.map((report) => report.year))].sort((a, b) => b - a);
  const visibleReports = reports.filter((report) =>
    (!kind || report.kind === kind)
    && (!year || String(report.year) === year)
    && (!query || `${report.title} ${report.summary} ${report.source}`.toLocaleLowerCase("th").includes(query.toLocaleLowerCase("th"))),
  );
  return (
    <>
      <PageHero eyebrow="REPORTS & RESOURCES" title="รายงานและเอกสาร" description="พื้นที่รวบรวมรายงานภารกิจและเอกสารที่องค์กรอนุมัติให้เผยแพร่" imageSrc="/editorial/transparency.webp" />
      <section className="section page-section">
        <div className="shell">
          <div className="section-heading">
            <div><p className="eyebrow">TRANSPARENCY</p><h2 className="section-title">เอกสารที่ค้นเจอได้</h2></div>
          </div>
          <form className="content-filter" action="/reports" method="get" role="search">
            <div><label htmlFor="report-query">ค้นหารายงาน</label><input id="report-query" name="q" type="search" defaultValue={query} placeholder="ชื่อรายงานหรือแหล่งข้อมูล" maxLength={80} /></div>
            <div><label htmlFor="report-kind">ประเภท</label><select id="report-kind" name="kind" defaultValue={kind}><option value="">ทุกประเภท</option>{kinds.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
            <div><label htmlFor="report-year">ปี</label><select id="report-year" name="year" defaultValue={year}><option value="">ทุกปี</option>{years.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
            <button className="button button--dark" type="submit">แสดงผล</button>
          </form>
          {reports.length > 0 && <p className="filter-result-count">พบ {visibleReports.length} รายงาน</p>}
          {visibleReports.length > 0 ? <div className="report-list">
            {visibleReports.map((report, index) => <article className="report-row" key={report.slug}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><small>{report.kind} · ปี {report.year} · {report.source}</small><h3>{report.title}</h3><p>{report.summary}</p></div>
              <Link className="pill" href={`/reports/${report.slug}`}>ดูรายงาน ↗</Link>
            </article>)}
          </div> : <p className="content-empty">{reports.length ? "ไม่พบรายงานตามเงื่อนไขที่เลือก" : "ยังไม่มีรายงานที่เผยแพร่"}</p>}
        </div>
      </section>
    </>
  );
}

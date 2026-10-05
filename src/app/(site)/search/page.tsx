import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { departments } from "@/content/static/site";
import { listDisplayArticles } from "@/features/articles/article-store";
import { listDisplayProjects } from "@/features/projects/project-store";
import { listPublishedReports } from "@/features/reports/report-store";
import { listPublishedPartners } from "@/features/partners/partner-store";

export const metadata: Metadata = {
  title: "ค้นหา | CHNS",
  description: "ค้นหาฝ่ายงานและเนื้อหาที่เผยแพร่บนเว็บไซต์ CHNS",
};

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: PageProps<"/search">) {
  const params = await searchParams;
  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = (rawQuery ?? "").trim().slice(0, 100);
  const [articles, projects, reports, partners] = await Promise.all([
    listDisplayArticles(), listDisplayProjects(), listPublishedReports(), listPublishedPartners(),
  ]);
  const searchable = [
    ...departments.map((item) => ({ title: item.name, description: "ฝ่ายงาน", href: `/departments/${item.slug}` })),
    ...projects.map((item) => ({ title: item.title, description: `${item.isDemo ? "ตัวอย่าง · " : ""}${item.summary}`, href: `/projects/${item.slug}` })),
    ...articles.map((item) => ({ title: item.title, description: `${item.isDemo ? "ตัวอย่าง · " : ""}${item.summary}`, href: `/news/${item.slug}` })),
    ...reports.map((item) => ({ title: item.title, description: item.summary, href: `/reports/${item.slug}` })),
    ...partners.map((item) => ({ title: item.name, description: "องค์กรสมาชิก", href: `/#partner-${item.id}` })),
  ];
  const results = query
    ? searchable.filter((item) =>
        `${item.title} ${item.description}`
          .toLocaleLowerCase("th")
          .includes(query.toLocaleLowerCase("th")),
      )
    : [];

  return (
    <>
      <PageHero
        eyebrow="SEARCH CHNS"
        title="ค้นหา"
        description="ค้นหาฝ่ายงาน โครงการ และข่าวสาร"
      />
      <section className="section page-section">
        <div className="shell search-page">
          <form
            className="search-form"
            action="/search"
            method="get"
            role="search"
          >
            <label htmlFor="site-search">ค้นหาในเว็บไซต์</label>
            <div>
              <input
                id="site-search"
                name="q"
                type="search"
                defaultValue={query}
                placeholder="เช่น โครงการ ข่าว หรือฝ่ายงาน"
                maxLength={100}
              />
              <button className="button button--dark" type="submit">
                ค้นหา <span aria-hidden="true">↗</span>
              </button>
            </div>
          </form>
          {query && (
            <div className="search-results">
              <p className="eyebrow">SEARCH RESULTS</p>
              <h2>
                {results.length
                  ? `ผลลัพธ์สำหรับ “${query}”`
                  : `ไม่พบผลลัพธ์สำหรับ “${query}”`}
              </h2>
              {results.length > 0 && (
                <ul>
                  {results.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href}>
                        <strong>{item.title}</strong>
                        <span>{item.description}</span>
                        <b aria-hidden="true">↗</b>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

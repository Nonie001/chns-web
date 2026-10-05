import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/site/article-card";
import { PageHero } from "@/components/site/page-hero";
import { listDisplayArticles } from "@/features/articles/article-store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "ข่าวสารและบทความ | CHNS",
  description: "ข่าวสารและบทความที่เผยแพร่โดย CHNS",
};

export default async function NewsPage({ searchParams }: PageProps<"/news">) {
  const params = await searchParams;
  const kind = params.kind === "news" || params.kind === "story" ? params.kind : null;
  const query = (typeof params.q === "string" ? params.q : "").trim().slice(0, 80);
  const articles = await listDisplayArticles();
  const visibleArticles = articles.filter((article) =>
    (!kind || article.kind === kind)
    && (!query || `${article.title} ${article.summary} ${article.body}`.toLocaleLowerCase("th").includes(query.toLocaleLowerCase("th"))),
  );
  const sectionTitle = kind === "news" ? "ข่าวประชาสัมพันธ์" : kind === "story" ? "บทความและเรื่องราว" : "เรื่องราวและข้อมูล";
  return (
    <>
      <PageHero eyebrow="NEWS & STORIES" title="ข่าวสาร" description="ข่าวภารกิจ บทความ และเรื่องราวจากเครือข่าย" imageSrc="/editorial/participation.webp" imageCaption="ภาพประกอบแนวคิดการมีส่วนร่วม" />
      <section className="section page-section">
        <div className="shell">
          <div className="section-heading">
            <div><p className="eyebrow">LATEST UPDATES</p><h2 className="section-title">{sectionTitle}</h2></div>
          </div>
          {articles.some((article) => article.isDemo) && <p className="article-demo-banner">ข่าวและบทความด้านล่างเป็นตัวอย่างเพื่อดูรูปแบบเว็บไซต์ ไม่ใช่เหตุการณ์จริงของ CHNS</p>}
          <nav className="content-tabs" aria-label="ประเภทข่าวสาร">
            <Link href={query ? `/news?q=${encodeURIComponent(query)}` : "/news"} aria-current={!kind ? "page" : undefined}>ทั้งหมด</Link>
            <Link href={`/news?kind=news${query ? `&q=${encodeURIComponent(query)}` : ""}`} aria-current={kind === "news" ? "page" : undefined}>ข่าวประชาสัมพันธ์</Link>
            <Link href={`/news?kind=story${query ? `&q=${encodeURIComponent(query)}` : ""}`} aria-current={kind === "story" ? "page" : undefined}>บทความและเรื่องราว</Link>
          </nav>
          <form className="member-filter" action="/news" method="get" role="search">
            <label htmlFor="news-query">ค้นหาข่าวและบทความ</label>
            <div><input id="news-query" name="q" type="search" defaultValue={query} placeholder="หัวข้อหรือเนื้อหา" maxLength={80} /><button className="button button--dark" type="submit">ค้นหา</button></div>
            {kind && <input type="hidden" name="kind" value={kind} />}
          </form>
          {articles.length > 0 && <p className="filter-result-count">พบ {visibleArticles.length} รายการ</p>}
          {visibleArticles.length > 0 ? (
            <div className="feature-card-grid">{visibleArticles.map((article) => <ArticleCard article={article} key={article.slug} />)}</div>
          ) : <p className="content-empty">{articles.length ? "ไม่พบข่าวหรือบทความตามเงื่อนไขที่เลือก" : "ยังไม่มีข่าวหรือบทความที่เผยแพร่"}</p>}
        </div>
      </section>
    </>
  );
}

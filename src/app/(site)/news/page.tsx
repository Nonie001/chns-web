import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/site/article-card";
import { PageHero } from "@/components/site/page-hero";
import { ListPagination } from "@/components/site/list-pagination";
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
  const pageCount = Math.ceil(visibleArticles.length / 9);
  const requestedPage = typeof params.page === "string" && /^[1-9]\d*$/.test(params.page) ? Number(params.page) : 1;
  const page = Math.min(pageCount || 1, Number.isSafeInteger(requestedPage) ? requestedPage : 1);
  const pageArticles = visibleArticles.slice((page - 1) * 9, page * 9);
  const sectionTitle = kind === "news" ? "ข่าวประชาสัมพันธ์" : kind === "story" ? "บทความและเรื่องราว" : "เรื่องราวและข้อมูล";
  return (
    <>
      <PageHero eyebrow="NEWS & STORIES" title="ข่าวสาร" description="ข่าวภารกิจ บทความ และเรื่องราวจากเครือข่าย" imageSrc="/editorial/chns/page-news.webp" imagePosition="center top" />
      <section className="section page-section page-section--listing" id="results">
        <div className="shell">
          <div className="section-heading">
            <div><p className="eyebrow">LATEST UPDATES</p><h2 className="section-title">{sectionTitle}</h2></div>
          </div>
          {articles.length > 0 && <form className="news-filter listing-filter listing-filter--news" action="/news" method="get" role="search">
            <div className="listing-filter__search">
              <label className="sr-only" htmlFor="news-query">ค้นหาข่าวและบทความ</label>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.3" stroke="currentColor" strokeWidth="1.8" /><path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              <input id="news-query" name="q" type="search" defaultValue={query} placeholder="ค้นหาหัวข้อหรือเนื้อหา" maxLength={80} />
            </div>
            <div className="listing-filter__select">
              <label className="sr-only" htmlFor="news-kind">ประเภท</label>
              <select id="news-kind" name="kind" defaultValue={kind ?? ""}>
                <option value="">ทุกประเภท</option>
                <option value="news">ข่าวประชาสัมพันธ์</option>
                <option value="story">บทความและเรื่องราว</option>
              </select>
            </div>
            <div className="listing-filter__actions"><button className="listing-filter__submit" type="submit">กรองผล</button>{(query || kind) && <Link className="listing-filter__reset" href="/news#results">ล้างตัวกรอง</Link>}</div>
          </form>}
          {articles.length > 0 && <p className="filter-result-count">พบ {visibleArticles.length} รายการ{pageCount > 1 ? ` · หน้า ${page} จาก ${pageCount}` : ""}</p>}
          {visibleArticles.length > 0 ? (
            <div className="feature-card-grid">{pageArticles.map((article) => <ArticleCard article={article} key={article.slug} />)}</div>
          ) : <p className="content-empty">{articles.length ? "ไม่พบข่าวหรือบทความตามเงื่อนไขที่เลือก" : "ยังไม่มีข่าวหรือบทความที่เผยแพร่"}</p>}
          <ListPagination pathname="/news" page={page} pageCount={pageCount} filters={{ ...(query && { q: query }), ...(kind && { kind }) }} />
        </div>
      </section>
    </>
  );
}

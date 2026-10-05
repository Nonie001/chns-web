import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleDetail } from "@/components/site/article-detail";
import { ArticleCard } from "@/components/site/article-card";
import { getDisplayArticle, listDisplayArticles } from "@/features/articles/article-store";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getDisplayArticle(slug);
  return article ? { title: `${article.title} | CHNS`, description: article.summary } : { title: "ไม่พบบทความ | CHNS" };
}

export default async function ArticlePage({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const article = await getDisplayArticle(slug);
  if (!article) notFound();
  const related = (await listDisplayArticles()).filter((item) => item.slug !== slug && item.kind === article.kind).slice(0, 3);
  return <>
    <ArticleDetail article={article} />
    {related.length > 0 && <section className="section related-content"><div className="shell"><p className="eyebrow">RELATED STORIES</p><h2 className="section-title">อ่านต่อในหมวดเดียวกัน</h2><div className="feature-card-grid">{related.map((item) => <ArticleCard article={item} key={item.slug} />)}</div></div></section>}
  </>;
}

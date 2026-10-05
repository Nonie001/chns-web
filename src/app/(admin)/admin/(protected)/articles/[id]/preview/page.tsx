import { notFound } from "next/navigation";
import { ArticleDetail } from "@/components/site/article-detail";
import { getAdminArticle } from "@/features/articles/article-store";

export default async function ArticlePreviewPage({ params }: PageProps<"/admin/articles/[id]/preview">) {
  const { id } = await params;
  const article = await getAdminArticle(id);
  if (!article) notFound();
  return (
    <div className="admin-article-preview">
      <p className="admin-form-error">พรีวิวสำหรับผู้ดูแล · สถานะ {article.status === "published" ? "เผยแพร่" : "ยังไม่เผยแพร่"}</p>
      <ArticleDetail preview article={{
        slug: article.slug,
        title: article.title,
        kind: article.kind,
        summary: article.summary,
        body: article.body,
        imageSrc: article.imageKey ? `/api/article-images/${article.imageKey}` : null,
        imageAlt: article.imageAlt,
        imageCredit: article.imageCredit,
        publishedAt: article.status === "published" ? article.publishedAt : null,
        isDemo: article.isMockup,
      }} />
    </div>
  );
}

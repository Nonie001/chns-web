import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleEditor } from "@/components/admin/article-editor";
import { getAdminArticle } from "@/features/articles/article-store";

export default async function EditArticlePage({ params }: PageProps<"/admin/articles/[id]">) {
  const { id } = await params;
  const article = await getAdminArticle(id);
  if (!article) notFound();
  return (
    <>
      <div className="admin-page-header">
        <Link className="text-link" href="/admin/articles">← กลับไปรายการ</Link>
        <p className="eyebrow">EDIT ARTICLE</p>
        <h1>แก้ไขข่าวหรือบทความ</h1>
        <p>สถานะปัจจุบัน: {article.status === "published" ? "เผยแพร่" : article.status === "draft" ? "ร่าง" : "เก็บถาวร"}</p>
      </div>
      <ArticleEditor article={article} />
    </>
  );
}

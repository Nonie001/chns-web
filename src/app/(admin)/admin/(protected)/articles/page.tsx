import Image from "next/image";
import Link from "next/link";
import { changeArticleStatusAction } from "@/features/articles/actions";
import { listAdminArticles } from "@/features/articles/article-store";

const statusLabels = { draft: "ร่าง", published: "เผยแพร่", archived: "เก็บถาวร" } as const;

export default async function AdminArticlesPage({ searchParams }: PageProps<"/admin/articles">) {
  const articles = await listAdminArticles();
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error.slice(0, 180) : null;
  return (
    <>
      <div className="admin-page-header admin-page-header--row">
        <div>
          <p className="eyebrow">CONTENT</p>
          <h1>ข่าวและบทความ</h1>
          <p>เขียนร่าง ตรวจข้อมูลและสิทธิ์ภาพ ก่อนเผยแพร่ขึ้นเว็บไซต์</p>
        </div>
        <Link href="/admin/articles/new" className="button button--accent">+ เพิ่มบทความ</Link>
      </div>
      {error && <p className="admin-form-error" role="alert">{error}</p>}
      <div className="admin-slide-list">
        {articles.length === 0 ? (
          <div className="admin-empty"><h2>ยังไม่มีข่าวหรือบทความ</h2><p>เพิ่มรายการแรกเพื่อเริ่มจัดการเนื้อหาจริงผ่านหลังบ้าน</p></div>
        ) : articles.map((article) => (
          <article className="admin-slide-card" key={article.id}>
            <div className="admin-slide-card__image">
              {article.imageKey ? (
                <Image src={`/api/article-images/${article.imageKey}`} alt={article.imageAlt} fill sizes="(max-width: 800px) 100vw, 260px" unoptimized />
              ) : <span className="admin-slide-card__placeholder">ไม่มีภาพปก</span>}
            </div>
            <div className="admin-slide-card__content">
              <span className={`admin-status admin-status--${article.status}`}>{statusLabels[article.status]}</span>
              <h2>{article.title}</h2>
              <p>{article.kind === "news" ? "ข่าว" : "บทความ"} · /news/{article.slug}</p>
              <div className="admin-slide-card__actions">
                <Link className="button button--dark" href={`/admin/articles/${article.id}`}>แก้ไข</Link>
                <Link className="button button--dark" href={`/admin/articles/${article.id}/preview`}>พรีวิว</Link>
                <form action={changeArticleStatusAction}>
                  <input type="hidden" name="id" value={article.id} />
                  <input type="hidden" name="status" value={article.status === "published" ? "draft" : "published"} />
                  <button type="submit">{article.status === "published" ? "ปิดเผยแพร่" : "เผยแพร่"}</button>
                </form>
                <form action={changeArticleStatusAction}>
                  <input type="hidden" name="id" value={article.id} />
                  <input type="hidden" name="status" value={article.status === "archived" ? "draft" : "archived"} />
                  <button type="submit">{article.status === "archived" ? "คืนค่าร่าง" : "เก็บถาวร"}</button>
                </form>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

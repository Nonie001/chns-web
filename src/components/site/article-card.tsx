import Image from "next/image";
import Link from "next/link";
import type { PublicArticle } from "@/features/articles/types";

export function ArticleCard({ article }: { article: PublicArticle }) {
  return (
    <Link className="feature-card" href={`/news/${article.slug}`}>
      <figure className="mock-photo article-photo">
        {article.imageSrc && <Image src={article.imageSrc} alt={article.imageAlt} fill sizes="(max-width: 720px) 100vw, 33vw" unoptimized />}
      </figure>
      <div className="feature-card__body">
        <span className="pill">{article.isDemo ? "ตัวอย่าง · " : ""}{article.kind === "news" ? "ข่าว" : "บทความ"}</span>
        <h3>{article.title}</h3>
        {article.publishedAt && <small className="feature-card__meta">{new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(new Date(article.publishedAt))}</small>}
        <p>{article.summary}</p>
        <span className="feature-card__link">อ่านต่อ ↗</span>
      </div>
    </Link>
  );
}

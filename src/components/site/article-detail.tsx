import Image from "next/image";
import Link from "next/link";
import type { PublicArticle } from "@/features/articles/types";
import { ShareActions } from "./share-actions";

export function ArticleDetail({ article, preview = false }: { article: PublicArticle; preview?: boolean }) {
  const paragraphs = article.body.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
  return (
    <>
      <section className="detail-hero">
        <div className="shell detail-hero__grid">
          <div>
            <p className="eyebrow eyebrow--light">{preview ? "PREVIEW · " : ""}{article.kind === "news" ? "ข่าว" : "บทความ"}</p>
            <h1>{article.title}</h1>
            <p>{article.summary}</p>
            <Link className="text-link text-link--light" href={preview ? "/admin/articles" : "/news"}>
              {preview ? "กลับไปหลังบ้าน" : "กลับไปข่าวสาร"} <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <figure className="mock-photo article-photo">
            {article.imageSrc && <Image src={article.imageSrc} alt={article.imageAlt} fill sizes="(max-width: 720px) 100vw, 45vw" unoptimized />}
          </figure>
        </div>
      </section>
      <section className="section page-section">
        <div className="shell article-body">
          {article.publishedAt && <p className="eyebrow">เผยแพร่ {new Intl.DateTimeFormat("th-TH", { dateStyle: "long" }).format(new Date(article.publishedAt))}</p>}
          {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          {article.imageSrc && <p className="article-credit">ภาพ: {article.imageCredit}</p>}
          {!preview && <ShareActions title={article.title} />}
        </div>
      </section>
    </>
  );
}

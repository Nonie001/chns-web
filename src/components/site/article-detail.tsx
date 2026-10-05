import Image from "next/image";
import Link from "next/link";
import type { PublicArticle } from "@/features/articles/types";
import { ShareActions } from "./share-actions";
import { SiteBreadcrumbs } from "./site-breadcrumbs";

export function ArticleDetail({ article, preview = false }: { article: PublicArticle; preview?: boolean }) {
  const paragraphs = article.body.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
  return (
    <>
      {!preview && <SiteBreadcrumbs items={[{ label: "ข่าวสาร", href: "/news" }, { label: article.title }]} />}
      <section className="detail-hero">
        <div className="shell detail-hero__grid">
          <div>
            <p className="eyebrow eyebrow--light">{article.isDemo ? "ตัวอย่าง · " : ""}{preview ? "PREVIEW · " : ""}{article.kind === "news" ? "ข่าว" : "บทความ"}</p>
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
          {article.isDemo && <p className="article-demo-notice">เนื้อหานี้เป็นตัวอย่างสำหรับดูรูปแบบเว็บไซต์ ไม่ใช่ข่าวหรือเหตุการณ์จริงของ CHNS</p>}
          {article.publishedAt && <p className="eyebrow">เผยแพร่ {new Intl.DateTimeFormat("th-TH", { dateStyle: "long" }).format(new Date(article.publishedAt))}</p>}
          {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          {article.imageSrc && <p className="article-credit">ภาพ: {article.imageCredit}</p>}
          {!preview && !article.isDemo && <ShareActions title={article.title} />}
        </div>
      </section>
    </>
  );
}

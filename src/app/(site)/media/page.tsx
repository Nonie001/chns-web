import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { listPublishedArticles } from "@/features/articles/article-store";
import { listPublishedProjects } from "@/features/projects/project-store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "ภาพและวิดีโอ | CHNS",
  description: "ภาพประกอบจากข่าวและโครงการที่ CHNS อนุมัติให้เผยแพร่",
};

export default async function MediaPage() {
  const [articles, projects] = await Promise.all([listPublishedArticles(), listPublishedProjects()]);
  const images = [
    ...articles.filter((article) => article.imageSrc).map((article) => ({
      key: `article-${article.slug}`, src: article.imageSrc!, alt: article.imageAlt,
      title: article.title, credit: article.imageCredit, href: `/news/${article.slug}`, kind: "ข่าวและบทความ",
      publishedAt: article.publishedAt,
    })),
    ...projects.filter((project) => project.imageSrc).map((project) => ({
      key: `project-${project.slug}`, src: project.imageSrc!, alt: project.imageAlt,
      title: project.title, credit: project.imageCredit, href: `/projects/${project.slug}`, kind: "โครงการและภารกิจ",
      publishedAt: project.publishedAt,
    })),
  ].sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
  return (
    <>
      <PageHero
        eyebrow="PHOTO & VIDEO"
        title="ภาพและวิดีโอ"
        description="ภาพประกอบจากข่าวและโครงการที่ได้รับอนุมัติให้เผยแพร่ พร้อมแหล่งที่มา"
      />
      <section className="section page-section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">MEDIA LIBRARY</p>
              <h2 className="section-title">ภาพจากภารกิจ</h2>
            </div>
            <p>เลือกภาพเพื่ออ่านเนื้อหาต้นทางและรายละเอียดภารกิจ</p>
          </div>
          {images.length > 0 ? <div className="media-grid">
            {images.map((item) => <article className="media-card" key={item.key}>
              <Link href={item.href} aria-label={`อ่าน ${item.title}`}>
                <div className="media-card__image"><Image src={item.src} alt={item.alt} fill sizes="(max-width: 650px) 100vw, (max-width: 1000px) 50vw, 33vw" unoptimized /></div>
                <div className="media-card__body"><p className="eyebrow">{item.kind}</p><h3>{item.title}</h3><p>ภาพ: {item.credit}</p></div>
              </Link>
            </article>)}
          </div> : <p className="content-empty">ยังไม่มีภาพจากข่าวหรือโครงการที่เผยแพร่</p>}
          <div className="video-placeholder">
            <span aria-hidden="true">▷</span>
            <div>
              <h3>วิดีโอ</h3>
              <p>ยังไม่มีวิดีโอที่อนุมัติให้เผยแพร่</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArticleCard } from "@/components/site/article-card";
import { DepartmentCards } from "@/components/site/department-cards";
import { HeroCarousel } from "@/components/site/hero-carousel";
import { PartnerLogoGrid } from "@/components/site/partner-logo-grid";
import { site } from "@/content/static/site";
import { listDisplayArticles } from "@/features/articles/article-store";
import { listPublishedSlides } from "@/features/hero/slide-store";
import type { HeroCarouselItem } from "@/features/hero/types";
import { getPublicFeatureSlugs } from "@/features/homepage/feature-store";
import { listPublishedPartners } from "@/features/partners/partner-store";
import { listDisplayProjects } from "@/features/projects/project-store";
import type { PublicProject } from "@/features/projects/types";
import { listPublishedReports } from "@/features/reports/report-store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [publishedSlides, featureSlugs, articles, projects, partners, reports] = await Promise.all([
    listPublishedSlides(), getPublicFeatureSlugs(), listDisplayArticles(),
    listDisplayProjects(), listPublishedPartners(), listPublishedReports(),
  ]);
  const featuredProjects = [
    ...featureSlugs.projects.map((slug) => projects.find((project) => project.slug === slug)),
    ...projects,
  ].filter((project): project is PublicProject => Boolean(project))
    .filter((project, index, items) => items.findIndex((item) => item.slug === project.slug) === index)
    .slice(0, 10);
  const leadProject = featuredProjects[0];
  const secondaryProjects = featuredProjects.slice(1, 5);
  const rowProjects = featuredProjects.slice(5, 10);
  const featuredArticle = articles.find((article) => article.slug === featureSlugs.article) ?? articles[0];
  const latestArticles = featuredArticle ? [featuredArticle, ...articles.filter((article) => article.slug !== featuredArticle.slug)].slice(0, 6) : [];
  const latestReports = [...reports].sort((a, b) => b.year - a.year).slice(0, 3);
  const slides: HeroCarouselItem[] = publishedSlides;

  return (
    <>
      <h1 className="sr-only">{site.officialName}</h1>
      {slides.length > 0 ? (
        <HeroCarousel slides={slides} />
      ) : (
        <figure className="home-hero-still">
          <Image src="/editorial/home-relief.jpg" alt="" fill priority sizes="100vw" />
          <figcaption>ภาพจำลองเพื่อประกอบการออกแบบ</figcaption>
        </figure>
      )}
      <div className="home-introbar"><div className="shell home-introbar__inner">
        <p className="home-introbar__name">{site.officialName}</p>
        <nav className="home-introbar__links" aria-label="ลิงก์ด่วน">
          <Link href="/about">รู้จักเรา</Link>
          <Link href="/contact">ติดต่อเรา</Link>
          <Link className="home-introbar__cta" href="/participate#support">ร่วมสนับสนุน ↗</Link>
        </nav>
      </div></div>

      <section className="section home-featured" aria-labelledby="home-featured-title"><div className="shell">
        <div className="home-heading"><div><p className="eyebrow">PROJECTS & MISSIONS</p><h2 id="home-featured-title" className="section-title">โครงการและภารกิจ</h2></div><Link className="text-link" href="/projects">ดูโครงการทั้งหมด ↗</Link></div>
        {leadProject ? (
          <>
          <div className="home-featured__editorial">
            <Link className="home-lead" href={`/projects/${leadProject.slug}`}>
              <div className="home-lead__media">
                {leadProject.imageSrc && <Image src={leadProject.imageSrc} alt={leadProject.imageAlt} fill sizes="(max-width: 900px) 100vw, 56vw" unoptimized />}
              </div>
              <span className="home-lead__tag">{leadProject.category}</span>
              <div className="home-lead__overlay">
                <h3>{leadProject.title}</h3>
                {leadProject.location && <span className="home-lead__meta">{leadProject.location}</span>}
              </div>
            </Link>
            {secondaryProjects.length > 0 && (
              <div className="home-featured__grid2">
                {secondaryProjects.map((project) => (
                  <Link className="home-mini" href={`/projects/${project.slug}`} key={project.slug}>
                    <div className="home-mini__media">
                      {project.imageSrc && <Image src={project.imageSrc} alt={project.imageAlt} fill sizes="(max-width: 900px) 50vw, 22vw" unoptimized />}
                      <span className="home-mini__tag">{project.category}</span>
                    </div>
                    <strong className="home-mini__title">{project.title}</strong>
                  </Link>
                ))}
              </div>
            )}
          </div>
          {rowProjects.length > 0 && (
            <div className="home-featured__row">
              {rowProjects.map((project) => (
                <Link className="home-mini home-mini--sm" href={`/projects/${project.slug}`} key={project.slug}>
                  <div className="home-mini__media">
                    {project.imageSrc && <Image src={project.imageSrc} alt={project.imageAlt} fill sizes="(max-width: 600px) 50vw, 18vw" unoptimized />}
                    <span className="home-mini__tag">{project.category}</span>
                  </div>
                  <strong className="home-mini__title">{project.title}</strong>
                </Link>
              ))}
            </div>
          )}
          </>
        ) : <div className="editorial-empty"><p>โครงการที่ผ่านการอนุมัติจะปรากฏที่นี่</p><Link href="/departments">รู้จักฝ่ายงาน ↗</Link></div>}
      </div></section>

      <section className="section home-process" aria-labelledby="home-process-title">
        <div className="shell home-process__layout">
          <div className="home-process__intro"><p className="eyebrow">HOW WE WORK</p><h2 id="home-process-title" className="section-title">จากการประสานงาน<br /><span>สู่การลงมือร่วมกัน</span></h2><p>งานด้านมนุษยธรรมต้องอาศัยหลายฝ่าย CHNS จึงเชื่อมบทบาทของหน่วยงานและเครือข่ายให้ทำงานไปในทิศทางเดียวกัน</p><Link className="text-link" href="/about">รู้จักการทำงานของเรา ↗</Link></div>
          <figure className="home-process__image"><Image src="/editorial/home-packing.jpg" alt="" fill sizes="(max-width: 800px) 100vw, 48vw" /><figcaption>ภาพจำลองเพื่อประกอบการออกแบบ</figcaption></figure>
        </div>
      </section>

      <section className="home-departments" aria-labelledby="home-departments-title"><div className="shell">
        <div className="home-departments__intro"><div><p className="eyebrow eyebrow--light">OUR WORK</p><h2 id="home-departments-title">หลายบทบาท<br /><span>หนึ่งเป้าหมายร่วมกัน</span></h2></div><div className="home-departments__intro-aside"><p>สำรวจฝ่ายงานตามโครงสร้างของสภาเครือข่ายช่วยเหลือด้านมนุษยธรรม</p><Link className="home-departments__all" href="/departments">ดูงานของเราทั้งหมด ↗</Link></div></div>
        <DepartmentCards />
      </div></section>

      <section className="section home-stories" aria-labelledby="home-stories-title"><div className="shell">
        <div className="home-heading"><div><p className="eyebrow">NEWS & STORIES</p><h2 id="home-stories-title" className="section-title">ข่าวและเรื่องเล่าล่าสุด</h2></div><Link className="text-link" href="/news">ข่าวสารทั้งหมด ↗</Link></div>
        {latestArticles.length > 0 ? <div className="home-stories__grid">{latestArticles.map((article) => <ArticleCard article={article} key={article.slug} />)}</div> : <div className="editorial-empty"><p>ข่าวและบทความที่ผ่านการอนุมัติจะปรากฏที่นี่</p><Link href="/about">รู้จัก CHNS ↗</Link></div>}
      </div></section>

      {latestReports.length > 0 && <section className="section home-accountability" aria-labelledby="home-accountability-title"><div className="shell home-accountability__layout">
        <div><p className="eyebrow">ACCOUNTABILITY</p><h2 id="home-accountability-title" className="section-title">งานที่ทำ<br /><span>ต้องติดตามได้</span></h2></div>
        <div className="home-accountability__content"><p>พื้นที่สำหรับติดตามโครงการ ข่าว และรายงานที่ผ่านการตรวจและเผยแพร่ เพื่อให้เห็นที่มา ความคืบหน้า และผลของงาน</p>
          {latestReports.map((report) => <Link className="home-accountability__report" href={`/reports/${report.slug}`} key={report.slug}><span>รายงานเผยแพร่ · {report.year}</span><strong>{report.title}</strong><span aria-hidden="true">↗</span></Link>)}
          <Link className="text-link" href="/reports">ดูรายงานและเอกสาร ↗</Link>
        </div>
      </div></section>}

      <section className="section home-network" id="network" aria-labelledby="home-network-title"><div className="shell">
        <div className="home-heading"><div><p className="eyebrow">PARTNER NETWORK</p><h2 id="home-network-title" className="section-title">องค์กรสมาชิกและภาคีเครือข่าย</h2></div>{partners.length > 0 && <p className="home-network__count">{partners.length} องค์กรที่เผยแพร่แล้ว</p>}</div>
        {partners.length > 0 ? <PartnerLogoGrid partners={partners} /> : <p className="content-empty">ยังไม่มีโลโก้ภาคีที่เผยแพร่</p>}
      </div></section>

      <section className="home-join" aria-labelledby="home-join-title"><div className="shell home-join__layout">
        <div className="home-join__intro"><p className="eyebrow">ร่วมกับ CHNS</p><h2 id="home-join-title">ร่วมเป็นส่วนหนึ่ง<br />ของความช่วยเหลือ</h2></div>
        <div className="home-join__content"><p>เลือกวิธีมีส่วนร่วมที่เหมาะกับคุณ ทั้งการสนับสนุนงานและการเข้าร่วมเครือข่ายองค์กร</p>
          <div className="home-join__options">
            <Link className="home-join__option home-join__option--primary" href="/participate#support"><span>สำหรับผู้สนับสนุน</span><strong>ร่วมสนับสนุนภารกิจ</strong><span className="home-join__option-arrow" aria-hidden="true">↗</span></Link>
            <Link className="home-join__option" href="/participate#membership"><span>สำหรับองค์กร</span><strong>เข้าร่วมเครือข่าย</strong><span className="home-join__option-arrow" aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </div></section>
    </>
  );
}

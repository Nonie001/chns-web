import type { Metadata } from "next";
import Link from "next/link";
import { SiteBreadcrumbs } from "@/components/site/site-breadcrumbs";
import { ProjectCard } from "@/components/site/project-card";
import { listPublishedProjects } from "@/features/projects/project-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ร่วมสนับสนุน | CHNS",
  description:
    "เรียนรู้แนวทางการมีส่วนร่วมกับสภาเครือข่ายช่วยเหลือด้านมนุษยธรรม",
};

export default async function ParticipatePage() {
  const projects = (await listPublishedProjects()).slice(0, 6);
  return (
    <>
      <SiteBreadcrumbs items={[{ label: "ร่วมสนับสนุน" }]} />
      <section className="inner-hero">
        <div className="shell inner-hero__grid">
          <div>
            <p className="eyebrow eyebrow--light">GET INVOLVED</p>
            <h1>ร่วมสนับสนุน</h1>
          </div>
          <p>
            การมีส่วนร่วมที่ดีเริ่มจากการรู้จักภารกิจและใช้ช่องทางที่องค์กรรับรอง
          </p>
        </div>
      </section>
      <section className="section participate-section">
        <div className="shell participate-section__grid">
          <div>
            <p className="eyebrow">PARTICIPATE WITH CARE</p>
            <h2 className="section-title">
              รู้จักงาน
              <br />
              <span>ก่อนร่วมสนับสนุน</span>
            </h2>
          </div>
          <div className="participate-panel">
            <h3>ช่องทางสนับสนุนผ่านเว็บไซต์</h3>
            <p>
              ขณะนี้เว็บไซต์ยังไม่เปิดรับชำระเงินหรือรับหลักฐานการโอน
              ช่องทางสนับสนุนอย่างเป็นทางการจะปรากฏเมื่อ CHNS ยืนยันข้อมูลบัญชี
              ขั้นตอนตรวจยอด และการออกใบเสร็จแล้ว
            </p>
            <Link className="button button--dark" href="/departments">
              สำรวจงานของเรา <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
      <section className="section home-featured" aria-labelledby="participate-projects-title"><div className="shell">
        <div className="home-heading"><div><p className="eyebrow">PUBLISHED PROJECTS</p><h2 className="section-title" id="participate-projects-title">สำรวจโครงการก่อนร่วมสนับสนุน</h2></div><Link className="text-link" href="/projects">ดูโครงการทั้งหมด ↗</Link></div>
        {projects.length > 0 ? <div className="home-featured__grid">{projects.map((project) => <ProjectCard key={project.slug} project={project} />)}</div> : <p className="content-empty">ยังไม่มีโครงการที่ผ่านการอนุมัติให้เผยแพร่</p>}
      </div></section>
      <section className="section related-section">
        <div className="shell">
          <p className="eyebrow">WAYS TO TAKE PART</p>
          <h2 className="section-title">ช่องทางการมีส่วนร่วม</h2>
          <div className="simple-card-grid">
            <Link className="simple-card" href="/participate/donate">
              <span>01 / SUPPORT</span>
              <h3>สนับสนุนภารกิจ</h3>
              <p>ดูขั้นตอนและเงื่อนไขก่อนเปิดช่องทางรับเงินอย่างเป็นทางการ</p>
              <b aria-hidden="true">↗</b>
            </Link>
            <Link className="simple-card" href="/participate/membership">
              <span>02 / MEMBERSHIP</span>
              <h3>เข้าร่วมเป็นองค์กรสมาชิก</h3>
              <p>
                ดูขั้นตอนการสมัครและข้อมูลที่จะต้องเตรียมเมื่อระบบพร้อมเปิดรับ
              </p>
              <b aria-hidden="true">↗</b>
            </Link>
            <Link className="simple-card" href="/contact">
              <span>03 / CONTACT</span>
              <h3>ติดต่อประสานงาน</h3>
              <p>ติดตามช่องทางติดต่อกลางที่องค์กรรับรอง</p>
              <b aria-hidden="true">↗</b>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

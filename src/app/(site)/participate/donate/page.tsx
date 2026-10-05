import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MockNotice } from "@/components/site/mock-notice";
import { PageHero } from "@/components/site/page-hero";
import { ProjectCard } from "@/components/site/project-card";
import { listPublishedProjects } from "@/features/projects/project-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ช่องทางร่วมสนับสนุน | CHNS",
  description: "โครงหน้าช่องทางร่วมสนับสนุนโครงการ CHNS",
};

export default async function DonatePage() {
  const projects = (await listPublishedProjects()).slice(0, 6);
  return (
    <>
      <PageHero
        eyebrow="SUPPORT THE WORK"
        title="ช่องทางร่วมสนับสนุน"
        description="เส้นทางสนับสนุนโครงการจะเปิดเมื่อข้อมูลโครงการและวิธีรับเงินผ่านการตรวจจากองค์กร"
        parent={{ label: "ร่วมสนับสนุน", href: "/participate" }}
      />
      <section className="section page-section">
        <div className="shell detail-grid">
          <div>
            <MockNotice>
              หน้านี้ยังไม่รับเงินและไม่มีบัญชีหรือ QR สำหรับโอน
            </MockNotice>
            <p className="eyebrow">HOW IT WILL WORK</p>
            <h2 className="section-title">สนับสนุนอย่างมั่นใจ</h2>
            <ol className="step-list">
              <li>
                <strong>เลือกโครงการ</strong>
                <span>อ่านวัตถุประสงค์ พื้นที่ และฝ่ายรับผิดชอบ</span>
              </li>
              <li>
                <strong>ตรวจช่องทาง</strong>
                <span>ใช้ช่องทางที่ CHNS แสดงและรับรองบนเว็บไซต์</span>
              </li>
              <li>
                <strong>ติดตามผล</strong>
                <span>ดูความคืบหน้าและหลักฐานที่เผยแพร่ได้</span>
              </li>
            </ol>
            <Link className="button button--dark" href="/projects">
              ดูโครงการ <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <Image className="editorial-photo" src="/editorial/participation.webp" width={960} height={640} alt="" />
        </div>
      </section>
      <section className="section related-section" aria-labelledby="support-projects-title"><div className="shell">
        <div className="home-heading"><div><p className="eyebrow">PROJECTS</p><h2 className="section-title" id="support-projects-title">โครงการที่เผยแพร่แล้ว</h2></div><Link className="text-link" href="/projects">ดูทั้งหมด ↗</Link></div>
        {projects.length > 0 ? <div className="home-featured__grid">{projects.map((project) => <ProjectCard key={project.slug} project={project} />)}</div> : <p className="content-empty">ยังไม่มีโครงการที่ผ่านการอนุมัติให้เผยแพร่</p>}
      </div></section>
    </>
  );
}

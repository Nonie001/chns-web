import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MockNotice } from "@/components/site/mock-notice";
import { ProjectCard } from "@/components/site/project-card";
import { organizationContact } from "@/content/static/organization";
import { listPublishedProjects } from "@/features/projects/project-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ร่วมกับเรา | CHNS",
  description: "แนวทางร่วมสนับสนุนภารกิจและเข้าร่วมเป็นองค์กรสมาชิก CHNS",
};

export default async function ParticipatePage() {
  const projects = (await listPublishedProjects()).slice(0, 6);

  return (
    <>
      <section className="inner-hero">
        <div className="shell inner-hero__grid">
          <div>
            <p className="eyebrow eyebrow--light">GET INVOLVED</p>
            <h1>ร่วมกับเรา</h1>
          </div>
          <p>รู้จักภารกิจ แนวทางสนับสนุน และการเข้าร่วมเครือข่ายองค์กร</p>
        </div>
      </section>

      <nav className="section-contents shell" aria-label="หัวข้อในหน้าร่วมกับเรา">
        <span>สำรวจเนื้อหา</span>
        <div>
          <a href="#support">ร่วมสนับสนุน</a>
          <a href="#projects">โครงการ</a>
          <a href="#membership">สมัครสมาชิกองค์กร</a>
        </div>
      </nav>

      <section className="section participate-section" id="support" aria-labelledby="support-title">
        <div className="shell participate-section__grid">
          <div>
            <p className="eyebrow">SUPPORT THE WORK</p>
            <h2 className="section-title" id="support-title">ร่วมสนับสนุน<br /><span>อย่างมั่นใจ</span></h2>
            <p className="large-copy">การมีส่วนร่วมเริ่มจากการรู้จักภารกิจและใช้ช่องทางที่องค์กรรับรอง</p>
          </div>
          <div className="participate-panel">
            <h3>สถานะช่องทางสนับสนุน</h3>
            <p>ขณะนี้เว็บไซต์ยังไม่เปิดรับชำระเงินหรือรับหลักฐานการโอน และไม่มีบัญชีหรือ QR สำหรับโอน ช่องทางอย่างเป็นทางการจะปรากฏเมื่อ CHNS ยืนยันข้อมูลบัญชี ขั้นตอนตรวจยอด และการออกใบเสร็จแล้ว</p>
          </div>
        </div>
      </section>

      <section className="section page-section participate-detail" aria-labelledby="support-steps-title">
        <div className="shell detail-grid">
          <div>
            <p className="eyebrow">HOW IT WILL WORK</p>
            <h2 className="section-title" id="support-steps-title">แนวทางสนับสนุนภารกิจ</h2>
            <ol className="step-list">
              <li><strong>เลือกโครงการ</strong><span>อ่านวัตถุประสงค์ พื้นที่ และฝ่ายรับผิดชอบ</span></li>
              <li><strong>ตรวจช่องทาง</strong><span>ใช้ช่องทางที่ CHNS แสดงและรับรองบนเว็บไซต์เมื่อเปิดให้บริการ</span></li>
              <li><strong>ติดตามผล</strong><span>ดูความคืบหน้าและหลักฐานที่เผยแพร่ได้</span></li>
            </ol>
            <Link className="button button--dark" href="/departments">สำรวจงานของเรา <span aria-hidden="true">↗</span></Link>
          </div>
          <Image className="editorial-photo" src="/editorial/participation.webp" width={960} height={640} alt="" />
        </div>
      </section>

      <section className="section home-featured" id="projects" aria-labelledby="participate-projects-title">
        <div className="shell">
          <div className="home-heading"><div><p className="eyebrow">PUBLISHED PROJECTS</p><h2 className="section-title" id="participate-projects-title">สำรวจโครงการก่อนร่วมสนับสนุน</h2></div><Link className="text-link" href="/projects">ดูโครงการทั้งหมด ↗</Link></div>
          {projects.length > 0 ? <div className="home-featured__grid">{projects.map((project) => <ProjectCard key={project.slug} project={project} />)}</div> : <p className="content-empty">ยังไม่มีโครงการที่ผ่านการอนุมัติให้เผยแพร่</p>}
        </div>
      </section>

      <section className="section page-section participate-membership" id="membership" aria-labelledby="membership-title">
        <div className="shell">
          <div className="section-heading">
            <div><p className="eyebrow">JOIN THE NETWORK</p><h2 className="section-title" id="membership-title">เข้าร่วมเป็น<br /><span>องค์กรสมาชิก</span></h2></div>
            <p>เส้นทางสำหรับองค์กรที่สนใจเข้าร่วมเครือข่ายช่วยเหลือด้านมนุษยธรรม</p>
          </div>
          <MockNotice>ยังไม่เปิดรับสมัครผ่านเว็บไซต์ เพราะประเภทสมาชิก เอกสารที่ต้องใช้ ผู้รับเรื่อง และนโยบายข้อมูลส่วนบุคคลยังต้องยืนยัน</MockNotice>
          <p className="participate-membership__intro">เมื่อเปิดรับสมัคร แบบฟอร์มจะมีเลขอ้างอิงและช่องทางติดตามผล เอกสารแนบจะเก็บในพื้นที่ที่เข้าถึงได้เฉพาะผู้รับผิดชอบ</p>
          <div className="three-step-grid">
            <article><span>01</span><h3>อ่านเกณฑ์</h3><p>ทำความเข้าใจประเภทสมาชิกและคุณสมบัติที่องค์กรเปิดรับ</p></article>
            <article><span>02</span><h3>เตรียมข้อมูล</h3><p>กรอกข้อมูลติดต่อและแนบเอกสารเท่าที่จำเป็น</p></article>
            <article><span>03</span><h3>รับการยืนยัน</h3><p>รับเลขอ้างอิงและช่องทางติดตามสถานะ</p></article>
          </div>
          <div className="page-actions">
            <a className="button button--dark" href={`mailto:${organizationContact.email}?subject=${encodeURIComponent("สอบถามการสมัครสมาชิกองค์กร CHNS")}`}>สอบถามการสมัครสมาชิก <span aria-hidden="true">↗</span></a>
            <Link className="text-link" href="/#network">ดูองค์กรสมาชิก <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>
    </>
  );
}

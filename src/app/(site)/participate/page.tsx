import { editorialImage } from "@/content/static/editorial-images";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { MockNotice } from "@/components/site/mock-notice";
import { ProjectCard } from "@/components/site/project-card";
import { organizationContact } from "@/content/static/organization";
import { DonationAccounts } from "@/features/participation/donation-accounts";
import { listPublishedProjects } from "@/features/projects/project-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ร่วมกับเรา | CHNS",
  description: "ช่องทางบริจาคและเลขบัญชีสำหรับสนับสนุนภารกิจ CHNS พร้อมข้อมูลการเข้าร่วมเป็นองค์กรสมาชิก",
};

export default async function ParticipatePage() {
  const projects = (await listPublishedProjects()).slice(0, 6);

  return (
    <>
      <section className="inner-hero" style={{ "--hero-image": `url(${editorialImage("page-participate.webp")})` } as CSSProperties}>
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
          <a href="#support">ช่องทางบริจาค</a>
          <a href="#projects">โครงการ</a>
          <a href="#membership">สมัครสมาชิกองค์กร</a>
        </div>
      </nav>

      <section className="section participate-section" id="support" aria-labelledby="support-title">
        <div className="shell">
          <div className="participate-section__heading">
            <div>
              <p className="eyebrow">MAKE AN IMPACT</p>
              <h2 className="section-title" id="support-title">ช่องทาง<span>บริจาค</span></h2>
            </div>
            <p>เลือกวัตถุประสงค์ที่ต้องการสนับสนุน แล้วกดคัดลอกเลขบัญชีเพื่อใช้ในแอปธนาคาร</p>
          </div>
          <DonationAccounts />
        </div>
      </section>

      <section className="section page-section participate-detail" aria-labelledby="support-steps-title">
        <div className="shell detail-grid">
          <div>
            <p className="eyebrow">DONATE WITH CARE</p>
            <h2 className="section-title" id="support-steps-title">บริจาคได้ใน 3 ขั้นตอน</h2>
            <ol className="step-list">
              <li><strong>เลือกวัตถุประสงค์</strong><span>ดูรายการบัญชีให้ตรงกับภารกิจที่ต้องการสนับสนุน</span></li>
              <li><strong>คัดลอกเลขบัญชี</strong><span>แตะปุ่มคัดลอกบนรายการที่เลือก แล้วนำไปวางในแอปธนาคาร</span></li>
              <li><strong>ตรวจชื่อผู้รับ</strong><span>ตรวจสอบชื่อบัญชีก่อนยืนยันการโอนทุกครั้ง</span></li>
            </ol>
            <Link className="button button--dark" href="/projects">สำรวจงานของเรา <span aria-hidden="true">↗</span></Link>
          </div>
          <Image className="editorial-photo" src={editorialImage("about-main.webp")} width={1400} height={934} alt="ทีมงานส่งมอบสิ่งของช่วยเหลือ" />
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
            <Link className="text-link" href="/centers#members">ดูองค์กรสมาชิก <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>
    </>
  );
}

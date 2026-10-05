import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/static/site";
import { organizationDirection } from "@/content/static/organization";
import { SiteBreadcrumbs } from "@/components/site/site-breadcrumbs";

export const metadata: Metadata = {
  title: "เกี่ยวกับเรา | CHNS",
  description: "รู้จักสภาเครือข่ายช่วยเหลือด้านมนุษยธรรม สำนักจุฬาราชมนตรี",
};

export default function AboutPage() {
  return (
    <>
      <SiteBreadcrumbs items={[{ label: "เกี่ยวกับเรา" }]} />
      <section className="inner-hero">
        <div className="shell inner-hero__grid">
          <div>
            <p className="eyebrow eyebrow--light">ABOUT CHNS</p>
            <h1>เกี่ยวกับเรา</h1>
          </div>
          <p>{site.officialName}</p>
        </div>
      </section>
      <section className="section story-section">
        <div className="shell story-section__grid">
          <p className="eyebrow">WHO WE ARE</p>
          <div>
            <h2 className="section-title">
              พลังของเครือข่าย
              <br />
              <span>เพื่อมนุษยธรรม</span>
            </h2>
            <p>
              CHNS เป็นสภาเครือข่ายด้านมนุษยธรรมในสำนักจุฬาราชมนตรี
              มีฝ่ายงานและองค์กรเครือข่ายที่ร่วมกันประสานภารกิจช่วยเหลือผู้ประสบความเดือดร้อนทั้งในและต่างประเทศ
            </p>
            <p>
              เว็บไซต์นี้จะรวบรวมบทบาทของฝ่ายงาน โครงการ ข่าว
              และรายงานไว้ในโครงสร้างเดียวกัน
              เพื่อให้ติดตามการทำงานได้ชัดเจนขึ้น
            </p>
            <blockquote className="organization-vision">{organizationDirection.vision}</blockquote>
            <Link className="button button--dark" href="/departments">
              ดูฝ่ายงาน <span aria-hidden="true">↗</span>
            </Link>
            <Link
              className="text-link about-structure-link"
              href="/about/structure"
            >
              ดูโครงสร้างบริหาร <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
      <section className="section value-section">
        <div className="shell value-section__grid">
          <div>
            <span>01</span>
            <h3>ความร่วมมือ</h3>
            <p>เชื่อมฝ่ายงานและองค์กรเครือข่ายเพื่อประสานภารกิจ</p>
          </div>
          <div>
            <span>02</span>
            <h3>ความรับผิดชอบ</h3>
            <p>ให้ความสำคัญกับข้อมูลที่ตรวจสอบและสิทธิ์ของผู้เกี่ยวข้อง</p>
          </div>
          <div>
            <span>03</span>
            <h3>การสื่อสาร</h3>
            <p>ทำให้ผู้สนใจเข้าถึงข้อมูลภารกิจและช่องทางมีส่วนร่วม</p>
          </div>
        </div>
      </section>
      <section className="section related-section">
        <div className="shell">
          <p className="eyebrow">MORE ABOUT CHNS</p>
          <h2 className="section-title">ทำความรู้จักเพิ่มเติม</h2>
          <div className="simple-card-grid">
            <Link className="simple-card" href="/about/history">
              <span>01 / HISTORY</span>
              <h3>ประวัติองค์กร</h3>
              <p>แม่แบบสำหรับเล่าความเป็นมาพร้อมหลักฐานอ้างอิง</p>
              <b aria-hidden="true">↗</b>
            </Link>
            <Link className="simple-card" href="/about/direction">
              <span>02 / DIRECTION</span>
              <h3>ทิศทางและยุทธศาสตร์</h3>
              <p>วิสัยทัศน์ พันธกิจ วัตถุประสงค์ และแผนที่อนุมัติแล้ว</p>
              <b aria-hidden="true">↗</b>
            </Link>
            <Link className="simple-card" href="/about/structure">
              <span>03 / STRUCTURE</span>
              <h3>โครงสร้างบริหาร</h3>
              <p>ภาพรวมฝ่ายงานและเครือข่ายในผังเดียว</p>
              <b aria-hidden="true">↗</b>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

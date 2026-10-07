import type { Metadata } from "next";
import Link from "next/link";
import { MockNotice } from "@/components/site/mock-notice";
import { organizationDirection, organizationHistory } from "@/content/static/organization";
import { departments, site } from "@/content/static/site";

export const metadata: Metadata = {
  title: "เกี่ยวกับเรา | CHNS",
  description: "ประวัติ วิสัยทัศน์ พันธกิจ วัตถุประสงค์ และโครงสร้างบริหารของสภาเครือข่ายช่วยเหลือด้านมนุษยธรรม",
};

const sections = [
  { label: "ประวัติองค์กร", href: "#history" },
  { label: "วิสัยทัศน์", href: "#vision" },
  { label: "พันธกิจ", href: "#mission" },
  { label: "วัตถุประสงค์", href: "#objectives" },
  { label: "ยุทธศาสตร์", href: "#strategy" },
  { label: "โครงสร้างบริหาร", href: "#structure" },
] as const;

export default function AboutPage() {
  return (
    <>
      <section className="inner-hero">
        <div className="shell inner-hero__grid">
          <div>
            <p className="eyebrow eyebrow--light">ABOUT CHNS</p>
            <h1>เกี่ยวกับเรา</h1>
          </div>
          <p>{site.officialName}</p>
        </div>
      </section>

      <nav className="section-contents shell" aria-label="หัวข้อในหน้าเกี่ยวกับเรา">
        <span>สำรวจเนื้อหา</span>
        <div>{sections.map((section) => <a href={section.href} key={section.href}>{section.label}</a>)}</div>
      </nav>

      <section className="section story-section" aria-labelledby="about-intro-title">
        <div className="shell story-section__grid">
          <p className="eyebrow">WHO WE ARE</p>
          <div>
            <h2 className="section-title" id="about-intro-title">พลังของเครือข่าย<br /><span>เพื่อมนุษยธรรม</span></h2>
            <p>CHNS เป็นสภาเครือข่ายด้านมนุษยธรรมในสำนักจุฬาราชมนตรี มีฝ่ายงานและองค์กรเครือข่ายที่ร่วมกันประสานภารกิจช่วยเหลือผู้ประสบความเดือดร้อนทั้งในและต่างประเทศ</p>
            <p>เว็บไซต์นี้รวบรวมบทบาทของฝ่ายงาน โครงการ ข่าว และรายงานไว้ในโครงสร้างเดียวกัน เพื่อให้ติดตามการทำงานได้ชัดเจนขึ้น</p>
          </div>
        </div>
      </section>

      <section className="section value-section" aria-label="แนวทางการทำงาน">
        <div className="shell value-section__grid">
          <div><span>01</span><h3>ความร่วมมือ</h3><p>เชื่อมฝ่ายงานและองค์กรเครือข่ายเพื่อประสานภารกิจ</p></div>
          <div><span>02</span><h3>ความรับผิดชอบ</h3><p>ให้ความสำคัญกับข้อมูลที่ตรวจสอบและสิทธิ์ของผู้เกี่ยวข้อง</p></div>
          <div><span>03</span><h3>การสื่อสาร</h3><p>ทำให้ผู้สนใจเข้าถึงข้อมูลภารกิจและช่องทางมีส่วนร่วม</p></div>
        </div>
      </section>

      <section className="section page-section about-section" id="history" aria-labelledby="history-title">
        <div className="shell policy-page">
          <p className="eyebrow">OUR BEGINNING</p>
          <h2 className="section-title" id="history-title">ประวัติองค์กร</h2>
          <p className="large-copy">สภาเครือข่ายช่วยเหลือด้านมนุษยธรรมเกิดจากความร่วมมือขององค์กรที่มุ่งช่วยเหลือผู้ประสบภัยทั้งในและต่างประเทศ โดยไม่เลือกสัญชาติหรือศาสนา</p>
          <ol className="organization-timeline">{organizationHistory.map((event) => <li key={event.date}><span>{event.date}</span><div><h3>{event.title}</h3><p>{event.body}</p></div></li>)}</ol>
        </div>
      </section>

      <section className="section page-section about-section about-section--tint" aria-labelledby="direction-title">
        <div className="shell">
          <p className="eyebrow">OUR DIRECTION</p>
          <h2 className="section-title" id="direction-title">ทิศทางและยุทธศาสตร์</h2>
          <div className="organization-direction">
            <section id="vision"><p className="eyebrow">01 / VISION</p><h3>วิสัยทัศน์</h3><p className="large-copy">{organizationDirection.vision}</p></section>
            <section id="mission"><p className="eyebrow">02 / MISSION</p><h3>พันธกิจ</h3><ul>{organizationDirection.missions.map((item) => <li key={item}>{item}</li>)}</ul></section>
            <section id="objectives"><p className="eyebrow">03 / OBJECTIVES</p><h3>วัตถุประสงค์</h3><ul>{organizationDirection.objectives.map((item) => <li key={item}>{item}</li>)}</ul></section>
            <section id="strategy"><p className="eyebrow">04 / STRATEGY</p><h3>กรอบยุทธศาสตร์ 6 ด้าน</h3><ol>{organizationDirection.strategies.map((item) => <li key={item}>{item}</li>)}</ol></section>
          </div>
        </div>
      </section>

      <section className="section page-section about-section" id="structure" aria-labelledby="structure-title">
        <div className="shell">
          <p className="eyebrow">ORGANIZATION</p>
          <h2 className="section-title" id="structure-title">โครงสร้างบริหาร</h2>
          <p className="large-copy">ภาพรวมความสัมพันธ์ของฝ่ายงานและเครือข่ายตามผังองค์กร 2569–2573</p>
          <MockNotice>ผังหน้านี้แสดงระดับโครงสร้างเท่านั้น รายชื่อคณะกรรมการและตำแหน่งจะเพิ่มเมื่อได้รับข้อมูลที่อนุมัติ</MockNotice>
          <div className="structure-chart">
            <div className="structure-chart__top">สภาเครือข่ายช่วยเหลือด้านมนุษยธรรม</div>
            <div className="structure-chart__mid">คณะกรรมการบริหาร · ประธาน · เลขาธิการ</div>
            <div className="structure-chart__branch">ฝ่ายงาน 8 ฝ่าย</div>
            <div className="structure-chart__grid">{departments.map((department) => <Link href={`/departments/${department.slug}`} key={department.slug}>{department.name}<span aria-hidden="true">↗</span></Link>)}</div>
            <div className="structure-chart__bottom">ศูนย์ประสานงานระดับภูมิภาค · ศูนย์ประสานงานระดับจังหวัด · องค์กรสมาชิก</div>
          </div>
          <div className="page-actions"><Link className="button button--dark" href="/centers">ดูเครือข่ายพื้นที่ <span aria-hidden="true">↗</span></Link></div>
        </div>
      </section>
    </>
  );
}

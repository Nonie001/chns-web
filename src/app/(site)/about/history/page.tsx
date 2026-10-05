import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { organizationHistory } from "@/content/static/organization";

export const metadata: Metadata = {
  title: "ประวัติองค์กร | CHNS",
  description: "จุดเริ่มต้นและการจัดตั้งสภาเครือข่ายช่วยเหลือด้านมนุษยธรรม",
};

export default function HistoryPage() {
  return (
    <>
      <PageHero
        eyebrow="OUR HISTORY"
        title="ประวัติองค์กร"
        description="จากการรวมตัวขององค์กรเครือข่าย สู่การจัดตั้งสภาเครือข่ายช่วยเหลือด้านมนุษยธรรม"
        parent={{ label: "เกี่ยวกับเรา", href: "/about" }}
      />
      <section className="section page-section">
        <div className="shell policy-page">
          <p className="eyebrow">OUR BEGINNING</p>
          <h2 className="section-title">จุดเริ่มต้นของเครือข่าย</h2>
          <p className="large-copy">
            สภาเครือข่ายช่วยเหลือด้านมนุษยธรรมเกิดจากความร่วมมือขององค์กรที่มุ่งช่วยเหลือผู้ประสบภัยทั้งในและต่างประเทศ โดยไม่เลือกสัญชาติหรือศาสนา
          </p>
          <ol className="organization-timeline">{organizationHistory.map((event) => <li key={event.date}>
            <span>{event.date}</span><div><h3>{event.title}</h3><p>{event.body}</p></div>
          </li>)}</ol>
          <div className="page-actions">
            <Link className="button button--dark" href="/about/structure">
              ดูโครงสร้างบริหาร <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { organizationDirection } from "@/content/static/organization";

export const metadata: Metadata = {
  title: "ทิศทางและยุทธศาสตร์ | CHNS",
  description: "วิสัยทัศน์ พันธกิจ วัตถุประสงค์ และกรอบยุทธศาสตร์ของ CHNS",
};

export default function DirectionPage() {
  return (
    <>
      <PageHero
        eyebrow="OUR DIRECTION"
        title="ทิศทางและยุทธศาสตร์"
        description="วิสัยทัศน์ พันธกิจ วัตถุประสงค์ และกรอบยุทธศาสตร์ขององค์กร"
        parent={{ label: "เกี่ยวกับเรา", href: "/about" }}
      />
      <section className="section page-section">
        <div className="shell">
          <div className="organization-direction">
            <section id="vision"><p className="eyebrow">01 / VISION</p><h2>วิสัยทัศน์</h2><p className="large-copy">{organizationDirection.vision}</p></section>
            <section id="mission"><p className="eyebrow">02 / MISSION</p><h2>พันธกิจ</h2><ul>{organizationDirection.missions.map((item) => <li key={item}>{item}</li>)}</ul></section>
            <section id="objectives"><p className="eyebrow">03 / OBJECTIVES</p><h2>วัตถุประสงค์</h2><ul>{organizationDirection.objectives.map((item) => <li key={item}>{item}</li>)}</ul></section>
            <section id="strategy"><p className="eyebrow">04 / STRATEGY</p><h2>กรอบยุทธศาสตร์ 6 ด้าน</h2><ol>{organizationDirection.strategies.map((item) => <li key={item}>{item}</li>)}</ol></section>
          </div>
          <div className="page-actions">
            <Link className="button button--dark" href="/departments">
              ดูฝ่ายงาน <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

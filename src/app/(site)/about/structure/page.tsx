import type { Metadata } from "next";
import Link from "next/link";
import { MockNotice } from "@/components/site/mock-notice";
import { PageHero } from "@/components/site/page-hero";
import { departments } from "@/content/static/site";

export const metadata: Metadata = {
  title: "โครงสร้างบริหาร | CHNS",
  description: "ภาพรวมโครงสร้างบริหารและฝ่ายงานของ CHNS",
};

export default function StructurePage() {
  return (
    <>
      <PageHero
        eyebrow="ORGANIZATION"
        title="โครงสร้างบริหาร"
        description="ภาพรวมความสัมพันธ์ของฝ่ายงานและเครือข่ายตามผังองค์กร 2569–2573"
        parent={{ label: "เกี่ยวกับเรา", href: "/about" }}
      />
      <section className="section page-section">
        <div className="shell">
          <MockNotice>
            ผังหน้านี้แสดงระดับโครงสร้างเท่านั้น
            รายชื่อคณะกรรมการและตำแหน่งจะเพิ่มเมื่อได้รับข้อมูลที่อนุมัติ
          </MockNotice>
          <div className="structure-chart">
            <div className="structure-chart__top">
              สภาเครือข่ายช่วยเหลือด้านมนุษยธรรม
            </div>
            <div className="structure-chart__mid">
              คณะกรรมการบริหาร · ประธาน · เลขาธิการ
            </div>
            <div className="structure-chart__branch">ฝ่ายงาน 8 ฝ่าย</div>
            <div className="structure-chart__grid">
              {departments.map((department) => (
                <Link
                  href={`/departments/${department.slug}`}
                  key={department.slug}
                >
                  {department.name}
                  <span aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
            <div className="structure-chart__bottom">
              ศูนย์ประสานงานระดับภูมิภาค · ศูนย์ประสานงานระดับจังหวัด ·
              องค์กรสมาชิก
            </div>
          </div>
          <div className="page-actions">
            <Link className="button button--dark" href="/centers">
              ดูเครือข่ายพื้นที่ <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

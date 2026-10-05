import type { Metadata } from "next";
import Link from "next/link";
import { departments } from "@/content/static/site";
import { departmentProfiles } from "@/content/static/organization";
import { SiteBreadcrumbs } from "@/components/site/site-breadcrumbs";

export const metadata: Metadata = {
  title: "งานของเรา | CHNS",
  description: "ฝ่ายงานทั้ง 8 ฝ่ายของสภาเครือข่ายช่วยเหลือด้านมนุษยธรรม",
};

export default function DepartmentsPage() {
  return (
    <>
      <SiteBreadcrumbs items={[{ label: "งานของเรา" }]} />
      <section className="inner-hero">
        <div className="shell inner-hero__grid">
          <div>
            <p className="eyebrow eyebrow--light">OUR WORK</p>
            <h1>งานของเรา</h1>
          </div>
          <p>ฝ่ายงานตามโครงสร้างของสภาเครือข่ายช่วยเหลือด้านมนุษยธรรม</p>
        </div>
      </section>
      <section className="section department-list-section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">EIGHT DEPARTMENTS</p>
              <h2 className="section-title">
                8 ฝ่ายงาน
                <br />
                <span>หนึ่งเครือข่าย</span>
              </h2>
            </div>
            <p>
              รายชื่อฝ่ายยึดตามผังโครงสร้างบริหารงาน 2569–2573
              สำรวจบทบาทและแนวทางดำเนินงานของแต่ละฝ่ายตามข้อมูลของสภาเครือข่าย
            </p>
          </div>
          <ol className="department-list">
            {departments.map((department, index) => (
              <li key={department.slug}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h3><Link href={`/departments/${department.slug}`}>{department.name}</Link></h3><p>{departmentProfiles[department.slug].summary}</p></div>
                <span aria-hidden="true">↗</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}

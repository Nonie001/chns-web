import type { Metadata } from "next";
import { DepartmentCards } from "@/components/site/department-cards";


export const metadata: Metadata = {
  title: "งานของเรา | CHNS",
  description: "ฝ่ายงานทั้ง 8 ฝ่ายของสภาเครือข่ายช่วยเหลือด้านมนุษยธรรม",
};

export default function DepartmentsPage() {
  return (
    <>
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
          <DepartmentCards />
        </div>
      </section>
    </>
  );
}

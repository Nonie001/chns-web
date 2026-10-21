import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "คำนวณซะกาต | CHNS",
  description: "สถานะการพัฒนาเครื่องมือคำนวณซะกาตของ CHNS",
};

export default function ZakatPage() {
  return (
    <>
      <PageHero
        eyebrow="ZAKAT CALCULATOR"
        title="คำนวณซะกาต"
        description="เครื่องมือคำนวณซะกาตของ CHNS"
      />
      <section className="section page-section" aria-labelledby="zakat-status-title">
        <div className="shell zakat-status">
          <p className="zakat-status__label">กำลังพัฒนา</p>
          <h2 id="zakat-status-title">เครื่องมือคำนวณซะกาตยังไม่เปิดให้ใช้งาน</h2>
          <p>เรากำลังจัดทำเครื่องมือนี้ เมื่อพร้อมใช้งานจะแจ้งบนหน้านี้</p>
        </div>
      </section>
    </>
  );
}

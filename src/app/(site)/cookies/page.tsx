import type { Metadata } from "next";
import { MockNotice } from "@/components/site/mock-notice";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = { title: "นโยบายคุกกี้ | CHNS" };

export default function CookiesPage() {
  return (
    <>
      <PageHero
        eyebrow="COOKIES"
        title="นโยบายคุกกี้"
        description="พื้นที่อธิบายการใช้คุกกี้และตัวเลือกของผู้เข้าชม"
      />
      <section className="section page-section">
        <div className="shell policy-page">
          <MockNotice>
            ยังไม่มีเครื่องมือวิเคราะห์หรือคุกกี้ที่ต้องขอความยินยอมในเว็บต้นแบบนี้
            ข้อความนโยบายจริงจะเขียนตามเครื่องมือที่องค์กรเลือกใช้
          </MockNotice>
          <h2 className="section-title">ข้อมูลที่จะมีในนโยบายจริง</h2>
          <ul className="content-list">
            <li>ชนิดและวัตถุประสงค์ของคุกกี้</li>
            <li>ระยะเวลาและผู้ให้บริการที่เกี่ยวข้อง</li>
            <li>วิธีจัดการหรือถอนความยินยอม</li>
          </ul>
        </div>
      </section>
    </>
  );
}

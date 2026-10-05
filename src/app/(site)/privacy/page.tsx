import type { Metadata } from "next";
import { MockNotice } from "@/components/site/mock-notice";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = { title: "นโยบายข้อมูลส่วนบุคคล | CHNS" };

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="PRIVACY"
        title="ข้อมูลส่วนบุคคล"
        description="พื้นที่สำหรับนโยบายข้อมูลส่วนบุคคลที่องค์กรอนุมัติ"
      />
      <section className="section page-section">
        <div className="shell policy-page">
          <MockNotice>
            ยังไม่มีข้อความนโยบายที่ได้รับอนุมัติ
            หน้านี้เป็นโครงสำหรับตรวจการจัดหน้าเท่านั้น
          </MockNotice>
          <h2 className="section-title">สิ่งที่ต้องระบุในนโยบายจริง</h2>
          <ul className="content-list">
            <li>ประเภทข้อมูลและวัตถุประสงค์การเก็บ</li>
            <li>ฐานการประมวลผลและผู้รับข้อมูล</li>
            <li>ระยะเวลาเก็บรักษาและมาตรการคุ้มครอง</li>
            <li>วิธีใช้สิทธิ์และช่องทางติดต่อผู้รับผิดชอบ</li>
          </ul>
        </div>
      </section>
    </>
  );
}

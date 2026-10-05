import type { Metadata } from "next";
import Link from "next/link";
import { MockNotice } from "@/components/site/mock-notice";
import { PageHero } from "@/components/site/page-hero";
import { organizationContact } from "@/content/static/organization";

export const metadata: Metadata = {
  title: "สมัครสมาชิกองค์กร | CHNS",
  description: "โครงหน้าสมัครสมาชิกองค์กรกับ CHNS",
};

export default function MembershipPage() {
  return (
    <>
      <PageHero
        eyebrow="JOIN THE NETWORK"
        title="สมัครสมาชิกองค์กร"
        description="เส้นทางสำหรับองค์กรที่สนใจเข้าร่วมเครือข่ายช่วยเหลือด้านมนุษยธรรม"
        parent={{ label: "ร่วมสนับสนุน", href: "/participate" }}
      />
      <section className="section page-section">
        <div className="shell">
          <MockNotice>
            ยังไม่เปิดรับสมัครผ่านเว็บไซต์ เพราะประเภทสมาชิก เอกสารที่ต้องใช้
            ผู้รับเรื่อง และนโยบายข้อมูลส่วนบุคคลยังต้องยืนยัน
          </MockNotice>
          <div className="section-heading">
            <div>
              <p className="eyebrow">MEMBERSHIP JOURNEY</p>
              <h2 className="section-title">
                ขั้นตอนที่ชัดเจน
                <br />
                <span>สำหรับองค์กร</span>
              </h2>
            </div>
            <p>
              แบบฟอร์มจริงจะมีเลขอ้างอิงหลังส่งและช่องทางติดตามผล
              โดยเอกสารแนบจะเก็บในพื้นที่ที่เข้าถึงได้เฉพาะผู้รับผิดชอบ
            </p>
          </div>
          <div className="three-step-grid">
            <article>
              <span>01</span>
              <h3>อ่านเกณฑ์</h3>
              <p>ทำความเข้าใจประเภทสมาชิกและคุณสมบัติที่องค์กรเปิดรับ</p>
            </article>
            <article>
              <span>02</span>
              <h3>เตรียมข้อมูล</h3>
              <p>กรอกข้อมูลติดต่อและแนบเอกสารเท่าที่จำเป็น</p>
            </article>
            <article>
              <span>03</span>
              <h3>รับการยืนยัน</h3>
              <p>รับเลขอ้างอิงและช่องทางติดตามสถานะ</p>
            </article>
          </div>
          <div className="page-actions">
            <a className="button button--dark" href={`mailto:${organizationContact.email}?subject=${encodeURIComponent("สอบถามการสมัครสมาชิกองค์กร CHNS")}`}>
              สอบถามการสมัครสมาชิก <span aria-hidden="true">↗</span>
            </a>
            <Link className="text-link" href="/#network">
              ดูองค์กรสมาชิก <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

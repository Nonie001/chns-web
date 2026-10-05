import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { organizationContact } from "@/content/static/organization";

export const metadata: Metadata = {
  title: "ติดต่อเรา | CHNS",
  description: "ช่องทางติดต่อสภาเครือข่ายช่วยเหลือด้านมนุษยธรรม",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="CONTACT CHNS"
        title="ติดต่อเรา"
        description="ที่อยู่ ช่องทางติดต่อ และเวลาทำการของสภาเครือข่ายช่วยเหลือด้านมนุษยธรรม"
      />
      <section className="section page-section">
        <div className="shell">
          <div className="contact-grid">
            <div>
              <p className="eyebrow">GET IN TOUCH</p>
              <h2 className="section-title">
                ประสานงาน
                <br />
                <span>กับ CHNS</span>
              </h2>
              <p className="large-copy">
                ติดต่อสำนักงานกลางตามช่องทางด้านล่าง หรือเลือกติดตามข่าวสารผ่านช่องทางออนไลน์ของ CHNS
              </p>
              <Link className="text-link" href="/about">
                รู้จักองค์กร <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className="contact-cards">
              <div>
                <span>01 / สำนักงาน</span>
                <h3>ที่อยู่ทางการ</h3>
                <address>{organizationContact.address}</address>
                <a href={organizationContact.mapUrl} target="_blank" rel="noopener noreferrer">เปิดแผนที่ ↗</a>
              </div>
              <div>
                <span>02 / โทรศัพท์และอีเมล</span>
                <h3>ช่องทางติดต่อ</h3>
                <p><a href={`tel:${organizationContact.phoneHref}`}>{organizationContact.phoneDisplay}</a><br /><a href={`mailto:${organizationContact.email}`}>{organizationContact.email}</a></p>
                <p>เวลาทำการ: {organizationContact.hours}</p>
              </div>
              <div>
                <span>03 / Social media</span>
                <h3>ช่องทางออนไลน์</h3>
                <ul className="contact-socials">{organizationContact.socials.map((social) => <li key={social.label}><a href={social.href} target="_blank" rel="noopener noreferrer">{social.label} ↗</a></li>)}</ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

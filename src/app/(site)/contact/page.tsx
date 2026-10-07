import type { Metadata } from "next";
import { ContactForm } from "@/components/site/contact-form";
import { SocialLinks } from "@/components/site/social-links";
import { organizationContact } from "@/content/static/organization";

export const metadata: Metadata = {
  title: "ติดต่อเรา | CHNS",
  description: "ส่งเรื่องถึงฝ่ายที่เกี่ยวข้อง หรือดูช่องทางติดต่อสำนักงาน CHNS",
};

export default function ContactPage() {
  return (
    <>
      <div className="contact-page">
        <div className="shell">
          <header className="contact-page__heading">
            <div>
              <p className="eyebrow">CONTACT CHNS</p>
              <h1>ติดต่อเรา</h1>
            </div>
            <p>มีเรื่องอยากพูดคุยหรือประสานงานกับเรา เลือกช่องทางที่สะดวก หรือส่งเรื่องถึงฝ่ายที่เกี่ยวข้องได้ที่นี่</p>
          </header>

          <div className="contact-page__layout">
            <aside className="contact-page__details" aria-labelledby="contact-details-title">
              <div className="contact-page__details-intro">
                <span className="contact-page__details-kicker">ช่องทางติดต่อ</span>
                <h2 id="contact-details-title">ติดต่อสำนักงาน</h2>
                <p>สภาเครือข่ายช่วยเหลือด้านมนุษยธรรม สำนักจุฬาราชมนตรี</p>
              </div>
              <dl className="contact-page__details-list">
                <div>
                  <dt>โทรศัพท์</dt>
                  <dd><a href={`tel:${organizationContact.phoneHref}`}>{organizationContact.phoneDisplay}<span aria-hidden="true">↗</span></a></dd>
                </div>
                <div>
                  <dt>อีเมล</dt>
                  <dd><a href={`mailto:${organizationContact.email}`}>{organizationContact.email}<span aria-hidden="true">↗</span></a></dd>
                </div>
                <div>
                  <dt>ที่อยู่สำนักงาน</dt>
                  <dd><address>{organizationContact.address}</address><a className="contact-page__map" href={organizationContact.mapUrl} target="_blank" rel="noopener noreferrer">ดูแผนที่ <span aria-hidden="true">↗</span></a></dd>
                </div>
                <div>
                  <dt>เวลาทำการ</dt>
                  <dd>{organizationContact.hours}</dd>
                </div>
              </dl>
              <div className="contact-page__social">
                <span>ติดตามเรา</span>
                <SocialLinks className="contact-socials" />
              </div>
            </aside>

            <section className="contact-page__form-panel" id="contact-form" aria-labelledby="contact-form-title">
              <div className="contact-page__form-heading">
                <span className="contact-page__form-kicker">ส่งเรื่องถึงเรา</span>
                <h2 id="contact-form-title">ฝากข้อความไว้ได้เลย</h2>
                <p>เลือกฝ่ายและเล่าเรื่องที่ต้องการติดต่อ หากไม่แน่ใจให้เลือกสำนักงานกลาง</p>
              </div>
              <ContactForm />
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

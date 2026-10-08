import Link from "next/link";
import Image from "next/image";
import { site } from "@/content/static/site";
import { organizationContact } from "@/content/static/organization";
import { SocialLinks } from "./social-links";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__main">
        <div className="site-footer__identity">
          <Link className="site-footer__brand" href="/" aria-label={`${site.officialName} หน้าแรก`}>
            <Image src="/brand/chns-footer-logo.png" alt="" width={2240} height={2240} sizes="14rem" />
          </Link>
          <div className="site-footer__follow">
            <span>ติดตามเรา</span>
            <SocialLinks className="site-footer__social" />
          </div>
        </div>
        <div className="site-footer__contact-group">
          <h2>ติดต่อสำนักงาน</h2>
          <address>{organizationContact.address}</address>
          <a className="site-footer__map" href={organizationContact.mapUrl} target="_blank" rel="noopener noreferrer">เปิดแผนที่ <span aria-hidden="true">↗</span></a>
          <dl>
            <div><dt>โทรศัพท์</dt><dd><a href={`tel:${organizationContact.phoneHref}`}>{organizationContact.phoneDisplay}</a></dd></div>
            <div><dt>อีเมล</dt><dd><a href={`mailto:${organizationContact.email}`}>{organizationContact.email}</a></dd></div>
            <div><dt>เวลาทำการ</dt><dd>{organizationContact.hours}</dd></div>
          </dl>
        </div>
        <div className="site-footer__links">
          <nav aria-label="ข้อมูลองค์กร">
            <h2>ข้อมูลองค์กร</h2>
            <Link href="/about">เกี่ยวกับเรา</Link>
            <Link href="/about#history">ประวัติองค์กร</Link>
            <Link href="/about#vision">ทิศทางองค์กร</Link>
            <Link href="/about#structure">โครงสร้างบริหาร</Link>
            <Link href="/departments">ฝ่ายงาน</Link>
            <Link href="/centers">ศูนย์ประสานงาน</Link>
            <Link href="/centers#members">องค์กรสมาชิก</Link>
          </nav>
          <nav aria-label="เนื้อหาและบริการ">
            <h2>สำรวจเว็บไซต์</h2>
            <Link href="/projects">โครงการ</Link>
            <Link href="/news">ข่าวสาร</Link>
            <Link href="/media">ภาพและวิดีโอ</Link>
            <Link href="/reports">รายงาน</Link>
            <Link href="/participate#support">ร่วมสนับสนุน</Link>
            <Link href="/participate#membership">สมัครสมาชิกองค์กร</Link>
            <Link href="/contact">ติดต่อเรา</Link>
          </nav>
        </div>
      </div>
      <div className="shell site-footer__bottom">
        <span>© {new Date().getFullYear()} {site.officialName}</span>
        <span className="site-footer__legal">
          <Link href="/search">ค้นหา</Link>
          <Link href="/privacy">ข้อมูลส่วนบุคคล</Link>
          <Link href="/cookies">คุกกี้</Link>
        </span>
      </div>
    </footer>
  );
}

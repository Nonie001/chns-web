import Link from "next/link";
import Image from "next/image";
import { site } from "@/content/static/site";
import { organizationContact } from "@/content/static/organization";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__main">
        <div className="site-footer__identity">
          <Link className="site-footer__brand" href="/" aria-label="CHNS หน้าแรก">
            <Image src="/brand/chns-mark.webp" alt="" width={80} height={80} />
            <span>CHNS</span>
          </Link>
          <p>{site.officialName}</p>
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
            <h2>เกี่ยวกับ CHNS</h2>
            <Link href="/about">เกี่ยวกับเรา</Link>
            <Link href="/about/history">ประวัติองค์กร</Link>
            <Link href="/about/direction">ทิศทางองค์กร</Link>
            <Link href="/about/structure">โครงสร้างบริหาร</Link>
            <Link href="/departments">ฝ่ายงาน</Link>
            <Link href="/centers">ศูนย์ประสานงาน</Link>
            <Link href="/#network">องค์กรสมาชิก</Link>
          </nav>
          <nav aria-label="เนื้อหาและบริการ">
            <h2>สำรวจเว็บไซต์</h2>
            <Link href="/projects">โครงการ</Link>
            <Link href="/news">ข่าวสาร</Link>
            <Link href="/media">ภาพและวิดีโอ</Link>
            <Link href="/reports">รายงาน</Link>
            <Link href="/participate">ร่วมสนับสนุน</Link>
            <Link href="/participate/membership">สมัครสมาชิกองค์กร</Link>
            <Link href="/contact">ติดต่อเรา</Link>
          </nav>
        </div>
      </div>
      <div className="shell site-footer__social-row">
        <span>ติดตาม CHNS</span>
        <div className="site-footer__social" aria-label="ช่องทางสื่อสังคมออนไลน์">
          {organizationContact.socials.map((item) => <a href={item.href} key={item.label} target="_blank" rel="noopener noreferrer">{item.label} <span aria-hidden="true">↗</span></a>)}
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

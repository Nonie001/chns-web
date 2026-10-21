import Link from "next/link";
import Image from "next/image";
import { site } from "@/content/static/site";
import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__topbar">
        <div className="shell site-header__topbar-inner">
          <nav className="site-header__utility" aria-label="ลิงก์เพิ่มเติม">
            <Link href="/about">เกี่ยวกับเรา</Link>
            <Link href="/contact">ติดต่อเรา</Link>
            <Link href="/participate">ร่วมกับเรา</Link>
          </nav>
          <Link className="site-header__top-link" href="/zakat">คำนวณซะกาต</Link>
        </div>
      </div>
      <div className="site-header__navigation">
        <div className="shell site-header__inner">
          <Link className="site-header__brand" href="/" aria-label={`${site.officialName} หน้าแรก`}>
            <Image className="site-header__logo" src="/brand/chns-horizontal.webp" alt="" width={1600} height={251} priority />
          </Link>
          <DesktopNav />
          <Link className="button button--accent site-header__action" href="/participate#support">
            ร่วมสนับสนุน
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

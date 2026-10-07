import Link from "next/link";
import Image from "next/image";
import { site } from "@/content/static/site";
import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Link className="site-brand" href="/" aria-label={`${site.officialName} หน้าแรก`}>
          <Image className="site-brand__mark" src="/brand/chns-mark.webp" alt="" width={56} height={56} priority />
          <span className="site-brand__wordmark" aria-hidden="true">CHNS</span>
        </Link>
        <DesktopNav />
        <Link
          className="button button--accent site-header__action"
          href="/participate#support"
        >
          ร่วมสนับสนุน
        </Link>

        <MobileNav />
      </div>
    </header>
  );
}

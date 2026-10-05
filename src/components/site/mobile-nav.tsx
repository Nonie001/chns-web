"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/static/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const closeMenu = useCallback((returnFocus = false) => {
    setOpen(false);
    setOpenMenu(null);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  const [lastPathname, setLastPathname] = useState(pathname);

  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
    setOpenMenu(null);
  }

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") closeMenu(true);
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, closeMenu]);

  return (
    <div className="mobile-nav">
      <button
        className={`mobile-nav__toggle${open ? " is-open" : ""}`}
        type="button"
        ref={toggleRef}
        aria-expanded={open}
        aria-controls="mobile-site-navigation"
        aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
        onClick={() => (open ? closeMenu() : setOpen(true))}
      >
        <span className="mobile-nav__bars" aria-hidden="true"><span /><span /><span /></span>
      </button>

      <button
        className={`mobile-nav__scrim${open ? " is-open" : ""}`}
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={() => closeMenu(true)}
      />

      <div
        className={`mobile-nav__panel${open ? " is-open" : ""}`}
        id="mobile-site-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="เมนูหลัก"
        inert={!open}
      >
        <div className="mobile-nav__head">
          <Link className="site-brand" href="/" aria-label={`${site.officialName} หน้าแรก`} onClick={() => closeMenu()}>
            <Image className="site-brand__mark" src="/brand/chns-mark.webp" alt="" width={56} height={56} />
            <span className="site-brand__wordmark" aria-hidden="true">CHNS</span>
          </Link>
          <button
            className="mobile-nav__close"
            type="button"
            ref={closeRef}
            aria-label="ปิดเมนู"
            onClick={() => closeMenu(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>

        <nav aria-label="เมนูหลักบนมือถือ">
          {site.navigation.map((item, index) => {
            if (!("children" in item) || !item.children) {
              return <Link key={item.label} href={item.href} onClick={() => closeMenu()}>{item.label}</Link>;
            }
            const expanded = openMenu === item.label;
            return (
              <div className="mobile-nav__item" key={item.label}>
                <button
                  className={expanded ? "is-open" : ""}
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={`mobile-submenu-${index}`}
                  onClick={() => setOpenMenu(expanded ? null : item.label)}
                >
                  {item.label}
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                {expanded && (
                  <div className="mobile-nav__submenu" id={`mobile-submenu-${index}`}>
                    <Link className="mobile-nav__overview" href={item.href} onClick={() => closeMenu()}>ดูภาพรวม{item.label}</Link>
                    {item.children.map((child) => (
                      <Link href={child.href} key={child.label} onClick={() => closeMenu()}>{child.label}</Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="mobile-nav__foot">
          <Link className="button button--accent" href="/participate" onClick={() => closeMenu()}>ร่วมสนับสนุน</Link>
          <Link className="mobile-nav__search" href="/search" onClick={() => closeMenu()}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" /><path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            ค้นหา
          </Link>
        </div>
      </div>
    </div>
  );
}

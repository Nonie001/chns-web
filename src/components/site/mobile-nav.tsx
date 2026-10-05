"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { site } from "@/content/static/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: PointerEvent) {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setOpenMenu(null);
      }
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setOpenMenu(null);
      }
    }
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  function closeMenu() {
    setOpen(false);
    setOpenMenu(null);
  }

  return (
    <div className="mobile-nav" ref={navRef}>
      <button
        className="mobile-nav__toggle"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-site-navigation"
        onClick={() => { setOpen(!open); setOpenMenu(null); }}
      >
        {open ? "ปิดเมนู" : "เมนู"}
      </button>
      {open && (
        <nav id="mobile-site-navigation" aria-label="เมนูหลักบนมือถือ">
          {site.navigation.map((item, index) => {
            if (!("children" in item) || !item.children) {
              return <Link key={item.label} href={item.href} onClick={closeMenu}>{item.label}</Link>;
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
                </button>
                {expanded && (
                  <div className="mobile-nav__submenu" id={`mobile-submenu-${index}`}>
                    <Link className="mobile-nav__overview" href={item.href} onClick={closeMenu}>ดูภาพรวม{item.label}</Link>
                    {item.children.map((child) => (
                      <Link href={child.href} key={child.label} onClick={closeMenu}>{child.label}</Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <Link href="/search" onClick={closeMenu}>ค้นหา</Link>
        </nav>
      )}
    </div>
  );
}

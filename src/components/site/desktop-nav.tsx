"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { site } from "@/content/static/site";

export function DesktopNav() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: PointerEvent) {
      if (!navRef.current?.contains(event.target as Node)) setOpenMenu(null);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenMenu(null);
    }
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <nav className="site-nav" aria-label="เมนูหลัก" ref={navRef}>
      {site.navigation.filter((item) => item.href !== "/about" && item.href !== "/contact").map((item, index) => {
        if (!("children" in item) || !item.children) {
          return <Link className="site-nav__link" key={item.label} href={item.href} onMouseEnter={() => setOpenMenu(null)} onFocus={() => setOpenMenu(null)} onClick={() => setOpenMenu(null)}>{item.label}</Link>;
        }
        const expanded = openMenu === item.label;
        const isDepartmentMenu = item.children.some((child) => child.href.startsWith("/departments/"));
        const isReportMenu = item.href === "/reports";
        const isStructuredMenu = isDepartmentMenu || isReportMenu;
        const panelId = `desktop-submenu-${index}`;
        return (
          <div
            className={`site-nav__item${expanded ? " is-open" : ""}`}
            key={item.label}
            onMouseEnter={() => setOpenMenu(item.label)}
            onMouseLeave={() => setOpenMenu((current) => current === item.label ? null : current)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setOpenMenu((current) => current === item.label ? null : current);
            }}
          >
            <button
              className={`site-nav__trigger${expanded ? " is-open" : ""}`}
              type="button"
              aria-expanded={expanded}
              aria-controls={panelId}
              onFocus={() => setOpenMenu(item.label)}
              onClick={() => setOpenMenu(item.label)}
            >
              {item.label}
            </button>
            {expanded && (
              <div className={`site-nav__dropdown${isStructuredMenu ? " site-nav__dropdown--structured" : ""}${isReportMenu ? " site-nav__dropdown--reports" : ""}`} id={panelId}>
                {isStructuredMenu ? (
                  <div className="site-nav__structured-head">
                    <p>{item.label}</p>
                  </div>
                ) : (
                  <>
                    <p className="site-nav__dropdown-title">{item.label}</p>
                    <Link className="site-nav__overview" href={item.href} onClick={() => setOpenMenu(null)}>ดูภาพรวม{item.label}</Link>
                  </>
                )}
                <div className="site-nav__options">
                  {item.children.map((child, childIndex) => (
                    <Link href={child.href} key={child.label} onClick={() => setOpenMenu(null)}>
                      {isStructuredMenu && <span className="site-nav__option-number" aria-hidden="true">{String(childIndex + 1).padStart(2, "0")}</span>}
                      <span>{child.label}</span>
                      {isStructuredMenu && <span className="site-nav__option-arrow" aria-hidden="true">↗</span>}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

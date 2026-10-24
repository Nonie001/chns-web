"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const groups = [
  { label: "ภาพรวม", links: [{ href: "/admin", label: "แดชบอร์ด", icon: "◫" }] },
  { label: "หน้าแรก", links: [
    { href: "/admin/homepage/features", label: "จัดเนื้อหาเด่น", icon: "▦" },
    { href: "/admin/homepage/slides", label: "สไลด์ภาพ", icon: "▤" },
  ] },
  { label: "เนื้อหา", links: [
    { href: "/admin/articles", label: "ข่าวและบทความ", icon: "▣" },
    { href: "/admin/projects", label: "โครงการ", icon: "▥" },
    { href: "/admin/reports", label: "รายงาน", icon: "▧" },
  ] },
  { label: "เครือข่ายและบัญชี", links: [
    { href: "/admin/partners", label: "โลโก้ภาคี", icon: "◎" },
    { href: "/admin/inquiries", label: "ข้อความติดต่อ", icon: "▢" },
    { href: "/admin/account", label: "บัญชีของฉัน", icon: "◉" },
  ] },
];

export function AdminNavigation() {
  const pathname = usePathname();
  return <nav aria-label="เมนูหลังบ้าน">
    {groups.map((group) => <div className="admin-nav-group" key={group.label}>
      <span className="admin-nav-group__label">{group.label}</span>
      {group.links.map((link) => {
        const active = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(`${link.href}/`));
        return <Link href={link.href} className={active ? "is-active" : undefined} aria-current={active ? "page" : undefined} key={link.href}>
          <span className="admin-nav-icon" aria-hidden="true">{link.icon}</span>{link.label}
        </Link>;
      })}
    </div>)}
  </nav>;
}

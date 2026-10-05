import Link from "next/link";
import Image from "next/image";
import { AdminSignout } from "@/components/admin/admin-signout";
import { requireAdminSession } from "@/lib/auth/admin-session";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminSession();
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-sidebar__brand" href="/admin">
          <Image src="/brand/chns-mark.webp" alt="" width={44} height={44} />
          <span>CHNS</span>
          <small>CONTENT ADMIN</small>
        </Link>
        <nav aria-label="เมนูหลังบ้าน">
          <Link href="/admin">ภาพรวม</Link>
          <Link href="/admin/homepage/slides">สไลด์หน้าแรก</Link>
          <Link href="/admin/homepage/features">เนื้อหาเด่น</Link>
          <Link href="/admin/articles">ข่าวและบทความ</Link>
          <Link href="/admin/projects">โครงการ</Link>
          <Link href="/admin/reports">รายงาน</Link>
          <Link href="/admin/partners">โลโก้ภาคี</Link>
          <Link href="/admin/account">บัญชีและรหัสผ่าน</Link>
          <Link href="/">ดูเว็บไซต์ ↗</Link>
        </nav>
        <div className="admin-sidebar__bottom">
          <span>{session.user.email}</span>
          <AdminSignout />
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import "../admin.css";
import { AdminNavigation } from "@/components/admin/admin-navigation";
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
        <AdminNavigation />
        <div className="admin-sidebar__bottom">
          <span>{session.user.email}</span>
          <AdminSignout />
        </div>
      </aside>
      <main className="admin-main"><div className="admin-topbar"><span>CHNS / CONTENT ADMIN</span><Link href="/" target="_blank" rel="noopener noreferrer">เปิดเว็บไซต์ ↗</Link></div>{children}</main>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { getAdminSession } from "@/lib/auth/admin-session";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบผู้ดูแล | CHNS",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin");
  return (
    <main className="admin-login-page">
      <div className="admin-login-card">
        <Link href="/" className="admin-login-brand">
          <Image src="/brand/chns-mark.webp" alt="" width={52} height={52} />
          <span>CHNS</span>
        </Link>
        <p className="eyebrow">CONTENT ADMIN</p>
        <h1>เข้าสู่ระบบผู้ดูแล</h1>
        <p>จัดการภาพสไลด์และเนื้อหาหน้าแรกในพื้นที่สำหรับผู้ได้รับสิทธิ์</p>
        <AdminLoginForm />
        <Link href="/" className="text-link">
          กลับหน้าเว็บไซต์ <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </main>
  );
}

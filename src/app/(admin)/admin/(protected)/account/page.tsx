import { AdminPasswordForm } from "@/components/admin/admin-password-form";

export default function AdminAccountPage() {
  return (
    <>
      <div className="admin-page-header">
        <p className="eyebrow">ACCOUNT</p>
        <h1>บัญชีผู้ดูแล</h1>
        <p>ตั้งรหัสผ่านใหม่สำหรับการเข้าสู่ระบบหลังบ้าน</p>
      </div>
      <div className="admin-panel">
        <h2>เปลี่ยนรหัสผ่าน</h2>
        <AdminPasswordForm />
      </div>
    </>
  );
}

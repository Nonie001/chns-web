import Link from "next/link";
import { listAdminSlides } from "@/features/hero/slide-store";
import { listAdminArticles } from "@/features/articles/article-store";
import { listAdminProjects } from "@/features/projects/project-store";
import { listAdminReports } from "@/features/reports/report-store";
import { listAdminPartners } from "@/features/partners/partner-store";
import { countNewContactInquiries } from "@/features/contact/contact-store";

export default async function AdminDashboardPage() {
  const slides = await listAdminSlides();
  const articles = await listAdminArticles();
  const projects = await listAdminProjects();
  const reports = await listAdminReports();
  const partners = await listAdminPartners();
  const newInquiries = await countNewContactInquiries();
  const liveArticles = articles.filter((article) => article.status === "published").length;
  const liveProjects = projects.filter((project) => project.status === "published").length;
  const liveReports = reports.filter((report) => report.status === "published").length;
  return (
    <>
      <div className="admin-page-header">
        <p className="eyebrow">DASHBOARD</p>
        <h1>ภาพรวมหลังบ้าน</h1>
        <p>สถานะเนื้อหาและทางลัดสำหรับงานที่ใช้บ่อย</p>
      </div>
      <div className="admin-summary-grid">
        <div>
          <span>ข่าวเผยแพร่</span>
          <strong>{liveArticles}</strong>
        </div>
        <div>
          <span>โครงการเผยแพร่</span>
          <strong>{liveProjects}</strong>
        </div>
        <div>
          <span>ข้อความใหม่</span>
          <strong>{newInquiries}</strong>
        </div>
      </div>
      <div className="admin-quick-grid">
      <div className="admin-panel">
        <h2>จัดหน้าแรก</h2>
        <p>ลากโครงการลงตำแหน่งและดูตัวอย่างก่อนบันทึก</p>
        <Link href="/admin/homepage/features" className="button button--dark">เปิดตัวจัดหน้า ↗</Link>
      </div>
      <div className="admin-panel">
        <h2>ข่าวและบทความ</h2>
        <p>{articles.length} รายการ · เผยแพร่แล้ว {liveArticles}</p>
        <Link href="/admin/articles" className="button button--dark">จัดการข่าว ↗</Link>
      </div>
      <div className="admin-panel">
        <h2>โครงการ</h2>
        <p>{projects.length} รายการ · เผยแพร่แล้ว {liveProjects}</p>
        <Link href="/admin/projects" className="button button--dark">จัดการโครงการ ↗</Link>
      </div>
      <div className="admin-panel">
        <h2>ข้อความติดต่อ</h2>
        <p>มีเรื่องใหม่รอรับ {newInquiries} รายการ</p>
        <Link href="/admin/inquiries" className="button button--dark">ดูข้อความ ↗</Link>
      </div>
      <div className="admin-panel">
        <h2>รายงานและเอกสาร</h2>
        <p>{reports.length} รายการ · เผยแพร่แล้ว {liveReports}</p>
        <Link href="/admin/reports" className="button button--dark">จัดการรายงาน ↗</Link>
      </div>
      <div className="admin-panel">
        <h2>ภาคีเครือข่าย</h2>
        <p>{partners.length} รายการ · เผยแพร่แล้ว {partners.filter((partner) => partner.status === "published").length} รายการ</p>
        <Link href="/admin/partners" className="button button--dark">จัดการภาคี ↗</Link>
      </div>
      <div className="admin-panel">
        <h2>สไลด์หน้าแรก</h2>
        <p>{slides.length} สไลด์ · เผยแพร่แล้ว {slides.filter((slide) => slide.status === "published").length}</p>
        <Link href="/admin/homepage/slides" className="button button--dark">จัดการสไลด์ ↗</Link>
      </div>
      </div>
    </>
  );
}

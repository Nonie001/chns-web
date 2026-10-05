import Link from "next/link";
import { listAdminSlides } from "@/features/hero/slide-store";
import { listAdminArticles } from "@/features/articles/article-store";
import { listAdminProjects } from "@/features/projects/project-store";
import { listAdminReports } from "@/features/reports/report-store";
import { listAdminPartners } from "@/features/partners/partner-store";

export default async function AdminDashboardPage() {
  const slides = await listAdminSlides();
  const articles = await listAdminArticles();
  const projects = await listAdminProjects();
  const reports = await listAdminReports();
  const partners = await listAdminPartners();
  const live = slides.filter((slide) => slide.status === "published").length;
  return (
    <>
      <div className="admin-page-header">
        <p className="eyebrow">DASHBOARD</p>
        <h1>ภาพรวมหลังบ้าน</h1>
        <p>จัดการสไลด์และข่าวสารที่เผยแพร่บนเว็บไซต์</p>
      </div>
      <div className="admin-summary-grid">
        <div>
          <span>สไลด์ทั้งหมด</span>
          <strong>{slides.length}</strong>
        </div>
        <div>
          <span>เผยแพร่แล้ว</span>
          <strong>{live}</strong>
        </div>
        <div>
          <span>ร่าง/เก็บถาวร</span>
          <strong>{slides.length - live}</strong>
        </div>
      </div>
      <div className="admin-panel">
        <h2>สไลด์หน้าแรก</h2>
        <p>เพิ่มภาพ จัดลำดับ และเลือกสไลด์ที่แสดงบนหน้าเว็บ</p>
        <Link href="/admin/homepage/slides" className="button button--dark">
          จัดการสไลด์ <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <div className="admin-panel">
        <h2>ข่าวและบทความ</h2>
        <p>{articles.length} รายการ · เผยแพร่แล้ว {articles.filter((article) => article.status === "published").length} รายการ</p>
        <Link href="/admin/articles" className="button button--dark">จัดการบทความ <span aria-hidden="true">↗</span></Link>
      </div>
      <div className="admin-panel">
        <h2>โครงการ</h2>
        <p>{projects.length} รายการ · เผยแพร่แล้ว {projects.filter((project) => project.status === "published").length} รายการ</p>
        <Link href="/admin/projects" className="button button--dark">จัดการโครงการ <span aria-hidden="true">↗</span></Link>
      </div>
      <div className="admin-panel">
        <h2>เนื้อหาเด่นหน้าแรก</h2>
        <p>เลือกข่าวและโครงการที่เผยแพร่แล้วให้ขึ้นหน้าแรก</p>
        <Link href="/admin/homepage/features" className="button button--dark">จัดเนื้อหาเด่น <span aria-hidden="true">↗</span></Link>
      </div>
      <div className="admin-panel">
        <h2>รายงานและเอกสาร</h2>
        <p>{reports.length} รายการ · เผยแพร่แล้ว {reports.filter((report) => report.status === "published").length} รายการ</p>
        <Link href="/admin/reports" className="button button--dark">จัดการรายงาน <span aria-hidden="true">↗</span></Link>
      </div>
      <div className="admin-panel">
        <h2>ภาคีเครือข่าย</h2>
        <p>{partners.length} รายการ · เผยแพร่แล้ว {partners.filter((partner) => partner.status === "published").length} รายการ</p>
        <Link href="/admin/partners" className="button button--dark">จัดการโลโก้ภาคี <span aria-hidden="true">↗</span></Link>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { departments } from "@/content/static/site";
import { departmentCardThemes, departmentHeroPhotos, departmentProfiles } from "@/content/static/organization";
import { listPublishedProjects } from "@/features/projects/project-store";

export const dynamic = "force-dynamic";

type DepartmentIconName = "role" | "work" | "info" | "project" | "arrow";

function DepartmentIcon({ name }: { name: DepartmentIconName }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {name === "role" && <><circle cx="8" cy="8" r="2.4" /><circle cx="16" cy="8" r="2.4" /><path d="M3 19v-1.4A4.6 4.6 0 0 1 7.6 13h.8a4.6 4.6 0 0 1 4.6 4.6V19M13 13.2a4.7 4.7 0 0 1 1.8-.2h.8a4.4 4.4 0 0 1 4.4 4.4V19" /></>}
      {name === "work" && <><circle cx="5" cy="12" r="2" /><circle cx="18" cy="5" r="2" /><circle cx="18" cy="19" r="2" /><path d="m7 11 9-5M7 13l9 5" /></>}
      {name === "info" && <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>}
      {name === "project" && <><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M3 9h18M8 14h4M8 17h8" /></>}
      {name === "arrow" && <><path d="M5 12h14m-6-6 6 6-6 6" /></>}
    </svg>
  );
}

export function generateStaticParams() {
  return departments.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/departments/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const department = departments.find((item) => item.slug === slug);
  return {
    title: department ? `${department.name} | CHNS` : "ไม่พบฝ่ายงาน | CHNS",
  };
}

export default async function DepartmentPage({
  params,
}: PageProps<"/departments/[slug]">) {
  const { slug } = await params;
  const department = departments.find((item) => item.slug === slug);
  if (!department) notFound();
  const profile = departmentProfiles[department.slug];
  const theme = departmentCardThemes[department.slug];
  const heroPhoto = departmentHeroPhotos[department.slug];
  const departmentIndex = departments.findIndex((item) => item.slug === slug);
  const previousDepartment = departments[departmentIndex - 1];
  const nextDepartment = departments[departmentIndex + 1];
  const hasDetails = profile.roles.length > 0 || profile.initiatives.length > 0;
  const relatedProjects = (await listPublishedProjects()).filter(
    (project) => project.departmentSlug === slug,
  );

  return (
    <div className="department-detail" style={{ "--department-accent": theme.accent } as CSSProperties}>
      <section className="department-detail__hero" aria-labelledby="department-title">
        <div className="shell department-detail__hero-grid">
          <div className="department-detail__hero-copy">
            <Link className="department-detail__breadcrumb" href="/about#structure">← โครงสร้างฝ่ายงาน</Link>
            <p className="department-detail__eyebrow"><span aria-hidden="true" /> ฝ่ายงานในเครือข่าย CHNS</p>
            <h1 id="department-title">{department.name}</h1>
            <p className="department-detail__lead">{profile.summary}</p>
            <Link className="department-detail__hero-link" href="/contact">ติดต่อ CHNS <DepartmentIcon name="arrow" /></Link>
          </div>
          <figure className="department-detail__hero-media">
            <Image src={heroPhoto.src} alt={heroPhoto.alt} fill priority sizes="(max-width: 800px) 100vw, 48vw" style={{ objectPosition: heroPhoto.position }} />
            <figcaption>ภาพจากคลังสื่อ CHNS ใช้ประกอบหน้าแนะนำฝ่าย</figcaption>
          </figure>
        </div>
      </section>

      <nav className="department-detail__jump" aria-label="หัวข้อในหน้านี้">
        <div className="shell">
          {profile.roles.length > 0 && <a href="#roles">บทบาทของฝ่าย</a>}
          {profile.initiatives.length > 0 && <a href="#initiatives">งานและแนวทาง</a>}
          {relatedProjects.length > 0 && <a href="#projects">โครงการที่เกี่ยวข้อง</a>}
          {!hasDetails && <a href="#pending">ข้อมูลฝ่าย</a>}
        </div>
      </nav>

      {profile.roles.length > 0 && (
        <section className="department-detail__section" id="roles" aria-labelledby="department-roles-title">
          <div className="shell department-detail__section-grid">
            <div className="department-detail__section-intro">
              <span className="department-detail__symbol"><DepartmentIcon name="role" /></span>
              <h2 id="department-roles-title">บทบาท<br />ของฝ่าย</h2>
              <p>ขอบเขตบทบาทของ{department.name}</p>
            </div>
            <ul className={`department-detail__list department-detail__list--roles${profile.roles.length <= 2 ? " department-detail__list--short" : ""}`}>
              {profile.roles.map((role) => (
                <li key={role}><span className="department-detail__list-icon"><DepartmentIcon name="role" /></span><p>{role}</p></li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {profile.initiatives.length > 0 && (
        <section className="department-detail__section department-detail__section--work" id="initiatives" aria-labelledby="department-initiatives-title">
          <div className="shell department-detail__section-grid">
            <div className="department-detail__section-intro">
              <span className="department-detail__symbol"><DepartmentIcon name="work" /></span>
              <h2 id="department-initiatives-title">งานและ<br />แนวทาง</h2>
              <p>รายการที่ระบุไว้ในข้อมูลของ{department.name}</p>
            </div>
            <div>
              <ul className="department-detail__list department-detail__list--work">
                {profile.initiatives.map((initiative) => (
                  <li key={initiative}><span className="department-detail__list-icon"><DepartmentIcon name="work" /></span><p>{initiative}</p></li>
                ))}
              </ul>
              <p className="department-detail__note">รายการนี้อธิบายขอบเขตงาน ไม่ใช่สถานะหรือผลลัพธ์ของโครงการที่เผยแพร่แล้ว</p>
            </div>
          </div>
        </section>
      )}

      {!hasDetails && (
        <section className="department-detail__section department-detail__section--work" id="pending" aria-labelledby="department-pending-title">
          <div className="shell department-detail__section-grid">
            <div className="department-detail__section-intro">
              <span className="department-detail__symbol"><DepartmentIcon name="info" /></span>
              <h2 id="department-pending-title">ข้อมูล<br />ของฝ่าย</h2>
            </div>
            <div className="department-detail__pending"><h3>รอรายละเอียดที่ยืนยันแล้ว</h3><p>ขณะนี้มีข้อมูลภาพรวมของฝ่ายเท่านั้น เมื่อมีรายละเอียดเพิ่มเติมที่ยืนยันแล้วจะแสดงในหน้านี้</p></div>
          </div>
        </section>
      )}

      {relatedProjects.length > 0 && (
        <section className="department-detail__section" id="projects" aria-labelledby="department-projects-title">
          <div className="shell department-detail__section-grid">
            <div className="department-detail__section-intro">
              <span className="department-detail__symbol"><DepartmentIcon name="project" /></span>
              <h2 id="department-projects-title">โครงการ<br />ที่เกี่ยวข้อง</h2>
              <p>เฉพาะโครงการที่เผยแพร่แล้วและระบุฝ่ายนี้เป็นผู้รับผิดชอบ</p>
            </div>
            <div className="department-detail__projects">
              {relatedProjects.map((project) => (
                <Link key={project.slug} href={`/projects/${project.slug}`}>
                  <span>โครงการที่เผยแพร่แล้ว</span><h3>{project.title}</h3><p>{project.summary}</p><DepartmentIcon name="arrow" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <nav className="department-detail__next" aria-label="ดูฝ่ายงานอื่น">
        <div className="shell department-detail__next-grid">
          {previousDepartment && <Link className="department-detail__previous" href={`/departments/${previousDepartment.slug}`}><span>← ฝ่ายก่อนหน้า</span><strong>{previousDepartment.name}</strong></Link>}
          {nextDepartment && <Link className="department-detail__following" href={`/departments/${nextDepartment.slug}`}><span>ฝ่ายถัดไป →</span><strong>{nextDepartment.name}</strong></Link>}
        </div>
      </nav>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/page-hero";
import { departments } from "@/content/static/site";
import { departmentProfiles } from "@/content/static/organization";
import { listPublishedProjects } from "@/features/projects/project-store";

export const dynamic = "force-dynamic";

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
  const relatedProjects = (await listPublishedProjects()).filter(
    (project) => project.departmentSlug === slug,
  );

  return (
    <>
      <PageHero
        eyebrow="DEPARTMENT"
        title={department.name}
        description={profile.summary}
      />
      <section className="section page-section">
        <div className="shell detail-grid">
          <div>
            <p className="eyebrow">ABOUT THIS DEPARTMENT</p>
            <h2 className="section-title">บทบาทของ{department.name}</h2>
            <p className="large-copy">{profile.summary}</p>
            {profile.roles.length > 0 && <ul className="content-list">{profile.roles.map((role) => <li key={role}>{role}</li>)}</ul>}
            <div className="detail-divider" />
            <h3>งานและแนวทางที่ระบุในข้อมูลฝ่าย</h3>
            {profile.initiatives.length > 0 ? <ul className="content-list">{profile.initiatives.map((initiative) => <li key={initiative}>{initiative}</li>)}</ul> : <p>รายละเอียดภารกิจเฉพาะฝ่ายยังไม่มีในข้อมูลที่ส่งมา</p>}
            <p className="department-clarifier">รายการข้างต้นอธิบายขอบเขตงาน ไม่ใช่รายงานสถานะหรือผลลัพธ์ของโครงการที่เผยแพร่แล้ว</p>
            <div className="department-links"><Link className="text-link" href="/news">ดูข่าวสารทั้งหมด ↗</Link><Link className="text-link" href="/contact">ติดต่อ CHNS ↗</Link></div>
            <Link className="text-link" href="/departments">
              กลับไปทุกฝ่าย <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <Image className="editorial-photo" src="/editorial/coordination.webp" width={960} height={640} alt="" />
        </div>
      </section>
      {relatedProjects.length > 0 && (
        <section className="section related-section">
          <div className="shell">
            <p className="eyebrow">RELATED PROJECTS</p>
            <h2 className="section-title">โครงการที่เชื่อมกับฝ่าย</h2>
            <div className="simple-card-grid">
              {relatedProjects.map((project) => (
                <Link
                  className="simple-card"
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                >
                  <span>โครงการ</span>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  <b aria-hidden="true">↗</b>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/site/project-detail";
import { ProjectCard } from "@/components/site/project-card";
import { getDisplayProject, listDisplayProjects } from "@/features/projects/project-store";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getDisplayProject(slug);
  return project ? { title: `${project.title} | CHNS`, description: project.summary } : { title: "ไม่พบโครงการ | CHNS" };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = await getDisplayProject(slug);
  if (!project) notFound();
  const related = (await listDisplayProjects()).filter((item) => item.slug !== slug && item.departmentSlug === project.departmentSlug).slice(0, 3);
  return <>
    <ProjectDetail project={project} />
    {related.length > 0 && <section className="section related-content"><div className="shell"><p className="eyebrow">MORE FROM THIS TEAM</p><h2 className="section-title">ภารกิจจากฝ่ายเดียวกัน</h2><div className="feature-card-grid">{related.map((item) => <ProjectCard project={item} key={item.slug} />)}</div></div></section>}
  </>;
}

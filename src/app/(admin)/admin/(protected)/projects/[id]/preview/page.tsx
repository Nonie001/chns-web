import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/site/project-detail";
import { getAdminProject } from "@/features/projects/project-store";

export default async function ProjectPreviewPage({ params }: PageProps<"/admin/projects/[id]/preview">) {
  const { id } = await params;
  const project = await getAdminProject(id);
  if (!project) notFound();
  return (
    <div className="admin-article-preview">
      <p className="admin-form-error">พรีวิวสำหรับผู้ดูแล · สถานะ {project.status === "published" ? "เผยแพร่" : "ยังไม่เผยแพร่"}</p>
      <ProjectDetail preview project={{
        slug: project.slug, title: project.title, category: project.category,
        location: project.location, departmentSlug: project.departmentSlug,
        summary: project.summary, body: project.body,
        imageSrc: project.imageKey ? `/api/project-images/${project.imageKey}` : null,
        imageAlt: project.imageAlt, imageCredit: project.imageCredit,
        publishedAt: project.status === "published" ? project.publishedAt : null,
        isDemo: project.isMockup,
      }} />
    </div>
  );
}

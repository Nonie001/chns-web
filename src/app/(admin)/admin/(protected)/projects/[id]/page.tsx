import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectEditor } from "@/components/admin/project-editor";
import { getAdminProject } from "@/features/projects/project-store";

export default async function EditProjectPage({ params }: PageProps<"/admin/projects/[id]">) {
  const { id } = await params;
  const project = await getAdminProject(id);
  if (!project) notFound();
  return (
    <>
      <div className="admin-page-header">
        <Link className="text-link" href="/admin/projects">← กลับไปรายการ</Link>
        <p className="eyebrow">EDIT PROJECT</p><h1>แก้ไขโครงการ</h1>
        <p>สถานะปัจจุบัน: {project.status === "published" ? "เผยแพร่" : project.status === "draft" ? "ร่าง" : "เก็บถาวร"}</p>
      </div>
      <ProjectEditor project={project} />
    </>
  );
}

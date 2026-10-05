import Image from "next/image";
import Link from "next/link";
import { changeProjectStatusAction } from "@/features/projects/actions";
import { listAdminProjects } from "@/features/projects/project-store";

const statusLabels = { draft: "ร่าง", published: "เผยแพร่", archived: "เก็บถาวร" } as const;

export default async function AdminProjectsPage({ searchParams }: PageProps<"/admin/projects">) {
  const projects = await listAdminProjects();
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error.slice(0, 180) : null;
  return (
    <>
      <div className="admin-page-header admin-page-header--row">
        <div><p className="eyebrow">CONTENT</p><h1>โครงการ</h1><p>จัดการโครงการจริงและเผยแพร่เฉพาะข้อมูลที่ตรวจแล้ว</p></div>
        <Link href="/admin/projects/new" className="button button--accent">+ เพิ่มโครงการ</Link>
      </div>
      {error && <p className="admin-form-error" role="alert">{error}</p>}
      <div className="admin-slide-list">
        {projects.length === 0 ? <div className="admin-empty"><h2>ยังไม่มีโครงการ</h2><p>เพิ่มรายการแรกเพื่อเริ่มจัดการข้อมูลโครงการผ่านหลังบ้าน</p></div> : projects.map((project) => (
          <article className="admin-slide-card" key={project.id}>
            <div className="admin-slide-card__image">
              {project.imageKey ? <Image src={`/api/project-images/${project.imageKey}`} alt={project.imageAlt} fill sizes="(max-width: 800px) 100vw, 260px" unoptimized /> : <span className="admin-slide-card__placeholder">ไม่มีภาพปก</span>}
            </div>
            <div className="admin-slide-card__content">
              <span className={`admin-status admin-status--${project.status}`}>{statusLabels[project.status]}</span>
              <h2>{project.title}</h2>
              <p>{project.category} · {project.location} · /projects/{project.slug}</p>
              <div className="admin-slide-card__actions">
                <Link className="button button--dark" href={`/admin/projects/${project.id}`}>แก้ไข</Link>
                <Link className="button button--dark" href={`/admin/projects/${project.id}/preview`}>พรีวิว</Link>
                <form action={changeProjectStatusAction}>
                  <input type="hidden" name="id" value={project.id} />
                  <input type="hidden" name="status" value={project.status === "published" ? "draft" : "published"} />
                  <button type="submit">{project.status === "published" ? "ปิดเผยแพร่" : "เผยแพร่"}</button>
                </form>
                <form action={changeProjectStatusAction}>
                  <input type="hidden" name="id" value={project.id} />
                  <input type="hidden" name="status" value={project.status === "archived" ? "draft" : "archived"} />
                  <button type="submit">{project.status === "archived" ? "คืนค่าร่าง" : "เก็บถาวร"}</button>
                </form>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

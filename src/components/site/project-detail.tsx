import Image from "next/image";
import Link from "next/link";
import { departments } from "@/content/static/site";
import type { PublicProject } from "@/features/projects/types";
import { ShareActions } from "./share-actions";


export function ProjectDetail({ project, preview = false }: { project: PublicProject; preview?: boolean }) {
  const department = departments.find((item) => item.slug === project.departmentSlug);
  const paragraphs = project.body.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
  return (
    <>
      <section className="detail-hero">
        <div className="shell detail-hero__grid">
          <div>
            <p className="eyebrow eyebrow--light">{preview ? "PREVIEW · " : ""}{project.category}</p>
            <h1>{project.title}</h1>
            <p>{project.summary}</p>
            <Link className="text-link text-link--light" href={preview ? "/admin/projects" : "/projects"}>
              {preview ? "กลับไปหลังบ้าน" : "ดูทุกโครงการ"} <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <figure className="mock-photo article-photo">
            {project.imageSrc && <Image src={project.imageSrc} alt={project.imageAlt} fill sizes="(max-width: 720px) 100vw, 45vw" unoptimized />}
          </figure>
        </div>
      </section>
      <section className="section page-section">
        <div className="shell detail-grid">
          <div className="article-body">
            <p className="eyebrow">รายละเอียดโครงการ</p>
            {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            {project.imageSrc && <p className="article-credit">ภาพ: {project.imageCredit}</p>}
            {!preview && <ShareActions title={project.title} />}
          </div>
          <aside className="detail-aside">
            <p className="eyebrow">ข้อมูลโครงการ</p>
            <dl>
              <div><dt>ประเภท</dt><dd>{project.category}</dd></div>
              <div><dt>พื้นที่</dt><dd>{project.location}</dd></div>
              <div><dt>ฝ่ายรับผิดชอบ</dt><dd>{department?.name ?? "—"}</dd></div>
              {project.publishedAt && <div><dt>เผยแพร่</dt><dd>{new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(new Date(project.publishedAt))}</dd></div>}
            </dl>
          </aside>
        </div>
      </section>
    </>
  );
}

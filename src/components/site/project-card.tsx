import Image from "next/image";
import Link from "next/link";
import type { PublicProject } from "@/features/projects/types";
import { departments } from "@/content/static/site";

export function ProjectCard({ project }: { project: PublicProject }) {
  const department = departments.find((item) => item.slug === project.departmentSlug);
  return (
    <Link className="feature-card" href={`/projects/${project.slug}`}>
      <figure className="mock-photo article-photo">
        {project.imageSrc && <Image src={project.imageSrc} alt={project.imageAlt} fill sizes="(max-width: 720px) 100vw, 33vw" unoptimized />}
      </figure>
      <div className="feature-card__body">
        <span className="pill">{project.isDemo ? "ตัวอย่าง · " : ""}{project.category}</span>
        <h3>{project.title}</h3>
        <small className="feature-card__meta">{project.location}{department ? ` · ${department.name}` : ""}</small>
        <p>{project.summary}</p>
        <span className="feature-card__link">ดูโครงการ ↗</span>
      </div>
    </Link>
  );
}

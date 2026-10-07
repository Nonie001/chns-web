import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { departments } from "@/content/static/site";
import { departmentCardThemes, departmentProfiles } from "@/content/static/organization";

export function DepartmentCards() {
  return (
    <ul className="home-departments__cards">
      {departments.map((department, index) => {
        const theme = departmentCardThemes[department.slug];
        return (
          <li key={department.slug} className="dept-card" style={{ "--dept-accent": theme.accent } as CSSProperties}>
            <Link href={`/departments/${department.slug}`} className="dept-card__link">
              <Image className="dept-card__media" src={theme.image} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
              <span className="dept-card__overlay" aria-hidden="true" />
              <span className="dept-card__content">
                <span className="dept-card__index">{String(index + 1).padStart(2, "0")}</span>
                <strong className="dept-card__title">{department.name}</strong>
                <small className="dept-card__summary">{departmentProfiles[department.slug].summary}</small>
                <span className="dept-card__arrow" aria-hidden="true">↗</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

import "server-only";
import { createAdminRow, findAdminRow, findPublicRow, findVisibleRow, listAdminRows, listPublicRows, updateAdminRow } from "@/lib/supabase/content";
import type { Project, ProjectInput, ProjectStatus, PublicProject } from "./types";

type Row = {
  id: string; slug: string; title: string; category: string; location: string; department_slug: string;
  summary: string; body: string; image_key: string | null; image_alt: string; image_credit: string;
  image_rights_confirmed: boolean; status: ProjectStatus; is_mockup: boolean;
  created_at: string; updated_at: string; published_at: string | null;
};
const fromRow = (row: Row): Project => ({
  id: row.id, slug: row.slug, title: row.title, category: row.category, location: row.location,
  departmentSlug: row.department_slug, summary: row.summary, body: row.body, imageKey: row.image_key,
  imageAlt: row.image_alt, imageCredit: row.image_credit, imageRightsConfirmed: row.image_rights_confirmed,
  status: row.status,
  createdAt: row.created_at, updatedAt: row.updated_at, publishedAt: row.published_at,
});
const toPublic = (item: Project): PublicProject => ({
  slug: item.slug, title: item.title, category: item.category, location: item.location,
  departmentSlug: item.departmentSlug, summary: item.summary, body: item.body,
  imageSrc: item.imageKey ? `/api/project-images/${item.imageKey}` : null,
  imageAlt: item.imageAlt, imageCredit: item.imageCredit, publishedAt: item.publishedAt,
});

export async function listPublishedProjects(): Promise<PublicProject[]> {
  return (await listPublicRows<Row>("projects", "published_at")).map((row) => toPublic(fromRow(row)));
}
export async function getPublishedProject(slug: string): Promise<PublicProject | null> {
  const row = await findPublicRow<Row>("projects", "slug", slug);
  return row ? toPublic(fromRow(row)) : null;
}
export async function listAdminProjects(): Promise<Project[]> {
  return (await listAdminRows<Row>("projects", "updated_at")).map(fromRow);
}
export async function getAdminProject(id: string): Promise<Project | null> {
  const row = await findAdminRow<Row>("projects", "id", id);
  return row ? fromRow(row) : null;
}
export async function getProjectByImageKey(key: string): Promise<Project | null> {
  const row = await findVisibleRow<Row>("projects", "image_key", key);
  return row ? fromRow(row) : null;
}
export async function createProject(input: ProjectInput, imageKey?: string): Promise<string> {
  return createAdminRow("projects", "project_audit", "project_id", {
    slug: input.slug, title: input.title, category: input.category, location: input.location,
    department_slug: input.departmentSlug, summary: input.summary, body: input.body,
    image_key: imageKey ?? null, image_alt: input.imageAlt, image_credit: input.imageCredit,
    image_rights_confirmed: input.imageRightsConfirmed,
  }, { input, imageKey });
}
export async function updateProject(id: string, input: ProjectInput, imageKey?: string | null): Promise<void> {
  const before = await getAdminProject(id);
  if (!before) throw new Error("ไม่พบโครงการ");
  await updateAdminRow("projects", "project_audit", "project_id", id, {
    slug: input.slug, title: input.title, category: input.category, location: input.location,
    department_slug: input.departmentSlug, summary: input.summary, body: input.body,
    image_key: imageKey === undefined ? before.imageKey : imageKey, image_alt: input.imageAlt,
    image_credit: input.imageCredit, image_rights_confirmed: input.imageRightsConfirmed,
  }, before);
}
export async function setProjectStatus(id: string, status: ProjectStatus): Promise<void> {
  const before = await getAdminProject(id);
  if (!before) throw new Error("ไม่พบโครงการ");
  const row = await findAdminRow<Row>("projects", "id", id);
  if (status === "published" && row?.is_mockup) throw new Error("โครงการตัวอย่างเผยแพร่ไม่ได้");
  if (status === "published" && before.imageKey && (!before.imageAlt || !before.imageCredit || !before.imageRightsConfirmed)) {
    throw new Error("กรุณาระบุคำอธิบายภาพ เครดิต และยืนยันสิทธิ์ภาพก่อนเผยแพร่");
  }
  await updateAdminRow("projects", "project_audit", "project_id", id, {
    status, published_at: status === "published" ? new Date().toISOString() : before.publishedAt,
  }, before, "status");
}

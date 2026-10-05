"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { departments } from "@/content/static/site";
import { assertAdmin } from "@/lib/auth/admin-session";
import { storeProjectImage } from "@/lib/storage/project-images";
import { createProject, getAdminProject, setProjectStatus, updateProject } from "./project-store";
import type { ProjectInput, ProjectStatus } from "./types";

export type ProjectFormState = { error: string | null };

function readText(form: FormData, name: string, maxLength: number, required = true) {
  const value = form.get(name);
  const text = typeof value === "string" ? value.trim() : "";
  if (text.length > maxLength || (required && !text)) throw new Error(`กรุณาตรวจช่อง ${name}`);
  return text;
}

function parseInput(form: FormData): ProjectInput {
  const slug = readText(form, "slug", 80);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("Slug ใช้ตัวอักษรภาษาอังกฤษพิมพ์เล็ก ตัวเลข และขีดกลางเท่านั้น");
  }
  const departmentSlug = readText(form, "departmentSlug", 50);
  if (!departments.some((department) => department.slug === departmentSlug)) {
    throw new Error("ฝ่ายรับผิดชอบไม่ถูกต้อง");
  }
  return {
    slug,
    title: readText(form, "title", 160),
    category: readText(form, "category", 80),
    location: readText(form, "location", 120),
    departmentSlug,
    summary: readText(form, "summary", 400),
    body: readText(form, "body", 20000),
    imageAlt: readText(form, "imageAlt", 180, false),
    imageCredit: readText(form, "imageCredit", 180, false),
    imageRightsConfirmed: form.get("imageRightsConfirmed") === "on",
  };
}

export async function saveProjectAction(_state: ProjectFormState, form: FormData): Promise<ProjectFormState> {
  await assertAdmin();
  const id = readText(form, "id", 36, false);
  let destination = "/admin/projects";
  try {
    const input = parseInput(form);
    const before = id ? await getAdminProject(id) : null;
    if (id && !before) throw new Error("ไม่พบโครงการ");
    const file = form.get("image");
    const hasFile = file instanceof File && file.size > 0;
    const removeImage = form.get("removeImage") === "on";
    const effectiveHasImage = hasFile || (!removeImage && Boolean(before?.imageKey));
    if (effectiveHasImage && (!input.imageAlt || !input.imageCredit || !input.imageRightsConfirmed)) {
      throw new Error("ภาพต้องมีคำอธิบาย เครดิต และการยืนยันสิทธิ์เผยแพร่");
    }
    const imageKey = hasFile ? await storeProjectImage(file) : removeImage ? null : undefined;
    if (before) {
      await updateProject(before.id, input, imageKey);
      revalidatePath(`/projects/${before.slug}`);
      destination += `/${before.id}?saved=1`;
    } else {
      const createdId = await createProject(input, imageKey ?? undefined);
      destination += `/${createdId}?created=1`;
    }
    revalidatePath(`/projects/${input.slug}`);
    revalidatePath("/projects");
    revalidatePath("/search");
    revalidatePath("/");
    revalidatePath("/admin/projects");
  } catch (error) {
    const message = error instanceof Error ? error.message : "บันทึกไม่สำเร็จ";
    return { error: message.includes("UNIQUE constraint failed: projects.slug") ? "Slug นี้ถูกใช้แล้ว" : message };
  }
  redirect(destination);
}

export async function changeProjectStatusAction(form: FormData) {
  await assertAdmin();
  const id = readText(form, "id", 36);
  const status = readText(form, "status", 12);
  if (status !== "draft" && status !== "published" && status !== "archived") throw new Error("สถานะไม่ถูกต้อง");
  const project = await getAdminProject(id);
  if (!project) throw new Error("ไม่พบโครงการ");
  try { await setProjectStatus(id, status as ProjectStatus); }
  catch (error) {
    const message = error instanceof Error ? error.message : "เปลี่ยนสถานะไม่สำเร็จ";
    redirect(`/admin/projects?error=${encodeURIComponent(message)}`);
  }
  revalidatePath(`/projects/${project.slug}`);
  revalidatePath("/projects");
  revalidatePath("/search");
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

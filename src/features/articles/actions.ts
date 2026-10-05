"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin } from "@/lib/auth/admin-session";
import { storeArticleImage } from "@/lib/storage/article-images";
import { createArticle, getAdminArticle, setArticleStatus, updateArticle } from "./article-store";
import type { ArticleInput, ArticleStatus } from "./types";

export type ArticleFormState = { error: string | null };

function readText(form: FormData, name: string, maxLength: number, required = true) {
  const value = form.get(name);
  const text = typeof value === "string" ? value.trim() : "";
  if (text.length > maxLength || (required && !text)) throw new Error(`กรุณาตรวจช่อง ${name}`);
  return text;
}

function parseInput(form: FormData): ArticleInput {
  const slug = readText(form, "slug", 80);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("Slug ใช้ตัวอักษรภาษาอังกฤษพิมพ์เล็ก ตัวเลข และขีดกลางเท่านั้น");
  }
  const kind = readText(form, "kind", 5);
  if (kind !== "news" && kind !== "story") throw new Error("ประเภทบทความไม่ถูกต้อง");
  return {
    slug,
    title: readText(form, "title", 160),
    kind,
    summary: readText(form, "summary", 400),
    body: readText(form, "body", 20000),
    imageAlt: readText(form, "imageAlt", 180, false),
    imageCredit: readText(form, "imageCredit", 180, false),
    imageRightsConfirmed: form.get("imageRightsConfirmed") === "on",
  };
}

export async function saveArticleAction(_state: ArticleFormState, form: FormData): Promise<ArticleFormState> {
  await assertAdmin();
  const id = readText(form, "id", 36, false);
  let destination = "/admin/articles";
  try {
    const input = parseInput(form);
    const before = id ? await getAdminArticle(id) : null;
    if (id && !before) throw new Error("ไม่พบบทความ");
    const file = form.get("image");
    const hasFile = file instanceof File && file.size > 0;
    const removeImage = form.get("removeImage") === "on";
    const effectiveHasImage = hasFile || (!removeImage && Boolean(before?.imageKey));
    if (effectiveHasImage && (!input.imageAlt || !input.imageCredit || !input.imageRightsConfirmed)) {
      throw new Error("ภาพต้องมีคำอธิบาย เครดิต และการยืนยันสิทธิ์เผยแพร่");
    }
    const imageKey = hasFile ? await storeArticleImage(file) : removeImage ? null : undefined;
    if (before) {
      await updateArticle(before.id, input, imageKey);
      revalidatePath(`/news/${before.slug}`);
      destination += `/${before.id}?saved=1`;
    } else {
      const createdId = await createArticle(input, imageKey ?? undefined);
      destination += `/${createdId}?created=1`;
    }
    revalidatePath(`/news/${input.slug}`);
    revalidatePath("/news");
    revalidatePath("/search");
    revalidatePath("/");
    revalidatePath("/admin/articles");
  } catch (error) {
    const message = error instanceof Error ? error.message : "บันทึกไม่สำเร็จ";
    return { error: message.includes("UNIQUE constraint failed: articles.slug") ? "Slug นี้ถูกใช้แล้ว" : message };
  }
  redirect(destination);
}

export async function changeArticleStatusAction(form: FormData) {
  await assertAdmin();
  const id = readText(form, "id", 36);
  const status = readText(form, "status", 12);
  if (status !== "draft" && status !== "published" && status !== "archived") throw new Error("สถานะไม่ถูกต้อง");
  const article = await getAdminArticle(id);
  if (!article) throw new Error("ไม่พบบทความ");
  try {
    await setArticleStatus(id, status as ArticleStatus);
  } catch (error) {
    const message = error instanceof Error ? error.message : "เปลี่ยนสถานะไม่สำเร็จ";
    redirect(`/admin/articles?error=${encodeURIComponent(message)}`);
  }
  revalidatePath(`/news/${article.slug}`);
  revalidatePath("/news");
  revalidatePath("/search");
  revalidatePath("/");
  revalidatePath("/admin/articles");
}

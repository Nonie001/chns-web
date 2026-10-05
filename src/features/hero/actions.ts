"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin } from "@/lib/auth/admin-session";
import { storeHeroImage } from "@/lib/storage/hero-images";
import {
  createSlide,
  getAdminSlide,
  moveSlide,
  setSlideStatus,
  updateSlide,
} from "./slide-store";
import type { HeroSlideInput } from "./types";

export type SlideFormState = { error: string | null };

function readText(
  form: FormData,
  name: string,
  maxLength: number,
  required = true,
) {
  const value = form.get(name);
  const text = typeof value === "string" ? value.trim() : "";
  if (text.length > maxLength || (required && !text))
    throw new Error(`กรุณาตรวจช่อง ${name}`);
  return text;
}

function parseInput(form: FormData): HeroSlideInput {
  return {
    title: readText(form, "title", 110),
    imageAlt: readText(form, "imageAlt", 180),
  };
}

export async function saveSlideAction(
  _state: SlideFormState,
  form: FormData,
): Promise<SlideFormState> {
  await assertAdmin();
  const id = readText(form, "id", 36, false);
  let destination = "/admin/homepage/slides";
  try {
    const input = parseInput(form);
    if (id && !(await getAdminSlide(id))) throw new Error("ไม่พบสไลด์");
    const file = form.get("image");
    const hasFile = file instanceof File && file.size > 0;
    const mobileFile = form.get("mobileImage");
    const hasMobileFile = mobileFile instanceof File && mobileFile.size > 0;
    const removeMobileImage = form.get("removeMobileImage") === "on";
    if (!id && !hasFile) throw new Error("กรุณาเลือกภาพสไลด์");
    const imageKey = hasFile ? await storeHeroImage(file, "desktop") : undefined;
    const mobileImageKey = hasMobileFile
      ? await storeHeroImage(mobileFile, "mobile")
      : removeMobileImage ? null : undefined;
    if (id) {
      await updateSlide(id, input, imageKey, mobileImageKey);
      destination += `/${id}?saved=1`;
    } else {
      const createdId = await createSlide(input, imageKey!, mobileImageKey ?? undefined);
      destination += `/${createdId}?created=1`;
    }
    revalidatePath("/");
    revalidatePath("/admin/homepage/slides");
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "บันทึกไม่สำเร็จ",
    };
  }
  redirect(destination);
}

export async function changeSlideStatusAction(form: FormData) {
  await assertAdmin();
  const id = readText(form, "id", 36);
  const status = readText(form, "status", 12);
  if (status !== "draft" && status !== "published" && status !== "archived")
    throw new Error("สถานะไม่ถูกต้อง");
  await setSlideStatus(id, status);
  revalidatePath("/");
  revalidatePath("/admin/homepage/slides");
}

export async function moveSlideAction(form: FormData) {
  await assertAdmin();
  const id = readText(form, "id", 36);
  const direction = readText(form, "direction", 4);
  if (direction !== "up" && direction !== "down")
    throw new Error("ทิศทางไม่ถูกต้อง");
  await moveSlide(id, direction);
  revalidatePath("/");
  revalidatePath("/admin/homepage/slides");
}

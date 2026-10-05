"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin } from "@/lib/auth/admin-session";
import { storeReportFile } from "@/lib/storage/report-files";
import { createReport, getAdminReport, setReportStatus, updateReport } from "./report-store";
import type { ReportInput, ReportStatus } from "./types";

export type ReportFormState = { error: string | null };

function readText(form: FormData, name: string, maxLength: number, required = true) {
  const value = form.get(name);
  const text = typeof value === "string" ? value.trim() : "";
  if (text.length > maxLength || (required && !text)) throw new Error(`กรุณาตรวจช่อง ${name}`);
  return text;
}

function parseInput(form: FormData): ReportInput {
  const slug = readText(form, "slug", 80);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("Slug ใช้ตัวอักษรภาษาอังกฤษพิมพ์เล็ก ตัวเลข และขีดกลางเท่านั้น");
  const year = Number(readText(form, "year", 4));
  if (!Number.isInteger(year) || year < 1900 || year > 2100) throw new Error("ปีรายงานไม่ถูกต้อง");
  return {
    slug,
    title: readText(form, "title", 160),
    kind: readText(form, "kind", 80),
    year,
    summary: readText(form, "summary", 400),
    source: readText(form, "source", 180),
    fileRightsConfirmed: form.get("fileRightsConfirmed") === "on",
  };
}

export async function saveReportAction(_state: ReportFormState, form: FormData): Promise<ReportFormState> {
  await assertAdmin();
  const id = readText(form, "id", 36, false);
  let destination = "/admin/reports";
  try {
    const input = parseInput(form);
    const before = id ? await getAdminReport(id) : null;
    if (id && !before) throw new Error("ไม่พบรายงาน");
    const file = form.get("file");
    const hasFile = file instanceof File && file.size > 0;
    const removeFile = form.get("removeFile") === "on";
    const effectiveHasFile = hasFile || (!removeFile && Boolean(before?.fileKey));
    if (effectiveHasFile && !input.fileRightsConfirmed) throw new Error("กรุณายืนยันสิทธิ์เผยแพร่ไฟล์ PDF");
    if (before?.status === "published" && removeFile && !hasFile) throw new Error("ปิดเผยแพร่ก่อนลบไฟล์ PDF");
    const fileKey = hasFile ? await storeReportFile(file) : removeFile ? null : undefined;
    if (before) {
      await updateReport(before.id, input, fileKey);
      revalidatePath(`/reports/${before.slug}`);
      destination += `/${before.id}?saved=1`;
    } else {
      const createdId = await createReport(input, fileKey ?? undefined);
      destination += `/${createdId}?created=1`;
    }
    revalidatePath(`/reports/${input.slug}`);
    revalidatePath("/reports");
    revalidatePath("/admin/reports");
  } catch (error) {
    const message = error instanceof Error ? error.message : "บันทึกไม่สำเร็จ";
    return { error: message.includes("UNIQUE constraint failed: reports.slug") ? "Slug นี้ถูกใช้แล้ว" : message };
  }
  redirect(destination);
}

export async function changeReportStatusAction(form: FormData) {
  await assertAdmin();
  const id = readText(form, "id", 36);
  const status = readText(form, "status", 12);
  if (status !== "draft" && status !== "published" && status !== "archived") throw new Error("สถานะไม่ถูกต้อง");
  const report = await getAdminReport(id);
  if (!report) throw new Error("ไม่พบรายงาน");
  try { await setReportStatus(id, status as ReportStatus); }
  catch (error) {
    const message = error instanceof Error ? error.message : "เปลี่ยนสถานะไม่สำเร็จ";
    redirect(`/admin/reports?error=${encodeURIComponent(message)}`);
  }
  revalidatePath(`/reports/${report.slug}`);
  revalidatePath("/reports");
  revalidatePath("/admin/reports");
}

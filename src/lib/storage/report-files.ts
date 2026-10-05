import "server-only";
import { randomUUID } from "node:crypto";
import { downloadStoredFile, uploadStoredFile } from "./supabase-files";

export function isReportFileKey(key: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.pdf$/.test(key);
}

export async function storeReportFile(file: File): Promise<string> {
  if (!file.size || file.size > 15 * 1024 * 1024) throw new Error("PDF ต้องมีขนาดไม่เกิน 15 MB");
  if (file.type !== "application/pdf" && (file.type !== "" || !file.name.toLowerCase().endsWith(".pdf"))) {
    throw new Error("รองรับเฉพาะไฟล์ PDF");
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.subarray(0, 5).toString("ascii") !== "%PDF-") throw new Error("ไฟล์ไม่ใช่ PDF ที่ถูกต้อง");
  const key = `${randomUUID()}.pdf`;
  return uploadStoredFile("report-files", key, bytes, "application/pdf");
}

export async function readReportFile(key: string, admin = false) {
  if (!isReportFileKey(key)) return null;
  return downloadStoredFile("report-files", key, admin);
}

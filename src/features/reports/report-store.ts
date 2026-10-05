import "server-only";
import { createAdminRow, findAdminRow, findPublicRow, findVisibleRow, listAdminRows, listPublicRows, updateAdminRow } from "@/lib/supabase/content";
import type { PublicReport, Report, ReportInput, ReportStatus } from "./types";

type Row = { id: string; slug: string; title: string; kind: string; report_year: number; summary: string;
  source: string; file_key: string | null; file_rights_confirmed: boolean; status: ReportStatus;
  is_mockup: boolean; created_at: string; updated_at: string; published_at: string | null };
const fromRow = (row: Row): Report => ({ id: row.id, slug: row.slug, title: row.title, kind: row.kind,
  year: row.report_year, summary: row.summary, source: row.source, fileKey: row.file_key,
  fileRightsConfirmed: row.file_rights_confirmed, status: row.status,
  createdAt: row.created_at, updatedAt: row.updated_at, publishedAt: row.published_at });
const toPublic = (item: Report): PublicReport => ({ slug: item.slug, title: item.title, kind: item.kind,
  year: item.year, summary: item.summary, source: item.source, publishedAt: item.publishedAt,
  fileUrl: `/api/report-files/${item.fileKey}` });

export async function listPublishedReports(): Promise<PublicReport[]> {
  return (await listPublicRows<Row>("reports", "report_year")).filter((row) => row.file_key).map((row) => toPublic(fromRow(row)));
}
export async function getPublishedReport(slug: string): Promise<PublicReport | null> {
  const row = await findPublicRow<Row>("reports", "slug", slug);
  return row?.file_key ? toPublic(fromRow(row)) : null;
}
export async function listAdminReports(): Promise<Report[]> {
  return (await listAdminRows<Row>("reports", "updated_at")).map(fromRow);
}
export async function getAdminReport(id: string): Promise<Report | null> {
  const row = await findAdminRow<Row>("reports", "id", id);
  return row ? fromRow(row) : null;
}
export async function getReportByFileKey(key: string): Promise<Report | null> {
  const row = await findVisibleRow<Row>("reports", "file_key", key);
  return row ? fromRow(row) : null;
}
export async function createReport(input: ReportInput, fileKey?: string): Promise<string> {
  return createAdminRow("reports", "report_audit", "report_id", {
    slug: input.slug, title: input.title, kind: input.kind, report_year: input.year,
    summary: input.summary, source: input.source, file_key: fileKey ?? null,
    file_rights_confirmed: input.fileRightsConfirmed,
  }, { input, fileKey });
}
export async function updateReport(id: string, input: ReportInput, fileKey?: string | null): Promise<void> {
  const before = await getAdminReport(id);
  if (!before) throw new Error("ไม่พบรายงาน");
  await updateAdminRow("reports", "report_audit", "report_id", id, {
    slug: input.slug, title: input.title, kind: input.kind, report_year: input.year,
    summary: input.summary, source: input.source, file_key: fileKey === undefined ? before.fileKey : fileKey,
    file_rights_confirmed: input.fileRightsConfirmed,
  }, before);
}
export async function setReportStatus(id: string, status: ReportStatus): Promise<void> {
  const before = await getAdminReport(id);
  if (!before) throw new Error("ไม่พบรายงาน");
  const row = await findAdminRow<Row>("reports", "id", id);
  if (status === "published" && row?.is_mockup) throw new Error("รายงานตัวอย่างเผยแพร่ไม่ได้");
  if (status === "published" && (!before.fileKey || !before.fileRightsConfirmed || !before.source)) {
    throw new Error("กรุณาแนบ PDF ระบุเจ้าของข้อมูล และยืนยันสิทธิ์ก่อนเผยแพร่");
  }
  await updateAdminRow("reports", "report_audit", "report_id", id, {
    status, published_at: status === "published" ? new Date().toISOString() : before.publishedAt,
  }, before, "status");
}

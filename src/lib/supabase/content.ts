import "server-only";
import { randomUUID } from "node:crypto";
import { assertAdmin, getAdminSession, requireAdminSession } from "@/lib/auth/admin-session";
import { createSupabaseServerClient } from "./server";
import { createSupabasePublicClient } from "./public";

export type ContentTable = "hero_slides" | "articles" | "projects" | "reports" | "partners";
export type AuditTable = "hero_slide_audit" | "article_audit" | "project_audit" | "report_audit" | "partner_audit";

export async function listPublicRows<T>(table: ContentTable, order: string, ascending = false): Promise<T[]> {
  const { data, error } = await createSupabasePublicClient().from(table).select("*")
    .eq("status", "published").order(order, { ascending });
  if (error) throw new Error(error.message);
  return data as T[];
}

export async function findPublicRow<T>(table: ContentTable, field: string, value: string): Promise<T | null> {
  const { data, error } = await createSupabasePublicClient().from(table).select("*")
    .eq(field, value).eq("status", "published").maybeSingle();
  if (error) throw new Error(error.message);
  return data as T | null;
}

export async function listAdminRows<T>(table: ContentTable, order: string, ascending = false): Promise<T[]> {
  await requireAdminSession();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from(table).select("*").order(order, { ascending });
  if (error) throw new Error(error.message);
  return data as T[];
}

export async function findAdminRow<T>(table: ContentTable, field: string, value: string): Promise<T | null> {
  await requireAdminSession();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from(table).select("*").eq(field, value).maybeSingle();
  if (error) throw new Error(error.message);
  return data as T | null;
}

export async function findVisibleRow<T>(table: ContentTable, field: string, value: string): Promise<T | null> {
  const publicRow = await findPublicRow<T>(table, field, value);
  if (publicRow) return publicRow;
  return (await getAdminSession()) ? findAdminRow<T>(table, field, value) : null;
}

async function appendAudit(table: AuditTable, key: string, id: string, actorId: string, action: string, details: unknown) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from(table).insert({ id: randomUUID(), [key]: id, actor_id: actorId, action, details });
  if (error) throw new Error(error.message);
}

export async function createAdminRow(table: ContentTable, auditTable: AuditTable, auditKey: string, values: Record<string, unknown>, details: unknown) {
  const actor = await assertAdmin();
  const supabase = await createSupabaseServerClient();
  const id = randomUUID();
  const { error } = await supabase.from(table).insert({ id, ...values, status: "draft", created_by: actor.user.id, updated_by: actor.user.id });
  if (error) throw new Error(error.message);
  await appendAudit(auditTable, auditKey, id, actor.user.id, "create", details);
  return id;
}

export async function updateAdminRow(table: ContentTable, auditTable: AuditTable, auditKey: string, id: string, values: Record<string, unknown>, before: unknown, action = "update") {
  const actor = await assertAdmin();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from(table).update({ ...values, updated_by: actor.user.id, updated_at: new Date().toISOString() })
    .eq("id", id).select("id").maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("ไม่พบรายการ");
  await appendAudit(auditTable, auditKey, id, actor.user.id, action, { before, after: values });
}

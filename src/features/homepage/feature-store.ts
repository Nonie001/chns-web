import "server-only";
import { randomUUID } from "node:crypto";
import { assertAdmin, requireAdminSession } from "@/lib/auth/admin-session";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type FeatureSlot = "article_1" | "project_1" | "project_2";
export type FeatureSelection = Record<FeatureSlot, string | null>;
export type FeatureOption = { id: string; title: string; slug: string };
const slots: FeatureSlot[] = ["article_1", "project_1", "project_2"];

async function readSelection(admin = false): Promise<FeatureSelection> {
  const client = admin ? await createSupabaseServerClient() : createSupabasePublicClient();
  const { data, error } = await client.from("homepage_features").select("slot, content_id");
  if (error) throw new Error(error.message);
  const selection: FeatureSelection = { article_1: null, project_1: null, project_2: null };
  for (const row of data) if (slots.includes(row.slot as FeatureSlot)) selection[row.slot as FeatureSlot] = row.content_id;
  return selection;
}

async function listOptions(table: "articles" | "projects", admin = false): Promise<FeatureOption[]> {
  const client = admin ? await createSupabaseServerClient() : createSupabasePublicClient();
  const { data, error } = await client.from(table).select("id, title, slug")
    .eq("status", "published").order("published_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function getPublicFeatureSlugs() {
  const [selection, articles, projects] = await Promise.all([
    readSelection(), listOptions("articles"), listOptions("projects"),
  ]);
  return { article: articles.find((item) => item.id === selection.article_1)?.slug ?? null,
    projects: [selection.project_1, selection.project_2]
      .map((id) => projects.find((item) => item.id === id)?.slug)
      .filter((slug): slug is string => Boolean(slug)) };
}

export async function getAdminFeatureEditorData() {
  await requireAdminSession();
  const [selection, articles, projects] = await Promise.all([
    readSelection(true), listOptions("articles", true), listOptions("projects", true),
  ]);
  return { selection, articles, projects };
}

export async function saveFeatureSelection(next: FeatureSelection) {
  const actor = await assertAdmin();
  const [articles, projects, before] = await Promise.all([
    listOptions("articles", true), listOptions("projects", true), readSelection(true),
  ]);
  if (next.article_1 && !articles.some((item) => item.id === next.article_1)) throw new Error("ข่าวที่เลือกไม่ได้เผยแพร่อยู่");
  for (const slot of ["project_1", "project_2"] as const) {
    if (next[slot] && !projects.some((item) => item.id === next[slot])) throw new Error("โครงการที่เลือกไม่ได้เผยแพร่อยู่");
  }
  if (next.project_1 && next.project_1 === next.project_2) throw new Error("เลือกโครงการซ้ำกันไม่ได้");
  const client = await createSupabaseServerClient();
  for (const slot of slots) {
    const result = next[slot]
      ? await client.from("homepage_features").upsert({ slot, content_id: next[slot], updated_by: actor.user.id, updated_at: new Date().toISOString() })
      : await client.from("homepage_features").delete().eq("slot", slot);
    if (result.error) throw new Error(result.error.message);
  }
  const { error } = await client.from("homepage_feature_audit").insert({
    id: randomUUID(), actor_id: actor.user.id, before_json: before, after_json: next,
  });
  if (error) throw new Error(error.message);
}

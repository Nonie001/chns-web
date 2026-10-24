import "server-only";
import { randomUUID } from "node:crypto";
import { assertAdmin, requireAdminSession } from "@/lib/auth/admin-session";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { projectSlots } from "./slots";

export type FeatureSlot = "article_1" | (typeof projectSlots)[number];
export type FeatureSelection = Record<FeatureSlot, string | null>;
export type FeatureOption = { id: string; title: string; slug: string; imageSrc: string | null };
const slots: FeatureSlot[] = ["article_1", ...projectSlots];

async function readSelection(admin = false): Promise<FeatureSelection> {
  const client = admin ? await createSupabaseServerClient() : createSupabasePublicClient();
  const { data, error } = await client.from("homepage_features").select("slot, content_id");
  if (error) throw new Error(error.message);
  const selection = Object.fromEntries(slots.map((slot) => [slot, null])) as FeatureSelection;
  for (const row of data) if (slots.includes(row.slot as FeatureSlot)) selection[row.slot as FeatureSlot] = row.content_id;
  return selection;
}

async function listOptions(table: "articles" | "projects", admin = false): Promise<FeatureOption[]> {
  const client = admin ? await createSupabaseServerClient() : createSupabasePublicClient();
  const { data, error } = await client.from(table).select("id, title, slug, image_key")
    .eq("status", "published").order("published_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data.map((item) => ({ id: item.id, title: item.title, slug: item.slug,
    imageSrc: item.image_key ? `/api/${table === "articles" ? "article-images" : "project-images"}/${item.image_key}` : null }));
}

export async function getPublicFeatureSlugs() {
  const [selection, articles, projects] = await Promise.all([
    readSelection(), listOptions("articles"), listOptions("projects"),
  ]);
  return { article: articles.find((item) => item.id === selection.article_1)?.slug ?? null,
    projects: projectSlots.map((slot) => projects.find((item) => item.id === selection[slot])?.slug ?? null) };
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
  for (const slot of projectSlots) {
    if (next[slot] && !projects.some((item) => item.id === next[slot])) throw new Error("โครงการที่เลือกไม่ได้เผยแพร่อยู่");
  }
  const client = await createSupabaseServerClient();
  const updatedAt = new Date().toISOString();
  const filled = slots.filter((slot) => next[slot]).map((slot) => ({
    slot, content_id: next[slot], updated_by: actor.user.id, updated_at: updatedAt,
  }));
  const empty = slots.filter((slot) => !next[slot]);
  if (filled.length) {
    const { error } = await client.from("homepage_features").upsert(filled);
    if (error) throw new Error(error.message);
  }
  if (empty.length) {
    const { error } = await client.from("homepage_features").delete().in("slot", empty);
    if (error) throw new Error(error.message);
  }
  const { error } = await client.from("homepage_feature_audit").insert({
    id: randomUUID(), actor_id: actor.user.id, before_json: before, after_json: next,
  });
  if (error) throw new Error(error.message);
}

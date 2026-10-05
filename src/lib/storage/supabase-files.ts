import "server-only";
import { assertAdmin } from "@/lib/auth/admin-session";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type StorageArea = "hero-images" | "article-images" | "project-images" | "report-files" | "partner-logos";
const bucket = "chns-content";

export async function uploadStoredFile(area: StorageArea, key: string, bytes: Buffer, contentType: string) {
  await assertAdmin();
  const client = await createSupabaseServerClient();
  const { error } = await client.storage.from(bucket).upload(`${area}/${key}`, bytes, { contentType, upsert: false });
  if (error) throw new Error(error.message);
  return key;
}

export async function downloadStoredFile(area: StorageArea, key: string, admin: boolean) {
  const client = admin ? await createSupabaseServerClient() : createSupabasePublicClient();
  const { data, error } = await client.storage.from(bucket).download(`${area}/${key}`);
  if (error || !data) return null;
  return Buffer.from(await data.arrayBuffer());
}

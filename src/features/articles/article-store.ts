import "server-only";
import { createAdminRow, findAdminRow, findPublicRow, findVisibleRow, listAdminRows, listPublicRows, updateAdminRow } from "@/lib/supabase/content";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import type { Article, ArticleInput, ArticleStatus, PublicArticle } from "./types";

type ArticleRow = {
  id: string; slug: string; title: string; kind: Article["kind"]; summary: string; body: string;
  image_key: string | null; image_alt: string; image_credit: string; image_rights_confirmed: boolean;
  status: ArticleStatus; is_mockup: boolean; showcase_visible: boolean;
  created_at: string; updated_at: string; published_at: string | null;
};

function fromRow(row: ArticleRow): Article {
  return { id: row.id, slug: row.slug, title: row.title, kind: row.kind, summary: row.summary, body: row.body,
    imageKey: row.image_key, imageAlt: row.image_alt, imageCredit: row.image_credit,
    imageRightsConfirmed: row.image_rights_confirmed, status: row.status,
    isMockup: row.is_mockup, showcaseVisible: row.showcase_visible,
    createdAt: row.created_at, updatedAt: row.updated_at, publishedAt: row.published_at };
}

function toPublic(article: Article): PublicArticle {
  return { slug: article.slug, title: article.title, kind: article.kind, summary: article.summary,
    body: article.body, imageSrc: article.imageKey ? `/api/article-images/${article.imageKey}` : null,
    imageAlt: article.imageAlt, imageCredit: article.imageCredit, publishedAt: article.publishedAt,
    isDemo: article.isMockup && article.showcaseVisible };
}

export async function listPublishedArticles(): Promise<PublicArticle[]> {
  return (await listPublicRows<ArticleRow>("articles", "published_at")).map((row) => toPublic(fromRow(row)));
}

export async function getPublishedArticle(slug: string): Promise<PublicArticle | null> {
  const row = await findPublicRow<ArticleRow>("articles", "slug", slug);
  return row ? toPublic(fromRow(row)) : null;
}

export async function listShowcaseArticles(): Promise<PublicArticle[]> {
  const { data, error } = await createSupabasePublicClient().from("articles").select("*")
    .eq("status", "draft").eq("is_mockup", true).eq("showcase_visible", true)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as ArticleRow[]).map((row) => toPublic(fromRow(row)));
}

export async function listDisplayArticles(): Promise<PublicArticle[]> {
  const published = await listPublishedArticles();
  return published.length ? published : listShowcaseArticles();
}

export async function getDisplayArticle(slug: string): Promise<PublicArticle | null> {
  const published = await getPublishedArticle(slug);
  if (published) return published;
  const { data, error } = await createSupabasePublicClient().from("articles").select("*")
    .eq("slug", slug).eq("status", "draft").eq("is_mockup", true).eq("showcase_visible", true).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? toPublic(fromRow(data as ArticleRow)) : null;
}

export async function listAdminArticles(): Promise<Article[]> {
  return (await listAdminRows<ArticleRow>("articles", "updated_at")).map(fromRow);
}

export async function getAdminArticle(id: string): Promise<Article | null> {
  const row = await findAdminRow<ArticleRow>("articles", "id", id);
  return row ? fromRow(row) : null;
}

export async function getArticleByImageKey(key: string): Promise<Article | null> {
  const { data, error } = await createSupabasePublicClient().from("articles").select("*")
    .eq("image_key", key).eq("status", "draft").eq("is_mockup", true).eq("showcase_visible", true).maybeSingle();
  if (error) throw new Error(error.message);
  if (data) return fromRow(data as ArticleRow);
  const row = await findVisibleRow<ArticleRow>("articles", "image_key", key);
  return row ? fromRow(row) : null;
}

export async function createArticle(input: ArticleInput, imageKey?: string): Promise<string> {
  return createAdminRow("articles", "article_audit", "article_id", {
    slug: input.slug, title: input.title, kind: input.kind, summary: input.summary, body: input.body,
    image_key: imageKey ?? null, image_alt: input.imageAlt, image_credit: input.imageCredit,
    image_rights_confirmed: input.imageRightsConfirmed,
  }, { input, imageKey });
}

export async function updateArticle(id: string, input: ArticleInput, imageKey?: string | null): Promise<void> {
  const before = await getAdminArticle(id);
  if (!before) throw new Error("ไม่พบบทความ");
  await updateAdminRow("articles", "article_audit", "article_id", id, {
    slug: input.slug, title: input.title, kind: input.kind, summary: input.summary, body: input.body,
    image_key: imageKey === undefined ? before.imageKey : imageKey, image_alt: input.imageAlt,
    image_credit: input.imageCredit, image_rights_confirmed: input.imageRightsConfirmed,
  }, before);
}

export async function setArticleStatus(id: string, status: ArticleStatus): Promise<void> {
  const before = await getAdminArticle(id);
  if (!before) throw new Error("ไม่พบบทความ");
  const row = await findAdminRow<ArticleRow>("articles", "id", id);
  if (status === "published" && row?.is_mockup) throw new Error("เนื้อหาตัวอย่างเผยแพร่ไม่ได้");
  if (status === "published" && before.imageKey && (!before.imageAlt || !before.imageCredit || !before.imageRightsConfirmed)) {
    throw new Error("กรุณาระบุคำอธิบายภาพ เครดิต และยืนยันสิทธิ์ภาพก่อนเผยแพร่");
  }
  await updateAdminRow("articles", "article_audit", "article_id", id, {
    status, published_at: status === "published" ? new Date().toISOString() : before.publishedAt,
  }, before, "status");
}

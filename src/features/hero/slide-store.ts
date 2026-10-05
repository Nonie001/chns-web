import "server-only";
import { createAdminRow, findAdminRow, findVisibleRow, listAdminRows, listPublicRows, updateAdminRow } from "@/lib/supabase/content";
import type { HeroCarouselItem, HeroSlide, HeroSlideInput } from "./types";

type Row = { id: string; title: string; image_key: string; mobile_image_key: string | null;
  image_alt: string; status: HeroSlide["status"]; is_mockup: boolean; position: number;
  created_by: string | null; created_at: string; updated_at: string; published_at: string | null };
const fromRow = (row: Row): HeroSlide => ({ id: row.id, title: row.title, imageKey: row.image_key,
  mobileImageKey: row.mobile_image_key, imageAlt: row.image_alt, status: row.status, position: row.position,
  createdBy: row.created_by ?? "", createdAt: row.created_at, updatedAt: row.updated_at,
  publishedAt: row.published_at, eyebrow: "", highlight: "", description: "", primaryLabel: "",
  primaryHref: "", secondaryLabel: "", secondaryHref: "" });

export async function listPublishedSlides(): Promise<HeroCarouselItem[]> {
  const rows = await listPublicRows<Row>("hero_slides", "position", true);
  return rows.map((row) => ({ id: row.id, imageSrc: `/api/hero-images/${row.image_key}`,
    mobileImageSrc: row.mobile_image_key ? `/api/hero-images/${row.mobile_image_key}` : null,
    imageAlt: row.image_alt }));
}
export async function listAdminSlides(): Promise<HeroSlide[]> {
  return (await listAdminRows<Row>("hero_slides", "position", true)).map(fromRow);
}
export async function getAdminSlide(id: string): Promise<HeroSlide | null> {
  const row = await findAdminRow<Row>("hero_slides", "id", id);
  return row ? fromRow(row) : null;
}
export async function getSlideByImageKey(key: string): Promise<HeroSlide | null> {
  const row = await findVisibleRow<Row>("hero_slides", "image_key", key)
    ?? await findVisibleRow<Row>("hero_slides", "mobile_image_key", key);
  return row ? fromRow(row) : null;
}
export async function createSlide(input: HeroSlideInput, imageKey: string, mobileImageKey?: string): Promise<string> {
  const rows = await listAdminRows<Row>("hero_slides", "position", false);
  const position = (rows[0]?.position ?? 0) + 1;
  return createAdminRow("hero_slides", "hero_slide_audit", "slide_id", {
    title: input.title, image_key: imageKey, mobile_image_key: mobileImageKey ?? null,
    image_alt: input.imageAlt, position,
  }, { input, imageKey, mobileImageKey });
}
export async function updateSlide(id: string, input: HeroSlideInput, imageKey?: string, mobileImageKey?: string | null) {
  const before = await getAdminSlide(id);
  if (!before) throw new Error("ไม่พบสไลด์");
  await updateAdminRow("hero_slides", "hero_slide_audit", "slide_id", id, {
    title: input.title, image_key: imageKey ?? before.imageKey,
    mobile_image_key: mobileImageKey === undefined ? before.mobileImageKey : mobileImageKey,
    image_alt: input.imageAlt,
  }, before);
}
export async function setSlideStatus(id: string, status: HeroSlide["status"]) {
  const before = await getAdminSlide(id);
  if (!before) throw new Error("ไม่พบสไลด์");
  const row = await findAdminRow<Row>("hero_slides", "id", id);
  if (status === "published" && row?.is_mockup) throw new Error("สไลด์ตัวอย่างเผยแพร่ไม่ได้");
  await updateAdminRow("hero_slides", "hero_slide_audit", "slide_id", id, {
    status, published_at: status === "published" ? new Date().toISOString() : before.publishedAt,
  }, before, "status");
}
export async function moveSlide(id: string, direction: "up" | "down") {
  const rows = await listAdminRows<Row>("hero_slides", "position", true);
  const index = rows.findIndex((row) => row.id === id);
  const neighbor = rows[index + (direction === "up" ? -1 : 1)];
  if (index < 0) throw new Error("ไม่พบสไลด์");
  if (!neighbor) return;
  await updateAdminRow("hero_slides", "hero_slide_audit", "slide_id", id,
    { position: neighbor.position }, { position: rows[index].position }, "move");
  await updateAdminRow("hero_slides", "hero_slide_audit", "slide_id", neighbor.id,
    { position: rows[index].position }, { position: neighbor.position }, "move");
}

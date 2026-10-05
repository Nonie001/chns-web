import "server-only";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { downloadStoredFile, uploadStoredFile } from "./supabase-files";

const acceptedFormats = new Set(["jpeg", "png", "webp"]);
export type ContentImageArea = "article-images" | "project-images";

export function isContentImageKey(key: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.webp$/.test(key);
}

export async function storeContentImage(file: File, area: ContentImageArea): Promise<string> {
  if (!file.size || file.size > 5 * 1024 * 1024) throw new Error("ภาพต้องมีขนาดไม่เกิน 5 MB");
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("รองรับเฉพาะภาพ JPG, PNG และ WebP");
  }
  const image = sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 30_000_000 });
  const metadata = await image.metadata();
  if (!acceptedFormats.has(metadata.format ?? "") || !metadata.width || !metadata.height || metadata.width < 800) {
    throw new Error("กรุณาใช้ภาพกว้างอย่างน้อย 800 พิกเซล");
  }
  const key = `${randomUUID()}.webp`;
  const output = await image.rotate().resize({ width: 1800, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
  return uploadStoredFile(area, key, output, "image/webp");
}

export async function readContentImage(key: string, area: ContentImageArea, admin = false) {
  if (!isContentImageKey(key)) return null;
  return downloadStoredFile(area, key, admin);
}

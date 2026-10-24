import "server-only";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { downloadStoredFile, uploadStoredFile } from "./supabase-files";

const formats = new Set(["jpeg", "png", "webp"]);

export function isPartnerLogoKey(key: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.webp$/.test(key);
}

export async function storePartnerLogo(file: File) {
  if (!file.size || file.size > 5 * 1024 * 1024) throw new Error("โลโก้ต้องมีขนาดไม่เกิน 5 MB");
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("รองรับโลโก้ JPG, PNG และ WebP");
  const image = sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 20_000_000 });
  const metadata = await image.metadata();
  if (!formats.has(metadata.format ?? "") || !metadata.width || !metadata.height || metadata.width < 200 || metadata.height < 100) {
    throw new Error("โลโก้ต้องกว้างอย่างน้อย 200 px และสูงอย่างน้อย 100 px");
  }
  const key = `${randomUUID()}.webp`;
  const output = await image.rotate().resize({ width: 420, height: 320, fit: "inside", withoutEnlargement: true }).webp({ quality: 82, effort: 6 }).toBuffer();
  return uploadStoredFile("partner-logos", key, output, "image/webp");
}

export async function readPartnerLogo(key: string, admin = false) {
  if (!isPartnerLogoKey(key)) return null;
  return downloadStoredFile("partner-logos", key, admin);
}

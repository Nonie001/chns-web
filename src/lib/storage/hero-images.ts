import "server-only";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { downloadStoredFile, uploadStoredFile } from "./supabase-files";

const acceptedFormats = new Set(["jpeg", "png", "webp"]);

export function isHeroImageKey(key: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.webp$/.test(
    key,
  );
}

export async function storeHeroImage(file: File, variant: "desktop" | "mobile" = "desktop") {
  if (file.size === 0 || file.size > 5 * 1024 * 1024) {
    throw new Error("ภาพต้องมีขนาดไม่เกิน 5 MB");
  }
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("รองรับเฉพาะภาพ JPG, PNG และ WebP");
  }
  const source = Buffer.from(await file.arrayBuffer());
  const image = sharp(source, { limitInputPixels: 30_000_000 });
  const metadata = await image.metadata();
  if (
    !acceptedFormats.has(metadata.format ?? "") ||
    !metadata.width ||
    !metadata.height ||
    (variant === "desktop"
      ? metadata.width < 1200 || metadata.width / metadata.height < 1.4
      : metadata.width < 600 || metadata.width / metadata.height > 1.4)
  ) {
    throw new Error(variant === "desktop"
      ? "กรุณาใช้ภาพแนวนอนกว้างอย่างน้อย 1200 พิกเซล"
      : "กรุณาใช้ภาพมือถือกว้างอย่างน้อย 600 พิกเซลและอัตราส่วนไม่เกิน 1.4:1");
  }
  const key = `${randomUUID()}.webp`;
  const output = await image
    .rotate()
    .resize({ width: variant === "desktop" ? 2400 : 1200, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  return uploadStoredFile("hero-images", key, output, "image/webp");
}

export async function readHeroImage(key: string, admin = false) {
  if (!isHeroImageKey(key)) return null;
  return downloadStoredFile("hero-images", key, admin);
}

import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import sharp from "sharp";

const source = process.argv[2];
if (!source) {
  console.error("วิธีใช้: node scripts/optimize-partner-logos.mjs /path/to/extracted-drive-files");
  process.exit(1);
}

const inputDirectory = resolve(source);
const outputDirectory = resolve("assets/partner-logos");
await mkdir(outputDirectory, { recursive: true });
const sourceNames = (await readdir(inputDirectory)).filter((name) => /^IMG_\d+\.(?:JPG|JPEG|PNG)$/i.test(name)).sort();
if (sourceNames.length === 0) throw new Error("ไม่พบไฟล์ IMG_*.JPG/PNG");

const screenshotCrops = {
  "IMG_0599.PNG": { left: 0, top: 263, width: 1620, height: 1634 },
  "IMG_0611.PNG": { left: 0, top: 315, width: 1620, height: 1530 },
};

const manifest = [];
for (const sourceName of sourceNames) {
  const input = await readFile(join(inputDirectory, sourceName));
  const raw = sharp(input, { limitInputPixels: 20_000_000 }).rotate();
  const metadata = await raw.metadata();
  if (!["jpeg", "png", "webp"].includes(metadata.format ?? "")) throw new Error(`ชนิดภาพไม่รองรับ: ${sourceName}`);
  const crop = screenshotCrops[sourceName];
  const image = crop ? raw.extract(crop) : raw.trim({ background: "#ffffff", threshold: 14 });
  const output = await image.resize({ width: 420, height: 320, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 }).toBuffer();
  const outputName = sourceName.replace(/\.[^.]+$/, ".webp").toLowerCase();
  await writeFile(join(outputDirectory, outputName), output);
  const result = await sharp(output).metadata();
  manifest.push({ sourceName, file: outputName, originalBytes: input.length, bytes: output.length, width: result.width, height: result.height });
}
await writeFile(join(outputDirectory, "manifest.json"), JSON.stringify({ source: "CHNS Google Drive partner logo folder", logos: manifest }, null, 2) + "\n");
const original = manifest.reduce((sum, item) => sum + item.originalBytes, 0);
const optimized = manifest.reduce((sum, item) => sum + item.bytes, 0);
console.log(`${manifest.length} logos: ${(original / 1024 / 1024).toFixed(2)} MB → ${(optimized / 1024 / 1024).toFixed(2)} MB`);

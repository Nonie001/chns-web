import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const apply = process.argv.includes("--apply");
const root = process.cwd();
const databasePath = process.env.CHNS_DATABASE_PATH ?? join(root, ".data", "chns.sqlite");
const env = Object.fromEntries((await readFile(join(root, ".env.local"), "utf8")).split("\n")
  .filter((line) => line.includes("=") && !line.trimStart().startsWith("#"))
  .map((line) => { const index = line.indexOf("="); return [line.slice(0, index), line.slice(index + 1)]; }));
const ref = JSON.parse(Buffer.from(env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.split(".")[1], "base64url").toString()).ref;
if (env.NEXT_PUBLIC_SUPABASE_URL !== `https://${ref}.supabase.co`) throw new Error("Supabase URL และ key ไม่ตรงโปรเจกต์");
if (!existsSync(databasePath)) throw new Error("ไม่พบฐานข้อมูลเดิม");
const sqlite = new DatabaseSync(databasePath, { readOnly: true });
const partners = sqlite.prepare("select * from partners order by position, created_at").all();
console.log(`Local partners: ${partners.length}; mock slides: 3; mock projects: 3; mock articles: 3; mock reports: 3`);
if (!apply) {
  console.log("Dry run only. Use --apply to import.");
  process.exit(0);
}

// CLI credentials are used only by this one-time import and never written to app env.
const keys = JSON.parse(execFileSync("supabase", ["projects", "api-keys", "--project-ref", ref, "--reveal", "--output", "json"],
  { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }));
const serviceKey = keys.find((item) => item.name === "service_role")?.api_key;
if (!serviceKey) throw new Error("CLI account cannot read the service key for this project");
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
const bucket = admin.storage.from("chns-content");

function stableKey(group, slug) {
  const hex = createHash("sha256").update(`chns-preview:${group}:${slug}`).digest("hex").slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}.webp`;
}
async function upload(area, key, bytes, contentType = "image/webp") {
  const { error } = await bucket.upload(`${area}/${key}`, bytes, { contentType, upsert: false });
  if (error && !/already exists|duplicate/i.test(error.message)) throw new Error(`Upload ${area}/${key}: ${error.message}`);
}
async function previewImage(filename) {
  const input = await readFile(join(root, "assets", "mockups", filename));
  return sharp(input).resize({ width: 1800, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
}
async function exists(table, column, value) {
  const { data, error } = await admin.from(table).select("id").eq(column, value).maybeSingle();
  if (error) throw new Error(error.message);
  return Boolean(data);
}
async function insert(table, row) {
  const { error } = await admin.from(table).insert(row);
  if (error) throw new Error(`${table}: ${error.message}`);
}

for (const row of partners) {
  if (await exists("partners", "id", row.id)) continue;
  const bytes = await readFile(join(root, ".data", "partner-logos", row.logo_key));
  await upload("partner-logos", row.logo_key, bytes);
  await insert("partners", { id: row.id, name: row.name, website_url: row.website_url,
    logo_key: row.logo_key, logo_alt: row.logo_alt, logo_credit: row.logo_credit,
    rights_confirmed: Boolean(row.rights_confirmed), status: row.status, position: row.position,
    created_at: row.created_at, updated_at: row.updated_at, published_at: row.published_at,
    created_by: null, updated_by: null });
}

const slideMocks = [
  ["mock-community", "ตัวอย่างภาพภารกิจชุมชน", "community-relief.jpg", "ภาพจำลองอาสาสมัครส่งต่อสิ่งของช่วยเหลือ"],
  ["mock-food", "ตัวอย่างภาพการจัดชุดอาหาร", "food-packing.jpg", "ภาพจำลองอาสาสมัครจัดชุดอาหาร"],
  ["mock-coordination", "ตัวอย่างภาพการประสานงาน", "coordination.jpg", "ภาพจำลองทีมประสานงานประชุมร่วมกัน"],
];
for (const [slug, title, filename, alt] of slideMocks) {
  if (await exists("hero_slides", "title", title)) continue;
  const key = stableKey("hero", slug);
  await upload("hero-images", key, await previewImage(filename));
  await insert("hero_slides", { title, image_key: key, image_alt: alt,
    position: slideMocks.findIndex((item) => item[0] === slug) + 1, is_mockup: true,
    status: "draft", created_by: null, updated_by: null });
}

const projectMocks = [
  ["food-support", "ตัวอย่างโครงการสนับสนุนอาหาร", "ความช่วยเหลือพื้นฐาน", "พื้นที่ตัวอย่าง", "domestic", "โครงหน้าโครงการสำหรับอธิบายความจำเป็น วิธีดำเนินงาน และหลักฐานผลลัพธ์ เมื่อข้อมูลจริงได้รับอนุมัติ", "food-packing.jpg"],
  ["community-network", "ตัวอย่างโครงการเครือข่ายชุมชน", "การประสานงาน", "พื้นที่ตัวอย่าง", "relations", "ตัวอย่างการเชื่อมฝ่ายงาน ศูนย์ประสานงาน และองค์กรสมาชิกในหน้าโครงการเดียว", "coordination.jpg"],
  ["emergency-response", "ตัวอย่างภารกิจช่วยเหลือฉุกเฉิน", "ภารกิจเร่งด่วน", "พื้นที่ตัวอย่าง", "international", "ตัวอย่างพื้นที่สำหรับสถานะภารกิจ เป้าหมาย การอัปเดต และช่องทางสนับสนุนที่ผ่านการตรวจแล้ว", "community-relief.jpg"],
];
for (const [slug, title, category, location, department, summary, filename] of projectMocks) {
  if (await exists("projects", "slug", slug)) continue;
  const key = stableKey("project", slug);
  await upload("project-images", key, await previewImage(filename));
  await insert("projects", { slug, title, category, location, department_slug: department,
    summary, body: `${summary}\n\nข้อมูลตัวอย่างสำหรับพรีวิว ไม่ใช่โครงการจริงของ CHNS`,
    image_key: key, image_alt: `ภาพประกอบจำลองสำหรับ ${title}`, image_credit: "ภาพสร้างจำลองสำหรับพรีวิว",
    image_rights_confirmed: false, is_mockup: true, status: "draft", created_by: null, updated_by: null });
}

const articleMocks = [
  ["working-together", "ตัวอย่างบทความ: เมื่อเครือข่ายทำงานร่วมกัน", "story", "แม่แบบบทความที่เชื่อมเรื่องราว ภาพ และโครงการที่เกี่ยวข้อง โดยยังไม่มีเหตุการณ์จริงในเนื้อหานี้", "community-relief.jpg"],
  ["from-the-field", "ตัวอย่างข่าว: การเตรียมความช่วยเหลือจากพื้นที่", "news", "แม่แบบข่าวที่เตรียมช่องสำหรับวันที่ พื้นที่ ฝ่ายงาน และแหล่งข้อมูลที่ตรวจสอบได้", "food-packing.jpg"],
  ["responsible-reporting", "ตัวอย่างบทความ: สื่อสารผลลัพธ์อย่างรับผิดชอบ", "story", "โครงเนื้อหาสำหรับอธิบายผลลัพธ์พร้อมที่มาและสิทธิ์ของภาพที่นำมาใช้", "community-relief.jpg"],
];
for (const [slug, title, kind, summary, filename] of articleMocks) {
  if (await exists("articles", "slug", slug)) continue;
  const key = stableKey("article", slug);
  await upload("article-images", key, await previewImage(filename));
  await insert("articles", { slug, title, kind, summary,
    body: `${summary}\n\nข้อมูลตัวอย่างสำหรับพรีวิว ไม่ใช่เหตุการณ์จริงของ CHNS`,
    image_key: key, image_alt: `ภาพประกอบจำลองสำหรับ ${title}`, image_credit: "ภาพสร้างจำลองสำหรับพรีวิว",
    image_rights_confirmed: false, is_mockup: true, status: "draft", created_by: null, updated_by: null });
}

const reportMocks = [
  ["sample-mission-report", "รูปแบบรายงานภารกิจ", "รายงานโครงการ"],
  ["sample-organization-report", "รูปแบบรายงานผลการดำเนินงาน", "รายงานองค์กร"],
  ["sample-publication", "รูปแบบเอกสารเผยแพร่", "เอกสารวิชาการ"],
];
for (const [slug, title, kind] of reportMocks) {
  if (await exists("reports", "slug", slug)) continue;
  await insert("reports", { slug, title, kind, report_year: 2026,
    summary: "โครงรายงานสำหรับพรีวิวเท่านั้น ยังไม่มีข้อมูลหรือไฟล์จริง",
    source: "ข้อมูลตัวอย่างสำหรับพรีวิว", file_rights_confirmed: false,
    is_mockup: true, status: "draft", created_by: null, updated_by: null });
}

console.log("Import complete. Preview records are drafts and cannot be published.");

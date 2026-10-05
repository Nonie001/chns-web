import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();
const env = Object.fromEntries((await readFile(join(root, ".env.local"), "utf8")).split("\n")
  .filter((line) => line.includes("=") && !line.trimStart().startsWith("#"))
  .map((line) => { const index = line.indexOf("="); return [line.slice(0, index), line.slice(index + 1)]; }));
const ref = JSON.parse(Buffer.from(env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.split(".")[1], "base64url").toString()).ref;
const keys = JSON.parse(execFileSync("supabase", ["projects", "api-keys", "--project-ref", ref, "--reveal", "--output", "json"],
  { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }));
const secret = keys.find((item) => item.name === "service_role")?.api_key;
if (!secret) throw new Error("ไม่พบสิทธิ์ตรวจ Supabase");
const options = { auth: { persistSession: false, autoRefreshToken: false } };
const service = createClient(env.NEXT_PUBLIC_SUPABASE_URL, secret, options);
const anon = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, options);
const cases = [
  ["partners", 47, 47],
  ["hero_slides", 3, 0],
  ["projects", 6, 6],
  ["articles", 11, 11],
  ["reports", 3, 0],
];
for (const [table, expectedTotal, expectedPublic] of cases) {
  const total = await service.from(table).select("id", { count: "exact", head: true });
  const visible = await anon.from(table).select("id", { count: "exact", head: true });
  if (total.error || visible.error || total.count !== expectedTotal || visible.count !== expectedPublic) {
    throw new Error(`RLS ${table}: total=${total.count} public=${visible.count} ${total.error?.message ?? visible.error?.message ?? ""}`);
  }
  console.log(`${table}: ${total.count} total, ${visible.count} public`);
}

const { data: previewArticles, error: previewError } = await service.from("articles")
  .select("slug,body,image_key,status,is_mockup,showcase_visible").eq("is_mockup", true);
if (previewError || previewArticles?.length !== 11 || previewArticles.some((article) =>
  article.status !== "draft" || !article.showcase_visible || article.body.length < 500 || !article.image_key
)) throw new Error(`บทความพรีวิวไม่ครบหรือไม่มีเนื้อหา/ภาพ: ${previewError?.message ?? ""}`);
const imageChecks = await Promise.all(previewArticles.map(async (article) => {
  const result = await service.storage.from("chns-content").download(`article-images/${article.image_key}`);
  return { slug: article.slug, ok: !result.error && result.data?.size > 0 };
}));
if (imageChecks.some((item) => !item.ok)) {
  throw new Error(`ภาพบทความพรีวิวไม่ครบ: ${imageChecks.filter((item) => !item.ok).map((item) => item.slug).join(", ")}`);
}
const articleDraftImage = await anon.storage.from("chns-content")
  .download(`article-images/${previewArticles[0].image_key}`);
if (articleDraftImage.error || !articleDraftImage.data) throw new Error("ภาพบทความตัวอย่างที่เปิดแสดงอ่านไม่ได้");
console.log("11 article showcases: full body, cover image, explicitly public demo access");

const { data: previewProjects, error: projectPreviewError } = await service.from("projects")
  .select("slug,body,image_key,status,is_mockup,showcase_visible").eq("is_mockup", true);
if (projectPreviewError || previewProjects?.length !== 6 || previewProjects.some((project) =>
  project.status !== "draft" || !project.showcase_visible || project.body.length < 500 || !project.image_key
)) throw new Error(`โครงการพรีวิวไม่ครบหรือไม่มีเนื้อหา/ภาพ: ${projectPreviewError?.message ?? ""}`);
const projectImageChecks = await Promise.all(previewProjects.map(async (project) => {
  const result = await anon.storage.from("chns-content").download(`project-images/${project.image_key}`);
  return { slug: project.slug, ok: !result.error && result.data?.size > 0 };
}));
if (projectImageChecks.some((item) => !item.ok)) {
  throw new Error(`ภาพโครงการตัวอย่างไม่ครบ: ${projectImageChecks.filter((item) => !item.ok).map((item) => item.slug).join(", ")}`);
}
console.log("6 project showcases: full body, cover image, explicitly public demo access");

const { data: slide, error: slideError } = await service.from("hero_slides").select("image_key").eq("is_mockup", true).limit(1).single();
if (slideError || !slide) throw new Error(slideError?.message ?? "ไม่พบภาพร่าง");
const draftDownload = await anon.storage.from("chns-content").download(`hero-images/${slide.image_key}`);
if (!draftDownload.error) throw new Error("ภาพร่างเปิดให้อ่านโดยไม่ล็อกอิน");
console.log("draft image: anonymous access denied");

const { data: partner, error: partnerError } = await service.from("partners")
  .select("logo_key").eq("status", "published").eq("rights_confirmed", true).limit(1).single();
if (partnerError || !partner) throw new Error(partnerError?.message ?? "ไม่พบโลโก้เผยแพร่");
const serviceDownload = await service.storage.from("chns-content").download(`partner-logos/${partner.logo_key}`);
if (serviceDownload.error || !serviceDownload.data) throw new Error(`โลโก้ไม่ได้อยู่ใน Storage: ${serviceDownload.error?.message}`);
const publicDownload = await anon.storage.from("chns-content").download(`partner-logos/${partner.logo_key}`);
if (publicDownload.error || !publicDownload.data) throw new Error(`อ่านโลโก้เผยแพร่ไม่ได้: ${publicDownload.error?.message}`);
console.log("published partner logo: anonymous download allowed");

const credentialsPath = join(root, ".data", "supabase-admin-initial.txt");
if (existsSync(credentialsPath)) {
  const credentials = await readFile(credentialsPath, "utf8");
  const email = credentials.match(/^Supabase admin email: (.+)$/m)?.[1];
  const password = credentials.match(/^Temporary password: (.+)$/m)?.[1];
  if (!email || !password) throw new Error("ไม่มีข้อมูลล็อกอินสำหรับตรวจ");
  const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, options);
  const login = await admin.auth.signInWithPassword({ email, password });
  if (login.error || !login.data.user) throw new Error(`ล็อกอินผู้ดูแลไม่สำเร็จ: ${login.error?.message}`);
  const member = await admin.from("chns_admin_users").select("role, active").eq("user_id", login.data.user.id).single();
  if (member.error || member.data?.role !== "admin" || !member.data.active) throw new Error("บัญชีไม่มีสิทธิ์ admin");
  const drafts = await admin.from("hero_slides").select("id").eq("status", "draft");
  if (drafts.error || drafts.data?.length !== 3) throw new Error("ผู้ดูแลอ่านร่างไม่ได้");
  const adminDownload = await admin.storage.from("chns-content").download(`hero-images/${slide.image_key}`);
  if (adminDownload.error || !adminDownload.data) throw new Error(`ผู้ดูแลอ่านภาพร่างไม่ได้: ${adminDownload.error?.message}`);
  await admin.auth.signOut();
  console.log("admin login, draft rows, draft image: allowed");
} else {
  console.log("admin login check skipped: initial credentials were removed after rotation");
}

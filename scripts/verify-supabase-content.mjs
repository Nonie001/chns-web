import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries((await readFile(".env.local", "utf8")).split("\n")
  .filter((line) => line.includes("=") && !line.trimStart().startsWith("#"))
  .map((line) => { const index = line.indexOf("="); return [line.slice(0, index), line.slice(index + 1)]; }));
const ref = new URL(env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0];
const keys = JSON.parse(execFileSync("supabase", ["projects", "api-keys", "--project-ref", ref, "--reveal", "--output", "json"],
  { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }));
const secret = keys.find((item) => item.name === "service_role")?.api_key;
if (!secret) throw new Error("Supabase service key unavailable");
const options = { auth: { persistSession: false, autoRefreshToken: false } };
const service = createClient(env.NEXT_PUBLIC_SUPABASE_URL, secret, options);
const anon = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, options);

for (const table of ["hero_slides", "articles", "projects", "reports"]) {
  const all = await service.from(table).select("id,status,is_mockup", { count: "exact" });
  const visible = await anon.from(table).select("id,status", { count: "exact" });
  if (all.error || visible.error) throw new Error(`${table}: ${all.error?.message ?? visible.error?.message}`);
  const published = all.data.filter((row) => row.status === "published").length;
  if (all.data.some((row) => row.is_mockup) || visible.count !== published || visible.data.some((row) => row.status !== "published")) {
    throw new Error(`${table}: mockups remain or public visibility differs from published rows`);
  }
  console.log(`${table}: ${all.count} total, ${published} published, 0 mockups`);
}

const slides = await anon.from("hero_slides").select("image_key,mobile_image_key").eq("status", "published");
if (slides.error || !slides.data?.length) throw new Error("No published hero slides");
for (const slide of slides.data) {
  for (const key of [slide.image_key, slide.mobile_image_key].filter(Boolean)) {
    const image = await anon.storage.from("chns-content").download(`hero-images/${key}`);
    if (image.error || !image.data?.size) throw new Error(`Hero image unavailable: ${key}`);
  }
}
console.log(`${slides.data.length} published hero slides: Supabase Storage readable`);

const partners = await service.from("partners").select("logo_key,status,rights_confirmed");
const publicPartners = await anon.from("partners").select("logo_key,status,rights_confirmed");
if (partners.error || publicPartners.error) throw new Error(partners.error?.message ?? publicPartners.error?.message);
const approvedPartners = partners.data.filter((row) => row.status === "published" && row.rights_confirmed);
if (publicPartners.data.length !== approvedPartners.length) throw new Error("Partner visibility differs from approved rows");
if (approvedPartners[0]?.logo_key) {
  const logo = await anon.storage.from("chns-content").download(`partner-logos/${approvedPartners[0].logo_key}`);
  if (logo.error || !logo.data?.size) throw new Error("Published partner logo unavailable");
}
console.log(`${approvedPartners.length} approved partners: Supabase Storage readable`);

for (const file of ["gallery-winter.webp", "page-about.webp", "home-process.webp"]) {
  const response = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/chns-editorial/${file}`, { method: "HEAD" });
  if (!response.ok) throw new Error(`Editorial image unavailable: ${file} (HTTP ${response.status})`);
}
console.log("CHNS editorial images: Supabase public bucket readable");

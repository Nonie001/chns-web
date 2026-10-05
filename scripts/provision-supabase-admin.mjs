import { execFileSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const email = process.argv[2]?.trim().toLowerCase();
if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("ระบุอีเมลผู้ดูแล");
const root = process.cwd();
const env = Object.fromEntries((await readFile(join(root, ".env.local"), "utf8")).split("\n")
  .filter((line) => line.includes("=") && !line.trimStart().startsWith("#"))
  .map((line) => { const index = line.indexOf("="); return [line.slice(0, index), line.slice(index + 1)]; }));
const ref = JSON.parse(Buffer.from(env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.split(".")[1], "base64url").toString()).ref;
const keys = JSON.parse(execFileSync("supabase", ["projects", "api-keys", "--project-ref", ref, "--reveal", "--output", "json"],
  { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }));
const secret = keys.find((item) => item.name === "service_role")?.api_key;
if (!secret) throw new Error("บัญชี CLI ไม่มีสิทธิ์อ่าน service key");
const client = createClient(env.NEXT_PUBLIC_SUPABASE_URL, secret, { auth: { persistSession: false, autoRefreshToken: false } });
const { data: users, error: listError } = await client.auth.admin.listUsers({ page: 1, perPage: 1000 });
if (listError) throw new Error(listError.message);
let user = users.users.find((item) => item.email?.toLowerCase() === email);
let created = false;
if (!user) {
  const password = randomBytes(24).toString("base64url");
  const { data, error } = await client.auth.admin.createUser({ email, password, email_confirm: true });
  if (error || !data.user) throw new Error(error?.message ?? "สร้างบัญชีไม่สำเร็จ");
  user = data.user;
  created = true;
  const directory = join(root, ".data");
  await mkdir(directory, { recursive: true });
  const path = join(directory, "supabase-admin-initial.txt");
  await writeFile(path, `Supabase admin email: ${email}\nTemporary password: ${password}\nChange this password after first login.\n`, { mode: 0o600, flag: "wx" });
  console.log(`Temporary credentials saved to ${path}`);
}
const { error: roleError } = await client.from("chns_admin_users")
  .upsert({ user_id: user.id, role: "admin", active: true });
if (roleError) throw new Error(roleError.message);
console.log(`Admin access ready for ${email}; account ${created ? "created" : "already existed"}.`);

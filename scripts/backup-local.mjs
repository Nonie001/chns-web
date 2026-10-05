import { DatabaseSync, backup } from "node:sqlite";
import { cp, mkdir, stat, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, join, resolve } from "node:path";

const argument = process.argv.indexOf("--out");
const outputArg = argument >= 0 ? process.argv[argument + 1] : null;
if (!outputArg) {
  console.error("วิธีใช้: npm run backup:local -- --out /path/to/new-backup-directory");
  process.exit(1);
}

const destination = isAbsolute(outputArg) ? outputArg : resolve(outputArg);
const databasePath = process.env.CHNS_DATABASE_PATH ?? join(process.cwd(), ".data", "chns.sqlite");
const mediaRoot = dirname(databasePath);
await stat(databasePath);
await mkdir(destination, { recursive: false });

const database = new DatabaseSync(databasePath);
try {
  await backup(database, join(destination, "chns.sqlite"));
} finally {
  database.close();
}

const mediaDirectories = ["hero-images", "article-images", "project-images", "report-files", "partner-logos"];
const copied = [];
for (const name of mediaDirectories) {
  try {
    await stat(join(mediaRoot, name));
    await cp(join(mediaRoot, name), join(destination, name), { recursive: true });
    copied.push(name);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}
await writeFile(join(destination, "manifest.json"), JSON.stringify({
  createdAt: new Date().toISOString(),
  database: "chns.sqlite",
  mediaDirectories: copied,
  note: "เก็บฐานข้อมูลและโฟลเดอร์ภาพพร้อมกัน ก่อน restore ให้หยุดเซิร์ฟเวอร์",
}, null, 2));
console.log(`สำรองข้อมูลแล้ว: ${destination}`);

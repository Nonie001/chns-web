"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin } from "@/lib/auth/admin-session";
import { storePartnerLogo } from "@/lib/storage/partner-logos";
import { createPartner, getAdminPartner, movePartner, setPartnerStatus, updatePartner } from "./partner-store";
import type { PartnerInput, PartnerStatus } from "./types";

export type PartnerFormState = { error: string | null };
function field(form: FormData, name: string, max: number, required = true) {
  const value = form.get(name); const result = typeof value === "string" ? value.trim() : "";
  if (result.length > max || (required && !result)) throw new Error(`กรุณาตรวจช่อง ${name}`);
  return result;
}
function input(form: FormData): PartnerInput {
  const websiteUrl = field(form, "websiteUrl", 400, false);
  if (websiteUrl) {
    try { const url = new URL(websiteUrl); if (!["http:", "https:"].includes(url.protocol)) throw new Error(); }
    catch { throw new Error("ลิงก์เว็บไซต์ต้องขึ้นต้นด้วย https:// หรือ http://"); }
  }
  return { name: field(form, "name", 160), websiteUrl,
    logoAlt: field(form, "logoAlt", 180), logoCredit: field(form, "logoCredit", 180),
    rightsConfirmed: form.get("rightsConfirmed") === "on" };
}
function refresh() { revalidatePath("/"); revalidatePath("/centers"); revalidatePath("/members"); revalidatePath("/admin/partners"); }

export async function savePartnerAction(_state: PartnerFormState, form: FormData): Promise<PartnerFormState> {
  await assertAdmin();
  let destination = "/admin/partners";
  try {
    const id = field(form, "id", 36, false); const data = input(form);
    const before = id ? await getAdminPartner(id) : null;
    if (id && !before) throw new Error("ไม่พบภาคี");
    if (before?.status === "published" && !data.rightsConfirmed) throw new Error("รายการที่เผยแพร่ต้องยืนยันสิทธิ์โลโก้");
    const file = form.get("logo"); const hasFile = file instanceof File && file.size > 0;
    if (!hasFile && !before) throw new Error("กรุณาอัปโหลดโลโก้");
    const logoKey = hasFile ? await storePartnerLogo(file) : undefined;
    if (before) { await updatePartner(before.id, data, logoKey); destination += `/${before.id}?saved=1`; }
    else { const created = await createPartner(data, logoKey!); destination += `/${created}?created=1`; }
    refresh();
  } catch (error) { return { error: error instanceof Error ? error.message : "บันทึกไม่สำเร็จ" }; }
  redirect(destination);
}
export async function changePartnerStatusAction(form: FormData) {
  await assertAdmin();
  const id = field(form, "id", 36); const status = field(form, "status", 12);
  if (!["draft", "published", "archived"].includes(status)) throw new Error("สถานะไม่ถูกต้อง");
  try { await setPartnerStatus(id, status as PartnerStatus); }
  catch (error) { redirect(`/admin/partners?error=${encodeURIComponent(error instanceof Error ? error.message : "เปลี่ยนสถานะไม่สำเร็จ")}`); }
  refresh();
}
export async function movePartnerAction(form: FormData) {
  await assertAdmin();
  const id = field(form, "id", 36); const direction = field(form, "direction", 4);
  if (direction !== "up" && direction !== "down") throw new Error("ทิศทางไม่ถูกต้อง");
  await movePartner(id, direction); refresh();
}

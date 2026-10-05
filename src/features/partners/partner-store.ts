import "server-only";
import { createAdminRow, findAdminRow, findVisibleRow, listAdminRows, listPublicRows, updateAdminRow } from "@/lib/supabase/content";
import type { Partner, PartnerInput, PartnerStatus, PublicPartner } from "./types";

type Row = { id: string; name: string; website_url: string; logo_key: string; logo_alt: string;
  logo_credit: string; rights_confirmed: boolean; status: PartnerStatus; position: number;
  created_at: string; updated_at: string; published_at: string | null };
const fromRow = (row: Row): Partner => ({ id: row.id, name: row.name, websiteUrl: row.website_url,
  logoKey: row.logo_key, logoAlt: row.logo_alt, logoCredit: row.logo_credit,
  rightsConfirmed: row.rights_confirmed, status: row.status, position: row.position,
  createdAt: row.created_at, updatedAt: row.updated_at, publishedAt: row.published_at });
function validate(input: PartnerInput) {
  if (!input.name || !input.logoAlt || !input.logoCredit) throw new Error("กรุณากรอกชื่อ คำอธิบายโลโก้ และที่มา");
  if (input.websiteUrl) {
    try { const url = new URL(input.websiteUrl); if (!["https:", "http:"].includes(url.protocol)) throw new Error(); }
    catch { throw new Error("ลิงก์เว็บไซต์ต้องขึ้นต้นด้วย https:// หรือ http://"); }
  }
}

export async function listPublishedPartners(): Promise<PublicPartner[]> {
  return (await listPublicRows<Row>("partners", "position", true))
    .filter((row) => row.rights_confirmed)
    .map((row) => ({ id: row.id, name: row.name, websiteUrl: row.website_url, logoAlt: row.logo_alt,
      logoSrc: `/api/partner-logos/${row.logo_key}` }));
}
export async function listAdminPartners(): Promise<Partner[]> {
  return (await listAdminRows<Row>("partners", "position", true)).map(fromRow);
}
export async function getAdminPartner(id: string): Promise<Partner | null> {
  const row = await findAdminRow<Row>("partners", "id", id);
  return row ? fromRow(row) : null;
}
export async function getPartnerByLogoKey(key: string): Promise<Partner | null> {
  const row = await findVisibleRow<Row>("partners", "logo_key", key);
  return row ? fromRow(row) : null;
}
export async function createPartner(input: PartnerInput, logoKey: string): Promise<string> {
  validate(input);
  const rows = await listAdminRows<Row>("partners", "position", false);
  return createAdminRow("partners", "partner_audit", "partner_id", {
    name: input.name, website_url: input.websiteUrl, logo_key: logoKey, logo_alt: input.logoAlt,
    logo_credit: input.logoCredit, rights_confirmed: input.rightsConfirmed,
    position: (rows[0]?.position ?? 0) + 1,
  }, { input, logoKey });
}
export async function updatePartner(id: string, input: PartnerInput, logoKey?: string) {
  validate(input);
  const before = await getAdminPartner(id);
  if (!before) throw new Error("ไม่พบภาคี");
  if (before.status === "published" && !input.rightsConfirmed) throw new Error("รายการที่เผยแพร่ต้องยืนยันสิทธิ์โลโก้");
  await updateAdminRow("partners", "partner_audit", "partner_id", id, {
    name: input.name, website_url: input.websiteUrl, logo_key: logoKey ?? before.logoKey,
    logo_alt: input.logoAlt, logo_credit: input.logoCredit, rights_confirmed: input.rightsConfirmed,
  }, before);
}
export async function setPartnerStatus(id: string, status: PartnerStatus) {
  const before = await getAdminPartner(id);
  if (!before) throw new Error("ไม่พบภาคี");
  if (status === "published" && (!before.rightsConfirmed || !before.name || !before.logoAlt || !before.logoCredit || !before.logoKey)) {
    throw new Error("กรุณาระบุโลโก้ ชื่อ คำอธิบาย ที่มา และยืนยันสิทธิ์ก่อนเผยแพร่");
  }
  await updateAdminRow("partners", "partner_audit", "partner_id", id, {
    status, published_at: status === "published" ? new Date().toISOString() : before.publishedAt,
  }, before, "status");
}
export async function movePartner(id: string, direction: "up" | "down") {
  const rows = await listAdminRows<Row>("partners", "position", true);
  const index = rows.findIndex((row) => row.id === id);
  const neighbor = rows[index + (direction === "up" ? -1 : 1)];
  if (index < 0) throw new Error("ไม่พบภาคี");
  if (!neighbor) return;
  await updateAdminRow("partners", "partner_audit", "partner_id", id,
    { position: neighbor.position }, { position: rows[index].position }, "reorder");
  await updateAdminRow("partners", "partner_audit", "partner_id", neighbor.id,
    { position: rows[index].position }, { position: neighbor.position }, "reorder");
}

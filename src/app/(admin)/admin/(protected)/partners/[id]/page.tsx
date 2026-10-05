import Link from "next/link";
import { notFound } from "next/navigation";
import { PartnerEditor } from "@/components/admin/partner-editor";
import { getAdminPartner } from "@/features/partners/partner-store";

export default async function EditPartnerPage({ params }: PageProps<"/admin/partners/[id]">) {
  const { id } = await params; const partner = await getAdminPartner(id);
  if (!partner) notFound();
  return <><div className="admin-page-header"><Link className="text-link" href="/admin/partners">← กลับไปรายการ</Link><p className="eyebrow">EDIT PARTNER</p><h1>แก้ไขภาคี</h1><p>สถานะปัจจุบัน: {partner.status === "published" ? "เผยแพร่" : partner.status === "draft" ? "ร่าง" : "เก็บถาวร"}</p></div><PartnerEditor partner={partner} /></>;
}

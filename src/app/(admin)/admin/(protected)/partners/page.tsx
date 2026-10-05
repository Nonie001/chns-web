import Image from "next/image";
import Link from "next/link";
import { changePartnerStatusAction, movePartnerAction } from "@/features/partners/actions";
import { listAdminPartners } from "@/features/partners/partner-store";

const labels = { draft: "ร่าง", published: "เผยแพร่", archived: "เก็บถาวร" } as const;

export default async function AdminPartnersPage({ searchParams }: PageProps<"/admin/partners">) {
  const partners = await listAdminPartners();
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error.slice(0, 180) : null;
  return <>
    <div className="admin-page-header admin-page-header--row">
      <div><p className="eyebrow">PARTNER NETWORK</p><h1>โลโก้ภาคีเครือข่าย</h1><p>จัดการชื่อ โลโก้ ลิงก์ ลำดับ และสถานะเผยแพร่</p></div>
      <Link href="/admin/partners/new" className="button button--accent">+ เพิ่มภาคี</Link>
    </div>
    {error && <p className="admin-form-error" role="alert">{error}</p>}
    <div className="admin-slide-list">
      {partners.length === 0 ? <div className="admin-empty"><h2>ยังไม่มีภาคี</h2><p>เพิ่มโลโก้และชื่อองค์กรจากไฟล์ที่ได้รับอนุญาต แล้วตรวจรายละเอียดก่อนเผยแพร่</p></div> : partners.map((partner, index) => <article className="admin-slide-card" key={partner.id}>
        <div className="admin-slide-card__image partner-admin-logo"><Image src={`/api/partner-logos/${partner.logoKey}`} alt={partner.logoAlt} fill sizes="(max-width: 800px) 100vw, 260px" unoptimized /></div>
        <div className="admin-slide-card__content">
          <span className={`admin-status admin-status--${partner.status}`}>{labels[partner.status]}</span>
          <h2>{partner.name}</h2><p>{partner.websiteUrl || "ยังไม่ระบุเว็บไซต์"} · ลำดับ {index + 1}</p>
          <div className="admin-slide-card__actions">
            <Link className="button button--dark" href={`/admin/partners/${partner.id}`}>แก้ไข</Link>
            <form action={changePartnerStatusAction}><input type="hidden" name="id" value={partner.id} /><input type="hidden" name="status" value={partner.status === "published" ? "draft" : "published"} /><button type="submit">{partner.status === "published" ? "ปิดเผยแพร่" : "เผยแพร่"}</button></form>
            <form action={changePartnerStatusAction}><input type="hidden" name="id" value={partner.id} /><input type="hidden" name="status" value={partner.status === "archived" ? "draft" : "archived"} /><button type="submit">{partner.status === "archived" ? "คืนค่าร่าง" : "เก็บถาวร"}</button></form>
            <form action={movePartnerAction}><input type="hidden" name="id" value={partner.id} /><input type="hidden" name="direction" value="up" /><button type="submit" disabled={index === 0} aria-label={`เลื่อน ${partner.name} ขึ้น`}>↑</button></form>
            <form action={movePartnerAction}><input type="hidden" name="id" value={partner.id} /><input type="hidden" name="direction" value="down" /><button type="submit" disabled={index === partners.length - 1} aria-label={`เลื่อน ${partner.name} ลง`}>↓</button></form>
          </div>
        </div>
      </article>)}
    </div>
  </>;
}

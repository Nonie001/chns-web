"use client";

import Image from "next/image";
import { useActionState } from "react";
import { savePartnerAction } from "@/features/partners/actions";
import type { Partner } from "@/features/partners/types";

export function PartnerEditor({ partner }: { partner?: Partner }) {
  const [state, action, pending] = useActionState(savePartnerAction, { error: null });
  return (
    <form className="slide-editor" action={action}>
      <input type="hidden" name="id" value={partner?.id ?? ""} />
      <div className="slide-editor__fields">
        <label className="slide-editor__wide">ชื่อองค์กร/ภาคี
          <input name="name" defaultValue={partner?.name ?? ""} maxLength={160} required />
        </label>
        <label className="slide-editor__wide">เว็บไซต์ของภาคี (ไม่บังคับ)
          <input name="websiteUrl" type="url" defaultValue={partner?.websiteUrl ?? ""} maxLength={400} placeholder="https://example.org" />
        </label>
        <label className="slide-editor__wide">ไฟล์โลโก้ {partner ? "(ไม่เลือก = ใช้ภาพเดิม)" : ""}
          <input name="logo" type="file" accept="image/jpeg,image/png,image/webp" required={!partner} />
          <small>JPG, PNG หรือ WebP · อย่างน้อย 200 × 100 px · ไม่เกิน 5 MB · พื้นหลังโปร่งใสใช้ PNG/WebP</small>
        </label>
        {partner && <div className="slide-editor__preview partner-editor__preview">
          <Image src={`/api/partner-logos/${partner.logoKey}`} alt={partner.logoAlt} width={320} height={180} unoptimized />
        </div>}
        <label className="slide-editor__wide">คำอธิบายโลโก้สำหรับผู้ใช้โปรแกรมอ่านหน้าจอ
          <input name="logoAlt" defaultValue={partner?.logoAlt ?? ""} maxLength={180} placeholder="โลโก้องค์กร..." required />
        </label>
        <label className="slide-editor__wide">ที่มา/เครดิตไฟล์
          <input name="logoCredit" defaultValue={partner?.logoCredit ?? ""} maxLength={180} placeholder="CHNS / โฟลเดอร์โลโก้ภาคี" required />
        </label>
        <label className="article-editor__consent slide-editor__wide">
          <input name="rightsConfirmed" type="checkbox" defaultChecked={partner?.rightsConfirmed ?? false} />
          ยืนยันว่าองค์กรอนุญาตให้เผยแพร่โลโก้บนเว็บไซต์ CHNS
        </label>
      </div>
      <p className="slide-editor__hint">{partner?.status === "published" ? "รายการนี้เผยแพร่อยู่ การบันทึกจะแสดงผลบนหน้าเว็บทันที" : "บันทึกเป็นร่างก่อน แล้วกดเผยแพร่จากหน้ารายการ"}</p>
      {state.error && <p className="admin-form-error" role="alert">{state.error}</p>}
      <button className="button button--accent" type="submit" disabled={pending}>{pending ? "กำลังบันทึก…" : "บันทึกภาคี"}</button>
    </form>
  );
}

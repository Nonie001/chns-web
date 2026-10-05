"use client";

import Image from "next/image";
import { useActionState } from "react";
import { saveSlideAction } from "@/features/hero/actions";
import type { HeroSlide } from "@/features/hero/types";

export function SlideEditor({ slide }: { slide?: HeroSlide }) {
  const [state, action, pending] = useActionState(saveSlideAction, { error: null });
  return (
    <form className="slide-editor" action={action}>
      <input type="hidden" name="id" value={slide?.id ?? ""} />
      <div className="slide-editor__fields">
        <label className="slide-editor__wide">
          ชื่อสไลด์สำหรับจัดการในหลังบ้าน
          <input name="title" defaultValue={slide?.title ?? ""} maxLength={110} required />
        </label>
        <label className="slide-editor__wide">
          คำอธิบายภาพสำหรับผู้ใช้เครื่องอ่านหน้าจอ
          <input name="imageAlt" defaultValue={slide?.imageAlt ?? ""} maxLength={180} required />
          <small>ระบุข้อความสำคัญที่ออกแบบไว้ในภาพด้วย เพื่อให้ทุกคนเข้าถึงเนื้อหาได้</small>
        </label>
        <label className="slide-editor__wide">
          ภาพสำหรับหน้าจอกว้าง {slide ? "(ไม่เลือก = ใช้ภาพเดิม)" : "(จำเป็น)"}
          <input name="image" type="file" accept="image/jpeg,image/png,image/webp" required={!slide} />
          <small>JPG, PNG หรือ WebP · กว้างอย่างน้อย 1200 px · อัตราส่วนอย่างน้อย 1.4:1 · ไม่เกิน 5 MB</small>
        </label>
        {slide && (
          <div className="slide-editor__preview">
            <Image src={`/api/hero-images/${slide.imageKey}`} alt={slide.imageAlt} width={640} height={360} unoptimized />
          </div>
        )}
        <label className="slide-editor__wide">
          ภาพสำหรับมือถือ (แนะนำเมื่อมีข้อความอยู่ในภาพ)
          <input name="mobileImage" type="file" accept="image/jpeg,image/png,image/webp" />
          <small>กว้างอย่างน้อย 600 px · อัตราส่วนไม่เกิน 1.4:1 · ไม่เกิน 5 MB · หากยังไม่มีภาพมือถือ ระบบจะใช้ภาพหน้าจอกว้าง</small>
        </label>
        {slide?.mobileImageKey && (
          <div className="slide-editor__preview slide-editor__wide">
            <Image src={`/api/hero-images/${slide.mobileImageKey}`} alt={slide.imageAlt} width={360} height={480} unoptimized />
            <label><input name="removeMobileImage" type="checkbox" /> ลบภาพมือถือและใช้ภาพหน้าจอกว้างแทน</label>
          </div>
        )}
      </div>
      <p className="slide-editor__hint">
        Hero แสดงเฉพาะภาพ ไม่มีข้อความหรือปุ่มซ้อนบนภาพ ข้อความที่ต้องการแสดงให้จัดวางในไฟล์ภาพ
        {slide?.status === "published"
          ? " สไลด์นี้เผยแพร่อยู่ การบันทึกจะเปลี่ยนหน้าแรกทันที"
          : " สไลด์ร่างจะไม่แสดงบนหน้าแรกจนกดเผยแพร่"}
      </p>
      {state.error && <p className="admin-form-error" role="alert">{state.error}</p>}
      <button className="button button--accent" type="submit" disabled={pending}>
        {pending ? "กำลังบันทึก…" : "บันทึกสไลด์"}
      </button>
    </form>
  );
}

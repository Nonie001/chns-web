"use client";

import { useActionState } from "react";
import { contactDepartments } from "@/content/static/site";
import { submitContactAction } from "@/features/contact/actions";

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContactAction, { error: null, reference: null });

  if (state.reference !== null) {
    return (
      <div className="contact-form__success" role="status">
        <h3>ส่งเรื่องเรียบร้อยแล้ว</h3>
        <p>ระบบบันทึกเรื่องแล้ว ผู้ดูแลจะเห็นฝ่ายที่คุณเลือกและช่องทางติดต่อกลับ</p>
        {state.reference && <p>หมายเลขอ้างอิง: <strong>{state.reference.slice(0, 8).toUpperCase()}</strong></p>}
        <a className="text-link" href="/contact#contact-form">ส่งเรื่องใหม่ ↗</a>
      </div>
    );
  }

  return (
    <form className="contact-form" action={action}>
      <div className="contact-form__grid">
        <label>ส่งถึงฝ่าย (จำเป็น)
          <select name="department" defaultValue="" required>
            <option value="" disabled>เลือกฝ่ายที่ต้องการติดต่อ</option>
            {contactDepartments.map((department) => <option value={department.slug} key={department.slug}>{department.name}</option>)}
          </select>
        </label>
        <label>ติดต่อเรื่องอะไร (จำเป็น)
          <input name="subject" maxLength={160} required placeholder="ระบุหัวข้อที่ต้องการติดต่อ" />
        </label>
        <label>ชื่อ–สกุล (จำเป็น)
          <input name="fullName" autoComplete="name" maxLength={160} required />
        </label>
        <label>เบอร์โทรศัพท์
          <input name="phone" type="tel" autoComplete="tel" maxLength={30} inputMode="tel" />
        </label>
        <label>อีเมล
          <input name="email" type="email" autoComplete="email" maxLength={254} />
        </label>
        <label>LINE ID
          <input name="lineId" maxLength={80} placeholder="ถ้ามี" />
        </label>
        <label className="contact-form__wide">รายละเอียด (จำเป็น)
          <textarea name="message" rows={4} maxLength={4000} required placeholder="อธิบายเรื่องที่ต้องการให้ติดต่อกลับ" />
        </label>
      </div>
      <div className="contact-form__honeypot" aria-hidden="true"><label>เว็บไซต์<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <p className="contact-form__note">กรุณาระบุเบอร์โทรศัพท์ อีเมล หรือ LINE ID อย่างน้อยหนึ่งช่องทาง ข้อมูลนี้ใช้เพื่อติดต่อกลับและส่งเรื่องภายในไปยังฝ่ายที่คุณเลือก โดยผู้ดูแลระบบที่ได้รับสิทธิ์เท่านั้นที่อ่านได้</p>
      {state.error && <p className="contact-form__error" role="alert">{state.error}</p>}
      <button className="button button--dark" type="submit" disabled={pending}>{pending ? "กำลังส่ง…" : "ส่งข้อมูลติดต่อ"}</button>
    </form>
  );
}

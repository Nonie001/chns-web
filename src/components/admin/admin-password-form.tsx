"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AdminPasswordForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    const form = event.currentTarget;
    const fields = new FormData(form);
    const password = String(fields.get("password") ?? "");
    const confirmation = String(fields.get("confirmation") ?? "");
    if (password.length < 12) {
      setError("รหัสผ่านใหม่ต้องมีอย่างน้อย 12 ตัวอักษร");
      return;
    }
    if (password !== confirmation) {
      setError("รหัสผ่านทั้งสองช่องไม่ตรงกัน");
      return;
    }
    setBusy(true);
    const { error: updateError } = await createSupabaseBrowserClient().auth.updateUser({ password });
    setBusy(false);
    if (updateError) {
      setError("เปลี่ยนรหัสผ่านไม่สำเร็จ กรุณาลองอีกครั้ง");
      return;
    }
    form.reset();
    setSuccess("เปลี่ยนรหัสผ่านแล้ว ใช้รหัสใหม่ในการเข้าสู่ระบบครั้งถัดไป");
  }

  return (
    <form className="admin-login-form admin-account-form" onSubmit={onSubmit}>
      <label htmlFor="new-password">รหัสผ่านใหม่</label>
      <input id="new-password" name="password" type="password" autoComplete="new-password" minLength={12} required />
      <label htmlFor="confirm-password">ยืนยันรหัสผ่านใหม่</label>
      <input id="confirm-password" name="confirmation" type="password" autoComplete="new-password" minLength={12} required />
      {error && <p className="admin-form-error" role="alert">{error}</p>}
      {success && <p className="admin-success" role="status">{success}</p>}
      <button className="button button--accent" type="submit" disabled={busy}>
        {busy ? "กำลังบันทึก…" : "เปลี่ยนรหัสผ่าน"}
      </button>
    </form>
  );
}

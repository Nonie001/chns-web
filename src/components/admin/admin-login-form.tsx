"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const supabase = createSupabaseBrowserClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });
    setBusy(false);
    if (signInError) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      return;
    }
    const { data: membership } = await supabase.from("chns_admin_users")
      .select("role, active").eq("user_id", data.user.id).maybeSingle();
    if (!membership?.active || membership.role !== "admin") {
      await supabase.auth.signOut();
      setError("บัญชีนี้ไม่มีสิทธิ์เข้าหลังบ้าน");
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <form className="admin-login-form" onSubmit={onSubmit}>
      <label htmlFor="admin-email">อีเมลผู้ดูแล</label>
      <input
        id="admin-email"
        name="email"
        type="email"
        autoComplete="username"
        required
      />
      <label htmlFor="admin-password">รหัสผ่าน</label>
      <input
        id="admin-password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
      {error && (
        <p className="admin-form-error" role="alert">
          {error}
        </p>
      )}
      <button className="button button--accent" type="submit" disabled={busy}>
        {busy ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
      </button>
    </form>
  );
}

import "server-only";
import { forbidden, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAdminSession() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  const { data: membership, error: membershipError } = await supabase
    .from("chns_admin_users")
    .select("role, active")
    .eq("user_id", user.id)
    .maybeSingle();
  if (membershipError || !membership?.active || membership.role !== "admin") return null;
  return { user: { id: user.id, email: user.email ?? "" } };
}

export async function requireAdminSession() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/admin/login");
  const { data: membership } = await supabase.from("chns_admin_users")
    .select("role, active").eq("user_id", user.id).maybeSingle();
  if (!membership?.active || membership.role !== "admin") forbidden();
  return { user: { id: user.id, email: user.email ?? "" } };
}

export async function assertAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("ไม่มีสิทธิ์จัดการเนื้อหา");
  return session;
}

import "server-only";
import { requireAdminSession } from "@/lib/auth/admin-session";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { contactDepartments } from "@/content/static/site";

export type ContactDepartmentSlug = (typeof contactDepartments)[number]["slug"];
export type ContactInquiryInput = {
  departmentSlug: ContactDepartmentSlug;
  subject: string;
  fullName: string;
  phone: string;
  email: string;
  lineId: string;
  message: string;
};

type InquiryRow = {
  id: string;
  department_slug: ContactDepartmentSlug;
  subject: string;
  full_name: string;
  phone: string;
  email: string;
  line_id: string;
  message: string;
  status: "new" | "in_progress" | "closed";
  created_at: string;
};

export type ContactInquiry = {
  id: string;
  departmentSlug: ContactDepartmentSlug;
  subject: string;
  fullName: string;
  phone: string;
  email: string;
  lineId: string;
  message: string;
  status: InquiryRow["status"];
  createdAt: string;
};

export async function submitContactInquiry(input: ContactInquiryInput): Promise<string> {
  const client = createSupabasePublicClient();
  const { data, error } = await client.rpc("submit_contact_inquiry", {
    p_department_slug: input.departmentSlug,
    p_subject: input.subject,
    p_full_name: input.fullName,
    p_phone: input.phone,
    p_email: input.email,
    p_line_id: input.lineId,
    p_message: input.message,
  });
  if (error || typeof data !== "string") {
    if (error?.message.includes("rate limit")) throw new Error("กรุณารอสักครู่ก่อนส่งเรื่องอีกครั้ง");
    throw new Error("ส่งข้อมูลไม่สำเร็จ กรุณาลองอีกครั้งหรือติดต่อสำนักงานทางโทรศัพท์");
  }
  return data;
}

export async function listAdminContactInquiries(department?: ContactDepartmentSlug): Promise<ContactInquiry[]> {
  await requireAdminSession();
  const client = await createSupabaseServerClient();
  let query = client.from("contact_inquiries")
    .select("id, department_slug, subject, full_name, phone, email, line_id, message, status, created_at")
    .order("created_at", { ascending: false }).limit(100);
  if (department) query = query.eq("department_slug", department);
  const { data, error } = await query;
  if (error) throw new Error("โหลดข้อความติดต่อไม่สำเร็จ");
  return ((data ?? []) as InquiryRow[]).map((row) => ({
    id: row.id, departmentSlug: row.department_slug, subject: row.subject,
    fullName: row.full_name, phone: row.phone, email: row.email, lineId: row.line_id,
    message: row.message, status: row.status, createdAt: row.created_at,
  }));
}

export async function countNewContactInquiries(): Promise<number> {
  await requireAdminSession();
  const client = await createSupabaseServerClient();
  const { count, error } = await client.from("contact_inquiries")
    .select("id", { count: "exact", head: true }).eq("status", "new");
  if (error) throw new Error("โหลดจำนวนข้อความติดต่อไม่สำเร็จ");
  return count ?? 0;
}

export async function updateContactInquiryStatus(id: string, status: InquiryRow["status"]) {
  await requireAdminSession();
  const client = await createSupabaseServerClient();
  const { data, error } = await client.from("contact_inquiries")
    .update({ status, updated_at: new Date().toISOString() }).eq("id", id)
    .select("id").maybeSingle();
  if (error || !data) throw new Error("เปลี่ยนสถานะข้อความไม่สำเร็จ");
}

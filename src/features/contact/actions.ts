"use server";

import { revalidatePath } from "next/cache";
import { contactDepartments } from "@/content/static/site";
import { requireAdminSession } from "@/lib/auth/admin-session";
import { submitContactInquiry, updateContactInquiryStatus } from "./contact-store";
import type { ContactDepartmentSlug, ContactInquiryInput, ContactInquiry } from "./contact-store";

export type ContactFormState = { error: string | null; reference: string | null };

function field(form: FormData, name: string, max: number, required = false) {
  const raw = form.get(name);
  const value = typeof raw === "string" ? raw.trim() : "";
  if (value.length > max || (required && !value)) throw new Error("กรุณาตรวจข้อมูลในแบบฟอร์มให้ครบถ้วน");
  return value;
}

function parseInput(form: FormData): ContactInquiryInput {
  const departmentSlug = field(form, "department", 40, true);
  if (!contactDepartments.some((department) => department.slug === departmentSlug)) {
    throw new Error("กรุณาเลือกฝ่ายที่ต้องการติดต่อ");
  }
  const input: ContactInquiryInput = {
    departmentSlug: departmentSlug as ContactDepartmentSlug,
    subject: field(form, "subject", 160, true),
    fullName: field(form, "fullName", 160, true),
    phone: field(form, "phone", 30),
    email: field(form, "email", 254).toLowerCase(),
    lineId: field(form, "lineId", 80),
    message: field(form, "message", 4000, true),
  };
  if (!input.phone && !input.email && !input.lineId) throw new Error("กรุณาระบุช่องทางติดต่อกลับอย่างน้อยหนึ่งช่องทาง");
  if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) throw new Error("รูปแบบอีเมลไม่ถูกต้อง");
  if (input.phone && !/^[0-9+() -]{7,30}$/.test(input.phone)) throw new Error("รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง");
  return input;
}

export async function submitContactAction(_state: ContactFormState, form: FormData): Promise<ContactFormState> {
  try {
    if (field(form, "website", 200)) return { error: null, reference: "" };
    const input = parseInput(form);
    const reference = await submitContactInquiry(input);
    return { error: null, reference };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "ส่งข้อมูลไม่สำเร็จ", reference: null };
  }
}

export async function changeContactStatusAction(form: FormData) {
  await requireAdminSession();
  const id = field(form, "id", 36, true);
  const status = field(form, "status", 20, true);
  if (!/^[0-9a-f-]{36}$/.test(id) || !["new", "in_progress", "closed"].includes(status)) {
    throw new Error("ข้อมูลสถานะไม่ถูกต้อง");
  }
  await updateContactInquiryStatus(id, status as ContactInquiry["status"]);
  revalidatePath("/admin/inquiries");
}

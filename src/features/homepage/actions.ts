"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin } from "@/lib/auth/admin-session";
import { saveFeatureSelection } from "./feature-store";
import type { FeatureSelection } from "./feature-store";

export async function saveHomepageFeaturesAction(form: FormData) {
  await assertAdmin();
  const read = (key: string) => {
    const value = form.get(key);
    return typeof value === "string" && value.length <= 36 && value ? value : null;
  };
  const next: FeatureSelection = {
    article_1: read("article_1"),
    project_1: read("project_1"),
    project_2: read("project_2"),
  };
  try { await saveFeatureSelection(next); }
  catch (error) {
    const message = error instanceof Error ? error.message : "บันทึกไม่สำเร็จ";
    redirect(`/admin/homepage/features?error=${encodeURIComponent(message)}`);
  }
  revalidatePath("/");
  redirect("/admin/homepage/features?saved=1");
}

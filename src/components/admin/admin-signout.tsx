"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AdminSignout() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="admin-signout"
      onClick={async () => {
        await createSupabaseBrowserClient().auth.signOut();
        router.replace("/admin/login");
        router.refresh();
      }}
    >
      ออกจากระบบ
    </button>
  );
}

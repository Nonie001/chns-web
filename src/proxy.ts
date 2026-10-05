import type { NextRequest } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSupabaseSession(request);
}

export const config = {
  matcher: ["/admin/:path*", "/api/hero-images/:path*", "/api/article-images/:path*", "/api/project-images/:path*", "/api/report-files/:path*", "/api/partner-logos/:path*"],
};

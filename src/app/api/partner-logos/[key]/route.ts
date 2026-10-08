import { getAdminSession } from "@/lib/auth/admin-session";
import { getPartnerByLogoKey } from "@/features/partners/partner-store";
import { isPartnerLogoKey, readPartnerLogo } from "@/lib/storage/partner-logos";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: RouteContext<"/api/partner-logos/[key]">) {
  const { key } = await params;
  if (!isPartnerLogoKey(key)) return new Response(null, { status: 404 });
  const partner = await getPartnerByLogoKey(key);
  if (!partner) return new Response(null, { status: 404 });
  if ((partner.status !== "published" || !partner.rightsConfirmed) && !(await getAdminSession())) return new Response(null, { status: 404 });
  // A logo key is unique to its uploaded bytes. Revalidate access on every request,
  // then let the browser reuse those bytes without another Storage download.
  const headers = {
    "Cache-Control": "private, no-cache",
    "ETag": `"${key}"`,
    "X-Content-Type-Options": "nosniff",
  };
  if (request.headers.get("if-none-match") === headers.ETag) {
    return new Response(null, { status: 304, headers });
  }
  const image = await readPartnerLogo(key, partner.status !== "published" || !partner.rightsConfirmed);
  if (!image) return new Response(null, { status: 404 });
  return new Response(new Uint8Array(image), { headers: { ...headers, "Content-Type": "image/webp" } });
}

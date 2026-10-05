import { getAdminSession } from "@/lib/auth/admin-session";
import { getSlideByImageKey } from "@/features/hero/slide-store";
import { isHeroImageKey, readHeroImage } from "@/lib/storage/hero-images";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/hero-images/[key]">,
) {
  const { key } = await params;
  if (!isHeroImageKey(key)) return new Response(null, { status: 404 });
  const slide = await getSlideByImageKey(key);
  if (!slide) return new Response(null, { status: 404 });
  if (slide.status !== "published" && !(await getAdminSession())) {
    return new Response(null, { status: 404 });
  }
  const image = await readHeroImage(key, slide.status !== "published");
  if (!image) return new Response(null, { status: 404 });
  return new Response(new Uint8Array(image), {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

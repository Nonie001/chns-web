import { getAdminSession } from "@/lib/auth/admin-session";
import { getArticleByImageKey } from "@/features/articles/article-store";
import { isArticleImageKey, readArticleImage } from "@/lib/storage/article-images";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: RouteContext<"/api/article-images/[key]">) {
  const { key } = await params;
  if (!isArticleImageKey(key)) return new Response(null, { status: 404 });
  const article = await getArticleByImageKey(key);
  if (!article) return new Response(null, { status: 404 });
  if (article.status !== "published" && !article.showcaseVisible && !(await getAdminSession())) {
    return new Response(null, { status: 404 });
  }
  const image = await readArticleImage(key, article.status !== "published" && !article.showcaseVisible);
  if (!image) return new Response(null, { status: 404 });
  return new Response(new Uint8Array(image), {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

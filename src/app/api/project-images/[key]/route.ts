import { getAdminSession } from "@/lib/auth/admin-session";
import { getProjectByImageKey } from "@/features/projects/project-store";
import { isProjectImageKey, readProjectImage } from "@/lib/storage/project-images";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: RouteContext<"/api/project-images/[key]">) {
  const { key } = await params;
  if (!isProjectImageKey(key)) return new Response(null, { status: 404 });
  const project = await getProjectByImageKey(key);
  if (!project) return new Response(null, { status: 404 });
  if (project.status !== "published" && !project.showcaseVisible && !(await getAdminSession())) return new Response(null, { status: 404 });
  const image = await readProjectImage(key, project.status !== "published" && !project.showcaseVisible);
  if (!image) return new Response(null, { status: 404 });
  return new Response(new Uint8Array(image), {
    headers: { "Content-Type": "image/webp", "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" },
  });
}

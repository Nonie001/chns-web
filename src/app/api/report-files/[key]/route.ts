import { getAdminSession } from "@/lib/auth/admin-session";
import { getReportByFileKey } from "@/features/reports/report-store";
import { isReportFileKey, readReportFile } from "@/lib/storage/report-files";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: RouteContext<"/api/report-files/[key]">) {
  const { key } = await params;
  if (!isReportFileKey(key)) return new Response(null, { status: 404 });
  const report = await getReportByFileKey(key);
  if (!report) return new Response(null, { status: 404 });
  if (report.status !== "published" && !(await getAdminSession())) return new Response(null, { status: 404 });
  const file = await readReportFile(key, report.status !== "published");
  if (!file) return new Response(null, { status: 404 });
  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="chns-report.pdf"',
      "Content-Security-Policy": "sandbox",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

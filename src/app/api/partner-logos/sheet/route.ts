import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { listPublishedPartners } from "@/features/partners/partner-store";
import { logoSheetCellHeight, logoSheetCellWidth, logoSheetColumns, logoSheetVersion } from "@/features/partners/logo-sheet";
import { readPartnerLogo } from "@/lib/storage/partner-logos";
import baselineSheet from "@/lib/storage/partner-logo-sheet-baseline.json";

export const runtime = "nodejs";

let cachedSheet: { version: string; bytes: Buffer } | null = null;

export async function GET(request: Request) {
  const partners = await listPublishedPartners();
  if (!partners.length) return new Response(null, { status: 404 });
  const version = logoSheetVersion(partners);
  if (new URL(request.url).searchParams.get("v") !== version) return new Response(null, { status: 404 });

  const headers = {
    "Cache-Control": "private, no-cache",
    "ETag": `"${version}"`,
    "X-Content-Type-Options": "nosniff",
  };
  if (request.headers.get("if-none-match") === headers.ETag) {
    return new Response(null, { status: 304, headers });
  }

  if (cachedSheet?.version !== version) {
    let bytes: Buffer | null = null;
    if (version === baselineSheet.version) {
      try {
        bytes = await readFile(join(process.cwd(), "assets", "partner-logos", "initial-sheet.webp"));
      } catch {
        // Fall back to composing the current approved list if the baseline is unavailable.
      }
    }
    if (!bytes) {
      const images = await Promise.all(partners.map((partner) =>
        readPartnerLogo(partner.logoSrc.split("/").at(-1) ?? "")));
      const rows = Math.ceil(partners.length / logoSheetColumns);
      const layers = (await Promise.all(images.map(async (image, index) => image ? ({
        input: await sharp(image).resize(logoSheetCellWidth, logoSheetCellHeight, {
          fit: "contain", background: "#ffffff",
        }).toBuffer(),
        left: (index % logoSheetColumns) * logoSheetCellWidth,
        top: Math.floor(index / logoSheetColumns) * logoSheetCellHeight,
      }) : null))).filter((layer) => layer !== null);
      bytes = await sharp({ create: {
        width: logoSheetColumns * logoSheetCellWidth,
        height: rows * logoSheetCellHeight,
        channels: 4,
        background: "#ffffff",
      } }).composite(layers).webp({ quality: 82, effort: 4 }).toBuffer();
    }
    cachedSheet = { version, bytes };
  }

  return new Response(new Uint8Array(cachedSheet.bytes), {
    headers: { ...headers, "Content-Type": "image/webp" },
  });
}

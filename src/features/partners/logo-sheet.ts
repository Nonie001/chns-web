import "server-only";
import { createHash } from "node:crypto";
import type { PublicPartner } from "./types";

export const logoSheetColumns = 12;
export const logoSheetCellWidth = 100;
export const logoSheetCellHeight = 100;

export function logoSheetVersion(partners: PublicPartner[]) {
  return createHash("sha256")
    .update("square-cells-100-no-padding\n")
    .update(partners.map((partner) => partner.logoSrc).join("\n"))
    .digest("hex")
    .slice(0, 16);
}

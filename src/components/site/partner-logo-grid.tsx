import { logoSheetColumns, logoSheetVersion } from "@/features/partners/logo-sheet";
import type { PublicPartner } from "@/features/partners/types";

export function PartnerLogoGrid({ partners }: { partners: PublicPartner[] }) {
  const rows = Math.ceil(partners.length / logoSheetColumns);
  const sheetUrl = `/api/partner-logos/sheet?v=${logoSheetVersion(partners)}`;
  return <ul className="partner-grid">
    {partners.map((partner, index) => <li className="partner-logo" id={`partner-${partner.id}`} key={partner.id}>
      <span className="partner-logo__image partner-logo__image--sheet" role="img" aria-label={partner.logoAlt} style={{
        backgroundImage: `url("${sheetUrl}")`,
        backgroundSize: `${logoSheetColumns * 100}% ${rows * 100}%`,
        backgroundPosition: `${(index % logoSheetColumns) * 100 / (logoSheetColumns - 1)}% ${rows === 1 ? 0 : Math.floor(index / logoSheetColumns) * 100 / (rows - 1)}%`,
      }}>
      </span>
    </li>)}
  </ul>;
}

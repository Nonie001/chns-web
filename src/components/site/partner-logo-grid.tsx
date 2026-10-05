import Image from "next/image";
import type { PublicPartner } from "@/features/partners/types";

export function PartnerLogoGrid({ partners }: { partners: PublicPartner[] }) {
  return <ul className="partner-grid">
    {partners.map((partner) => <li className="partner-logo" id={`partner-${partner.id}`} key={partner.id}>
      <span className="partner-logo__image">
        <Image src={partner.logoSrc} alt={partner.logoAlt} fill sizes="(max-width: 480px) 23vw, (max-width: 700px) 18vw, (max-width: 1100px) 12vw, 100px" unoptimized />
      </span>
    </li>)}
  </ul>;
}

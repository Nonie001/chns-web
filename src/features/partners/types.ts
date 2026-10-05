export type PartnerStatus = "draft" | "published" | "archived";

export type Partner = {
  id: string;
  name: string;
  websiteUrl: string;
  logoKey: string;
  logoAlt: string;
  logoCredit: string;
  rightsConfirmed: boolean;
  status: PartnerStatus;
  position: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

export type PartnerInput = Pick<Partner, "name" | "websiteUrl" | "logoAlt" | "logoCredit" | "rightsConfirmed">;
export type PublicPartner = Pick<Partner, "id" | "name" | "websiteUrl" | "logoAlt"> & { logoSrc: string };

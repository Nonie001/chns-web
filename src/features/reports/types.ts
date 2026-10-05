export type ReportStatus = "draft" | "published" | "archived";

export type Report = {
  id: string;
  slug: string;
  title: string;
  kind: string;
  year: number;
  summary: string;
  source: string;
  fileKey: string | null;
  fileRightsConfirmed: boolean;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

export type ReportInput = Pick<Report, "slug" | "title" | "kind" | "year" | "summary" | "source" | "fileRightsConfirmed">;
export type PublicReport = Pick<Report, "slug" | "title" | "kind" | "year" | "summary" | "source" | "publishedAt"> & { fileUrl: string };

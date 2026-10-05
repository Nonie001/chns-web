export type ProjectStatus = "draft" | "published" | "archived";

export type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  departmentSlug: string;
  summary: string;
  body: string;
  imageKey: string | null;
  imageAlt: string;
  imageCredit: string;
  imageRightsConfirmed: boolean;
  status: ProjectStatus;
  isMockup: boolean;
  showcaseVisible: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

export type ProjectInput = Pick<Project, "slug" | "title" | "category" | "location" | "departmentSlug" | "summary" | "body" | "imageAlt" | "imageCredit" | "imageRightsConfirmed">;

export type PublicProject = Pick<Project, "slug" | "title" | "category" | "location" | "departmentSlug" | "summary" | "body" | "imageAlt" | "imageCredit" | "publishedAt"> & { imageSrc: string | null; isDemo: boolean };

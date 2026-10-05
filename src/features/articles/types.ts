export type ArticleStatus = "draft" | "published" | "archived";
export type ArticleKind = "news" | "story";

export type Article = {
  id: string;
  slug: string;
  title: string;
  kind: ArticleKind;
  summary: string;
  body: string;
  imageKey: string | null;
  imageAlt: string;
  imageCredit: string;
  imageRightsConfirmed: boolean;
  status: ArticleStatus;
  isMockup: boolean;
  showcaseVisible: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

export type ArticleInput = Pick<Article, "slug" | "title" | "kind" | "summary" | "body" | "imageAlt" | "imageCredit" | "imageRightsConfirmed">;

export type PublicArticle = Pick<Article, "slug" | "title" | "kind" | "summary" | "body" | "imageAlt" | "imageCredit" | "publishedAt"> & {
  imageSrc: string | null;
  isDemo: boolean;
};

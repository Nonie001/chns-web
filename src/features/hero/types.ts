export type HeroSlideStatus = "draft" | "published" | "archived";

export type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  imageKey: string;
  mobileImageKey: string | null;
  imageAlt: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  status: HeroSlideStatus;
  position: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

export type HeroSlideInput = Pick<HeroSlide, "title" | "imageAlt">;

export type HeroCarouselItem = {
  id: string;
  imageSrc: string;
  mobileImageSrc: string | null;
  imageAlt: string;
};

export type HeroSlideStatus = "draft" | "published" | "archived";

export type HeroSlide = {
  id: string;
  title: string;
  imageKey: string;
  mobileImageKey: string | null;
  imageAlt: string;
  status: HeroSlideStatus;
  position: number;
  publishedAt: string | null;
};

export type HeroSlideInput = Pick<HeroSlide, "title" | "imageAlt">;

export type HeroCarouselItem = {
  id: string;
  imageSrc: string;
  mobileImageSrc: string | null;
  imageAlt: string;
};

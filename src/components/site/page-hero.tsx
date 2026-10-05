import Image from "next/image";
import { SiteBreadcrumbs, type BreadcrumbItem } from "./site-breadcrumbs";

export function PageHero({
  eyebrow,
  title,
  description,
  imageSrc,
  imageCaption,
  parent,
}: {
  eyebrow: string;
  title: string;
  description: string;
  imageSrc?: string;
  imageCaption?: string;
  parent?: BreadcrumbItem;
}) {
  return (
    <>
    <SiteBreadcrumbs items={[...(parent ? [parent] : []), { label: title }]} />
    <section className={imageSrc ? "inner-hero inner-hero--image" : "inner-hero"}>
      <div className={imageSrc ? "shell inner-hero__feature" : "shell inner-hero__grid"}>
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          {imageSrc && <p className="inner-hero__description">{description}</p>}
        </div>
        {imageSrc ? <figure className="inner-hero__media">
          <Image src={imageSrc} alt="" fill sizes="(max-width: 800px) 100vw, 48vw" />
          {imageCaption && <figcaption>{imageCaption}</figcaption>}
        </figure> : <p>{description}</p>}
      </div>
    </section>
    </>
  );
}

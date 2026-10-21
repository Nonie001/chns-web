import type { CSSProperties } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  imageSrc,
  imagePosition,
}: {
  eyebrow: string;
  title: string;
  description: string;
  imageSrc?: string;
  imagePosition?: string;
}) {
  return (
    <section className="inner-hero" style={imageSrc ? ({ "--hero-image": `url(${imageSrc})`, "--hero-position": imagePosition } as CSSProperties) : undefined}>
      <div className="shell inner-hero__grid">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
        </div>
        <p>{description}</p>
      </div>
    </section>
  );
}

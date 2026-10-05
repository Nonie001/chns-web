"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { HeroCarouselItem } from "@/features/hero/types";

export function HeroCarousel({ slides }: { slides: HeroCarouselItem[] }) {
  const [active, setActive] = useState(0);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    if (slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  function goTo(index: number) {
    setActive((index + slides.length) % slides.length);
  }

  return (
    <section
      className={`hero-slider${slides.every((slide) => !slide.mobileImageSrc) ? " hero-slider--landscape-only" : ""}`}
      aria-roledescription="carousel"
      aria-label="ภาพสไลด์หน้าแรก"
      onTouchStart={(event) => {
        touchStart.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const delta = event.changedTouches[0]?.clientX - touchStart.current;
        if (delta && Math.abs(delta) > 45) goTo(active + (delta < 0 ? 1 : -1));
        touchStart.current = null;
      }}
    >
      <div className="hero-slider__images">
        {slides.map((slide, index) => (
          <div
            className={`hero-slider__image${index === active ? " is-active" : ""}`}
            key={slide.id}
            aria-hidden={index !== active}
          >
            <Image
              className="hero-slider__backdrop"
              src={slide.imageSrc}
              alt=""
              fill
              sizes="100vw"
              priority={index === 0}
              unoptimized={slide.imageSrc.startsWith("/api/")}
              aria-hidden="true"
            />
            <picture>
              {slide.mobileImageSrc && (
                <source media="(max-width: 700px)" srcSet={slide.mobileImageSrc} />
              )}
              <Image
                className="hero-slider__art"
                src={slide.imageSrc}
                alt={index === active ? slide.imageAlt : ""}
                fill
                sizes="100vw"
                priority={index === 0}
                unoptimized={slide.imageSrc.startsWith("/api/")}
              />
            </picture>
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <div className="hero-slider__controls" aria-label="ควบคุมสไลด์">
          <button type="button" onClick={() => goTo(active - 1)} aria-label="สไลด์ก่อนหน้า">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m15 5-7 7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div className="hero-slider__dots">
            {slides.map((slide, index) => (
              <button
                type="button"
                className={index === active ? "is-active" : ""}
                key={slide.id}
                onClick={() => goTo(index)}
                aria-label={`ไปสไลด์ที่ ${index + 1}`}
                aria-current={index === active ? "true" : undefined}
              />
            ))}
          </div>
          <button type="button" onClick={() => goTo(active + 1)} aria-label="สไลด์ถัดไป">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      )}
    </section>
  );
}

"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type PhotoSlide = {
  src: string;
  title: string;
  caption: string;
};

export function PhotoSlider({ slides, label }: { slides: readonly PhotoSlide[]; label: string }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [overflowing, setOverflowing] = useState(false);

  const sync = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setOverflowing(track.scrollWidth - track.clientWidth > 4);
    const items = Array.from(track.children) as HTMLElement[];
    const center = track.scrollLeft + track.clientWidth / 2;
    let nearest = 0;
    let shortest = Number.POSITIVE_INFINITY;
    items.forEach((item, index) => {
      const distance = Math.abs(item.offsetLeft + item.offsetWidth / 2 - center);
      if (distance < shortest) {
        shortest = distance;
        nearest = index;
      }
    });
    setActive(nearest);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(track);
    return () => observer.disconnect();
  }, [sync]);

  function scrollToIndex(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const target = track.children[Math.max(0, Math.min(index, slides.length - 1))] as HTMLElement | undefined;
    if (!target) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: target.offsetLeft, behavior: reduced ? "auto" : "smooth" });
  }

  if (slides.length === 0) return null;

  return (
    <div className="photo-slider" role="group" aria-roledescription="carousel" aria-label={label}>
      <ul className="photo-slider__track" ref={trackRef} onScroll={sync} tabIndex={0} aria-label={`${label} (เลื่อนเพื่อดูภาพเพิ่ม)`}>
        {slides.map((slide, index) => (
          <li className="photo-slider__item" key={slide.src + slide.title} aria-label={`${index + 1} จาก ${slides.length}`}>
            <figure>
              <div className="photo-slider__media">
                <Image src={slide.src} alt="" fill sizes="(max-width: 700px) 86vw, (max-width: 1100px) 46vw, 32vw" />
              </div>
              <figcaption>
                <strong>{slide.title}</strong>
                <span>{slide.caption}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      {overflowing && (
        <div className="photo-slider__controls">
          <ol className="photo-slider__dots">
            {slides.map((slide, index) => (
              <li key={slide.src + slide.title}>
                <button
                  type="button"
                  className={index === active ? "is-active" : undefined}
                  aria-label={`ไปยังภาพที่ ${index + 1}: ${slide.title}`}
                  aria-current={index === active}
                  onClick={() => scrollToIndex(index)}
                />
              </li>
            ))}
          </ol>
          <div className="photo-slider__nav">
            <button type="button" aria-label="ภาพก่อนหน้า" disabled={active === 0} onClick={() => scrollToIndex(active - 1)}>
              <span aria-hidden="true">←</span>
            </button>
            <button type="button" aria-label="ภาพถัดไป" disabled={active === slides.length - 1} onClick={() => scrollToIndex(active + 1)}>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

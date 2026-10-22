"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const photos = [
  { src: "/editorial/chns/about-main.webp", alt: "กลุ่มผู้ร่วมงานส่งมอบสิ่งของช่วยเหลือ" },
  { src: "/editorial/chns/about-inset.webp", alt: "กลุ่มเครือข่ายร่วมถ่ายภาพกิจกรรม" },
  { src: "/editorial/chns/centers-body.webp", alt: "เครือข่ายและครอบครัวร่วมกิจกรรมช่วยเหลือผู้ประสบภัย" },
  { src: "/editorial/chns/gallery-field.webp", alt: "อาสาสมัครส่งมอบสิ่งของให้เด็กในพื้นที่" },
  { src: "/editorial/chns/gallery-winter.webp", alt: "ผู้ร่วมงานและเด็กร่วมกิจกรรมแบ่งปันเครื่องนุ่งห่ม" },
] as const;

export function StoryCarousel() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  function scrollToPhoto(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const next = Math.max(0, Math.min(index, photos.length - 1));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: next * track.clientWidth, behavior: reducedMotion ? "auto" : "smooth" });
    setActive(next);
  }

  function syncActive() {
    const track = trackRef.current;
    if (track?.clientWidth) setActive(Math.round(track.scrollLeft / track.clientWidth));
  }

  return (
    <figure className="about-story__media" role="group" aria-roledescription="carousel" aria-label="ภาพกิจกรรมของเครือข่าย">
      <ul className="about-story__track" ref={trackRef} onScroll={syncActive} tabIndex={0} aria-label="ภาพกิจกรรม เลื่อนเพื่อดูภาพถัดไป">
        {photos.map((photo, index) => (
          <li className="about-story__slide" key={photo.src} aria-label={`ภาพที่ ${index + 1} จาก ${photos.length}`}>
            <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 900px) 92vw, 52vw" priority={index === 0} />
          </li>
        ))}
      </ul>
      <div className="about-story__carousel-controls">
        <button className="about-story__carousel-arrow about-story__carousel-arrow--prev" type="button" aria-label="ภาพก่อนหน้า" disabled={active === 0} onClick={() => scrollToPhoto(active - 1)}>‹</button>
        <div className="about-story__carousel-dots" aria-label="เลือกภาพกิจกรรม">
          {photos.map((photo, index) => (
            <button
              type="button"
              key={photo.src}
              className={index === active ? "is-active" : undefined}
              aria-label={`ไปยังภาพที่ ${index + 1}`}
              aria-current={index === active ? "true" : undefined}
              onClick={() => scrollToPhoto(index)}
            />
          ))}
        </div>
        <button className="about-story__carousel-arrow about-story__carousel-arrow--next" type="button" aria-label="ภาพถัดไป" disabled={active === photos.length - 1} onClick={() => scrollToPhoto(active + 1)}>›</button>
      </div>
    </figure>
  );
}

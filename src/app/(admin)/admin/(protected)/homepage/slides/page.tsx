import Image from "next/image";
import Link from "next/link";
import {
  changeSlideStatusAction,
  moveSlideAction,
} from "@/features/hero/actions";
import { listAdminSlides } from "@/features/hero/slide-store";

const statusLabels = {
  draft: "ร่าง",
  published: "เผยแพร่",
  archived: "เก็บถาวร",
} as const;

export default async function AdminSlidesPage() {
  const slides = await listAdminSlides();
  return (
    <>
      <div className="admin-page-header admin-page-header--row">
        <div>
          <p className="eyebrow">HOMEPAGE</p>
          <h1>สไลด์หน้าแรก</h1>
          <p>จัดภาพสไลด์หน้าแรก พร้อมภาพสำหรับมือถือและลำดับการแสดง</p>
        </div>
        <Link
          href="/admin/homepage/slides/new"
          className="button button--accent"
        >
          + เพิ่มสไลด์
        </Link>
      </div>
      <div className="admin-slide-list">
        {slides.length === 0 ? (
          <div className="admin-empty">
            <h2>ยังไม่มีสไลด์ที่จัดการผ่านหลังบ้าน</h2>
            <p>
              เพิ่มสไลด์แรกได้เลย
              ภาพจำลองจะยังแสดงบนเว็บตัวอย่างจนกว่าจะเผยแพร่สไลด์จริง
            </p>
          </div>
        ) : (
          slides.map((slide, index) => (
            <article className="admin-slide-card" key={slide.id}>
              <div className="admin-slide-card__image">
                <Image
                  src={`/api/hero-images/${slide.imageKey}`}
                  alt={slide.imageAlt}
                  fill
                  sizes="(max-width: 800px) 100vw, 260px"
                  unoptimized
                />
              </div>
              <div className="admin-slide-card__content">
                <span className={`admin-status admin-status--${slide.status}`}>
                  {statusLabels[slide.status]}
                </span>
                <h2>{slide.title}</h2>
                <p>{slide.mobileImageKey ? "มีภาพสำหรับมือถือ" : "ใช้ภาพเดียวกันทุกหน้าจอ"}</p>
                <div className="admin-slide-card__actions">
                  <Link
                    className="button button--dark"
                    href={`/admin/homepage/slides/${slide.id}`}
                  >
                    แก้ไข
                  </Link>
                  <form action={changeSlideStatusAction}>
                    <input type="hidden" name="id" value={slide.id} />
                    <input
                      type="hidden"
                      name="status"
                      value={
                        slide.status === "published" ? "draft" : "published"
                      }
                    />
                    <button type="submit">
                      {slide.status === "published" ? "ปิดเผยแพร่" : "เผยแพร่"}
                    </button>
                  </form>
                  <form action={changeSlideStatusAction}>
                    <input type="hidden" name="id" value={slide.id} />
                    <input
                      type="hidden"
                      name="status"
                      value={slide.status === "archived" ? "draft" : "archived"}
                    />
                    <button type="submit">
                      {slide.status === "archived" ? "คืนค่าร่าง" : "เก็บถาวร"}
                    </button>
                  </form>
                </div>
              </div>
              <div className="admin-slide-card__order">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <form action={moveSlideAction}>
                  <input type="hidden" name="id" value={slide.id} />
                  <input type="hidden" name="direction" value="up" />
                  <button
                    type="submit"
                    disabled={index === 0}
                    aria-label={`เลื่อน ${slide.title} ขึ้น`}
                  >
                    ↑
                  </button>
                </form>
                <form action={moveSlideAction}>
                  <input type="hidden" name="id" value={slide.id} />
                  <input type="hidden" name="direction" value="down" />
                  <button
                    type="submit"
                    disabled={index === slides.length - 1}
                    aria-label={`เลื่อน ${slide.title} ลง`}
                  >
                    ↓
                  </button>
                </form>
              </div>
            </article>
          ))
        )}
      </div>
    </>
  );
}

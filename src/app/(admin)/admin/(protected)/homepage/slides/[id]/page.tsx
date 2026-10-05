import Link from "next/link";
import { notFound } from "next/navigation";
import { SlideEditor } from "@/components/admin/slide-editor";
import { getAdminSlide } from "@/features/hero/slide-store";

export default async function EditSlidePage({
  params,
}: PageProps<"/admin/homepage/slides/[id]">) {
  const { id } = await params;
  const slide = await getAdminSlide(id);
  if (!slide) notFound();
  return (
    <>
      <div className="admin-page-header">
        <Link className="text-link" href="/admin/homepage/slides">
          ← กลับไปรายการ
        </Link>
        <p className="eyebrow">EDIT SLIDE</p>
        <h1>แก้ไขสไลด์</h1>
        <p>
          สถานะปัจจุบัน:{" "}
          {slide.status === "published"
            ? "เผยแพร่"
            : slide.status === "draft"
              ? "ร่าง"
              : "เก็บถาวร"}
        </p>
      </div>
      <SlideEditor slide={slide} />
    </>
  );
}

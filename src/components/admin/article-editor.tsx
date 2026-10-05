"use client";

import Image from "next/image";
import { useActionState } from "react";
import { saveArticleAction } from "@/features/articles/actions";
import type { Article } from "@/features/articles/types";

export function ArticleEditor({ article }: { article?: Article }) {
  const [state, action, pending] = useActionState(saveArticleAction, { error: null });
  return (
    <form className="slide-editor" action={action}>
      <input type="hidden" name="id" value={article?.id ?? ""} />
      <div className="slide-editor__fields">
        <label>
          ประเภท
          <select name="kind" defaultValue={article?.kind ?? "news"} required>
            <option value="news">ข่าว</option>
            <option value="story">บทความ</option>
          </select>
        </label>
        <label>
          Slug สำหรับ URL
          <input name="slug" defaultValue={article?.slug ?? ""} maxLength={80} pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="community-support" required />
        </label>
        <label className="slide-editor__wide">
          หัวเรื่อง
          <input name="title" defaultValue={article?.title ?? ""} maxLength={160} required />
        </label>
        <label className="slide-editor__wide">
          สรุปสำหรับการ์ดและผลค้นหา
          <textarea name="summary" defaultValue={article?.summary ?? ""} maxLength={400} rows={3} required />
        </label>
        <label className="slide-editor__wide">
          เนื้อหา
          <textarea name="body" defaultValue={article?.body ?? ""} maxLength={20000} rows={16} required />
          <small>ใช้บรรทัดว่างคั่นย่อหน้า ระบบจะแสดงเป็นข้อความธรรมดาเพื่อป้องกัน HTML ที่ไม่ปลอดภัย</small>
        </label>
        <label className="slide-editor__wide">
          ภาพปก {article ? "(ไม่เลือก = ใช้ภาพเดิม)" : "(ไม่บังคับ)"}
          <input name="image" type="file" accept="image/jpeg,image/png,image/webp" />
          <small>JPG, PNG หรือ WebP · กว้างอย่างน้อย 800 px · ไม่เกิน 5 MB</small>
        </label>
        {article?.imageKey && (
          <div className="slide-editor__preview">
            <Image src={`/api/article-images/${article.imageKey}`} alt={article.imageAlt} width={640} height={360} unoptimized />
            <label><input name="removeImage" type="checkbox" /> ลบภาพปก</label>
          </div>
        )}
        <label className="slide-editor__wide">
          คำอธิบายภาพ
          <input name="imageAlt" defaultValue={article?.imageAlt ?? ""} maxLength={180} />
        </label>
        <label className="slide-editor__wide">
          เครดิตและที่มาภาพ
          <input name="imageCredit" defaultValue={article?.imageCredit ?? ""} maxLength={180} />
        </label>
        <label className="article-editor__consent slide-editor__wide">
          <input name="imageRightsConfirmed" type="checkbox" defaultChecked={article?.imageRightsConfirmed ?? false} />
          ยืนยันว่ามีสิทธิ์เผยแพร่ภาพนี้บนเว็บไซต์ CHNS
        </label>
      </div>
      <p className="slide-editor__hint">
        {article?.status === "published"
          ? "บทความนี้เผยแพร่อยู่ การบันทึกจะแก้หน้าเว็บทันทีและบันทึกประวัติการเปลี่ยนแปลง"
          : "บันทึกแล้วจะยังเป็นร่างจนกดเผยแพร่จากหน้ารายการ"}
      </p>
      {state.error && <p className="admin-form-error" role="alert">{state.error}</p>}
      <button className="button button--accent" type="submit" disabled={pending}>
        {pending ? "กำลังบันทึก…" : "บันทึกบทความ"}
      </button>
    </form>
  );
}

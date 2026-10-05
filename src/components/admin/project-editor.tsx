"use client";

import Image from "next/image";
import { useActionState } from "react";
import { departments } from "@/content/static/site";
import { saveProjectAction } from "@/features/projects/actions";
import type { Project } from "@/features/projects/types";

export function ProjectEditor({ project }: { project?: Project }) {
  const [state, action, pending] = useActionState(saveProjectAction, { error: null });
  return (
    <form className="slide-editor" action={action}>
      <input type="hidden" name="id" value={project?.id ?? ""} />
      <div className="slide-editor__fields">
        <label>
          Slug สำหรับ URL
          <input name="slug" defaultValue={project?.slug ?? ""} maxLength={80} pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="community-support" required />
        </label>
        <label>
          ฝ่ายรับผิดชอบ
          <select name="departmentSlug" defaultValue={project?.departmentSlug ?? ""} required>
            <option value="" disabled>เลือกฝ่าย</option>
            {departments.map((department) => <option value={department.slug} key={department.slug}>{department.name}</option>)}
          </select>
        </label>
        <label className="slide-editor__wide">
          ชื่อโครงการ
          <input name="title" defaultValue={project?.title ?? ""} maxLength={160} required />
        </label>
        <label>
          ประเภทภารกิจ
          <input name="category" defaultValue={project?.category ?? ""} maxLength={80} required />
        </label>
        <label>
          พื้นที่ดำเนินงานที่เผยแพร่ได้
          <input name="location" defaultValue={project?.location ?? ""} maxLength={120} required />
        </label>
        <label className="slide-editor__wide">
          สรุปโครงการ
          <textarea name="summary" defaultValue={project?.summary ?? ""} maxLength={400} rows={3} required />
        </label>
        <label className="slide-editor__wide">
          รายละเอียด
          <textarea name="body" defaultValue={project?.body ?? ""} maxLength={20000} rows={16} required />
          <small>ใช้บรรทัดว่างคั่นย่อหน้า ข้อมูลผลลัพธ์และตัวเลขต้องมีหลักฐานก่อนใส่ในเนื้อหา</small>
        </label>
        <label className="slide-editor__wide">
          ภาพปก {project ? "(ไม่เลือก = ใช้ภาพเดิม)" : "(ไม่บังคับ)"}
          <input name="image" type="file" accept="image/jpeg,image/png,image/webp" />
          <small>JPG, PNG หรือ WebP · กว้างอย่างน้อย 800 px · ไม่เกิน 5 MB</small>
        </label>
        {project?.imageKey && (
          <div className="slide-editor__preview">
            <Image src={`/api/project-images/${project.imageKey}`} alt={project.imageAlt} width={640} height={360} unoptimized />
            <label><input name="removeImage" type="checkbox" /> ลบภาพปก</label>
          </div>
        )}
        <label className="slide-editor__wide">
          คำอธิบายภาพ
          <input name="imageAlt" defaultValue={project?.imageAlt ?? ""} maxLength={180} />
        </label>
        <label className="slide-editor__wide">
          เครดิตและที่มาภาพ
          <input name="imageCredit" defaultValue={project?.imageCredit ?? ""} maxLength={180} />
        </label>
        <label className="article-editor__consent slide-editor__wide">
          <input name="imageRightsConfirmed" type="checkbox" defaultChecked={project?.imageRightsConfirmed ?? false} />
          ยืนยันว่ามีสิทธิ์เผยแพร่ภาพนี้บนเว็บไซต์ CHNS
        </label>
      </div>
      <p className="slide-editor__hint">{project?.status === "published" ? "โครงการนี้เผยแพร่อยู่ การบันทึกจะเปลี่ยนหน้าเว็บทันทีพร้อมบันทึกประวัติ" : "บันทึกแล้วจะยังเป็นร่างจนกดเผยแพร่จากหน้ารายการ"}</p>
      {state.error && <p className="admin-form-error" role="alert">{state.error}</p>}
      <button className="button button--accent" type="submit" disabled={pending}>{pending ? "กำลังบันทึก…" : "บันทึกโครงการ"}</button>
    </form>
  );
}

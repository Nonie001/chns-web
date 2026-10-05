import Link from "next/link";
import { ProjectEditor } from "@/components/admin/project-editor";

export default function NewProjectPage() {
  return (
    <>
      <div className="admin-page-header">
        <Link className="text-link" href="/admin/projects">← กลับไปรายการ</Link>
        <p className="eyebrow">NEW PROJECT</p><h1>เพิ่มโครงการ</h1>
        <p>สร้างร่างโครงการและตรวจข้อมูลก่อนเผยแพร่</p>
      </div>
      <ProjectEditor />
    </>
  );
}

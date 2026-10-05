import Link from "next/link";
import { ArticleEditor } from "@/components/admin/article-editor";

export default function NewArticlePage() {
  return (
    <>
      <div className="admin-page-header">
        <Link className="text-link" href="/admin/articles">← กลับไปรายการ</Link>
        <p className="eyebrow">NEW ARTICLE</p>
        <h1>เพิ่มข่าวหรือบทความ</h1>
        <p>เริ่มจากร่าง และเผยแพร่เมื่อข้อมูลกับสิทธิ์ภาพผ่านการตรวจแล้ว</p>
      </div>
      <ArticleEditor />
    </>
  );
}

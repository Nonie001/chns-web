import { saveHomepageFeaturesAction } from "@/features/homepage/actions";
import { getAdminFeatureEditorData } from "@/features/homepage/feature-store";

export default async function HomepageFeaturesPage({ searchParams }: PageProps<"/admin/homepage/features">) {
  const { selection, articles, projects } = await getAdminFeatureEditorData();
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error.slice(0, 180) : null;
  return (
    <>
      <div className="admin-page-header">
        <p className="eyebrow">HOMEPAGE</p><h1>เนื้อหาเด่นหน้าแรก</h1>
        <p>เลือกข่าวหนึ่งรายการและโครงการสองรายการจากเนื้อหาที่เผยแพร่แล้ว</p>
      </div>
      {error && <p className="admin-form-error" role="alert">{error}</p>}
      {params.saved === "1" && <p className="admin-success" role="status">บันทึกการเลือกเนื้อหาเด่นแล้ว</p>}
      <form className="slide-editor" action={saveHomepageFeaturesAction}>
        <div className="slide-editor__fields">
          <label className="slide-editor__wide">
            ข่าวหรือบทความเด่น
            <select name="article_1" defaultValue={selection.article_1 ?? ""}>
              <option value="">อัตโนมัติ: รายการล่าสุดที่เผยแพร่</option>
              {articles.map((article) => <option value={article.id} key={article.id}>{article.title}</option>)}
            </select>
          </label>
          <label className="slide-editor__wide">
            โครงการเด่นลำดับ 1
            <select name="project_1" defaultValue={selection.project_1 ?? ""}>
              <option value="">อัตโนมัติ: รายการล่าสุดที่เผยแพร่</option>
              {projects.map((project) => <option value={project.id} key={project.id}>{project.title}</option>)}
            </select>
          </label>
          <label className="slide-editor__wide">
            โครงการเด่นลำดับ 2
            <select name="project_2" defaultValue={selection.project_2 ?? ""}>
              <option value="">อัตโนมัติ: รายการถัดไปที่เผยแพร่</option>
              {projects.map((project) => <option value={project.id} key={project.id}>{project.title}</option>)}
            </select>
          </label>
        </div>
        <p className="slide-editor__hint">หากรายการที่เลือกถูกปิดเผยแพร่ หน้าแรกจะใช้รายการเผยแพร่อื่นแทนโดยอัตโนมัติ</p>
        <button className="button button--accent" type="submit">บันทึกการเลือก</button>
      </form>
    </>
  );
}

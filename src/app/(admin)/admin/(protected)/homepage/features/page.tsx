import { HomepageFeatureEditor } from "@/components/admin/homepage-feature-editor";
import { getAdminFeatureEditorData } from "@/features/homepage/feature-store";

export default async function HomepageFeaturesPage({ searchParams }: PageProps<"/admin/homepage/features">) {
  const { selection, articles, projects } = await getAdminFeatureEditorData();
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error.slice(0, 180) : null;
  return (
    <>
      <div className="admin-page-header">
        <p className="eyebrow">HOMEPAGE</p><h1>เนื้อหาเด่นหน้าแรก</h1>
        <p>จัด 10 ช่องโครงการจากรายการที่เผยแพร่แล้ว เห็นตัวอย่างก่อนบันทึก</p>
      </div>
      {error && <p className="admin-form-error" role="alert">{error}</p>}
      {params.saved === "1" && <p className="admin-success" role="status">บันทึกหน้าแรกแล้ว</p>}
      <HomepageFeatureEditor selection={selection} articles={articles} projects={projects} />
    </>
  );
}

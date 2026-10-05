import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { ProjectCard } from "@/components/site/project-card";
import { departments } from "@/content/static/site";
import { listDisplayProjects } from "@/features/projects/project-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "โครงการและภารกิจ | CHNS",
  description: "โครงการและภารกิจที่เผยแพร่โดย CHNS",
};

export default async function ProjectsPage({ searchParams }: PageProps<"/projects">) {
  const params = await searchParams;
  const query = (typeof params.q === "string" ? params.q : "").trim().slice(0, 80);
  const department = typeof params.department === "string" ? params.department : "";
  const category = typeof params.category === "string" ? params.category : "";
  const projects = await listDisplayProjects();
  const categories = [...new Set(projects.map((project) => project.category))].sort((a, b) => a.localeCompare(b, "th"));
  const visibleProjects = projects.filter((project) =>
    (!department || project.departmentSlug === department)
    && (!category || project.category === category)
    && (!query || `${project.title} ${project.summary} ${project.location} ${project.category}`.toLocaleLowerCase("th").includes(query.toLocaleLowerCase("th"))),
  );
  return (
    <>
      <PageHero
        eyebrow="PROJECTS & MISSIONS"
        title="โครงการและภารกิจ"
        description="พื้นที่ติดตามเป้าหมาย ความคืบหน้า และผลลัพธ์ของงานด้านมนุษยธรรม"
        imageSrc="/editorial/work-areas.webp"
        imageCaption="ภาพประกอบแนวคิดการทำงานร่วมกัน"
      />
      <section className="section page-section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">EXPLORE THE WORK</p>
              <h2 className="section-title">ภารกิจที่ติดตามได้</h2>
            </div>
            <p>อ่านรายละเอียด พื้นที่ และฝ่ายรับผิดชอบของโครงการที่เผยแพร่แล้ว</p>
          </div>
          {projects.some((project) => project.isDemo) && <p className="article-demo-banner">โครงการด้านล่างเป็นตัวอย่างเพื่อดูรูปแบบเว็บไซต์ ไม่ใช่ภารกิจจริงของ CHNS และยังไม่เปิดรับการสนับสนุน</p>}
          <form className="content-filter" action="/projects" method="get" role="search">
            <div><label htmlFor="project-query">ค้นหาโครงการ</label><input id="project-query" name="q" type="search" defaultValue={query} placeholder="ชื่อโครงการหรือพื้นที่" maxLength={80} /></div>
            <div><label htmlFor="project-department">ฝ่ายงาน</label><select id="project-department" name="department" defaultValue={department}><option value="">ทุกฝ่าย</option>{departments.map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}</select></div>
            <div><label htmlFor="project-category">ประเภท</label><select id="project-category" name="category" defaultValue={category}><option value="">ทุกประเภท</option>{categories.map((item) => <option value={item} key={item}>{item}</option>)}</select></div>
            <button className="button button--dark" type="submit">แสดงผล</button>
          </form>
          {projects.length > 0 ? <>
            <p className="filter-result-count">พบ {visibleProjects.length} โครงการ</p>
            {visibleProjects.length > 0 ? <div className="feature-card-grid">
              {visibleProjects.map((project) => <ProjectCard project={project} key={project.slug} />)}
            </div> : <p className="content-empty">ไม่พบโครงการตามเงื่อนไขที่เลือก</p>}
          </> : <div className="editorial-empty"><p>ยังไม่มีโครงการที่เผยแพร่</p><Link href="/departments">สำรวจงานของฝ่ายต่าง ๆ <span aria-hidden="true">↗</span></Link></div>}
        </div>
      </section>
    </>
  );
}

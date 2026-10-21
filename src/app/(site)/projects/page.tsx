import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { ListPagination } from "@/components/site/list-pagination";
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
  const pageCount = Math.ceil(visibleProjects.length / 9);
  const requestedPage = typeof params.page === "string" && /^[1-9]\d*$/.test(params.page) ? Number(params.page) : 1;
  const page = Math.min(pageCount || 1, Number.isSafeInteger(requestedPage) ? requestedPage : 1);
  const pageProjects = visibleProjects.slice((page - 1) * 9, page * 9);
  return (
    <>
      <PageHero
        eyebrow="PROJECTS & MISSIONS"
        title="โครงการและภารกิจ"
        description="พื้นที่ติดตามเป้าหมาย ความคืบหน้า และผลลัพธ์ของงานด้านมนุษยธรรม"
        imageSrc="/editorial/chns/page-projects.webp"
        imagePosition="center top"
      />
      <section className="section page-section page-section--listing" id="results">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">EXPLORE THE WORK</p>
              <h2 className="section-title">ภารกิจที่ติดตามได้</h2>
            </div>
            <p>อ่านรายละเอียด พื้นที่ และฝ่ายรับผิดชอบของโครงการที่เผยแพร่แล้ว</p>
          </div>
          <form className="content-filter listing-filter listing-filter--projects" action="/projects" method="get" role="search">
            <div className="listing-filter__search">
              <label className="sr-only" htmlFor="project-query">ค้นหาโครงการ</label>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.3" stroke="currentColor" strokeWidth="1.8" /><path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              <input id="project-query" name="q" type="search" defaultValue={query} placeholder="ค้นหาชื่อโครงการหรือพื้นที่" maxLength={80} />
            </div>
            <div className="listing-filter__select"><label className="sr-only" htmlFor="project-department">ฝ่ายงาน</label><select id="project-department" name="department" defaultValue={department}><option value="">ทุกฝ่าย</option>{departments.map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}</select></div>
            <div className="listing-filter__select"><label className="sr-only" htmlFor="project-category">ประเภท</label><select id="project-category" name="category" defaultValue={category}><option value="">ทุกประเภท</option>{categories.map((item) => <option value={item} key={item}>{item}</option>)}</select></div>
            <div className="listing-filter__actions"><button className="listing-filter__submit" type="submit">กรองผล</button>{(query || department || category) && <Link className="listing-filter__reset" href="/projects#results">ล้างตัวกรอง</Link>}</div>
          </form>
          {projects.length > 0 ? <>
            <p className="filter-result-count">พบ {visibleProjects.length} โครงการ{pageCount > 1 ? ` · หน้า ${page} จาก ${pageCount}` : ""}</p>
            {visibleProjects.length > 0 ? <div className="feature-card-grid">
              {pageProjects.map((project) => <ProjectCard project={project} key={project.slug} />)}
            </div> : <p className="content-empty">ไม่พบโครงการตามเงื่อนไขที่เลือก</p>}
            <ListPagination pathname="/projects" page={page} pageCount={pageCount} filters={{ ...(query && { q: query }), ...(department && { department }), ...(category && { category }) }} />
          </> : <div className="editorial-empty"><p>ยังไม่มีโครงการที่เผยแพร่</p><Link href="/about#structure">สำรวจฝ่ายงานต่าง ๆ <span aria-hidden="true">↗</span></Link></div>}
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/site/page-hero";
import { regionalCenters } from "@/content/static/organization";

export const metadata: Metadata = {
  title: "ศูนย์ประสานงาน | CHNS",
  description: "โครงหน้าศูนย์ประสานงานระดับภูมิภาคและจังหวัด",
};

export default async function CentersPage({ searchParams }: PageProps<"/centers">) {
  const params = await searchParams;
  const query = (typeof params.q === "string" ? params.q : "").trim().slice(0, 80);
  const centers = query ? regionalCenters.filter((center) => `${center.name} ${center.location}`.toLocaleLowerCase("th").includes(query.toLocaleLowerCase("th"))) : regionalCenters;
  return (
    <>
      <PageHero
        eyebrow="OUR NETWORK"
        title="ศูนย์ประสานงาน"
        description="รายชื่อศูนย์ประสานงานระดับภูมิภาคและข้อมูลพื้นที่ตั้งตามเอกสารของ CHNS"
      />
      <section className="section page-section">
        <div className="shell">
          <div className="network-grid">
            <div>
              <p className="eyebrow">COORDINATION NETWORK</p>
              <h2 className="section-title">
                เชื่อมพื้นที่
                <br />
                <span>เชื่อมผู้คน</span>
              </h2>
              <p className="large-copy">
                ศูนย์ประสานงานเชื่อมองค์กรและผู้ร่วมงานในแต่ละพื้นที่ เพื่อให้การประสานภารกิจด้านมนุษยธรรมเข้าถึงพื้นที่ต่าง ๆ
              </p>
              <Link className="text-link" href="/#network">
                ดูองค์กรสมาชิก <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <Image className="editorial-photo" src="/editorial/coordination.webp" width={960} height={640} alt="" />
          </div>
          <div className="center-levels">
            <section id="regional">
              <p className="eyebrow">REGIONAL</p>
              <h2>ศูนย์ประสานงานระดับภูมิภาค</h2>
              <p>ค้นหาจากชื่อภูมิภาคหรือจังหวัดที่ตั้งศูนย์</p>
            </section>
            <section id="provincial">
              <p className="eyebrow">PROVINCIAL</p>
              <h2>ศูนย์ประสานงานระดับจังหวัด</h2>
              <p>เอกสารที่ได้รับยังไม่มีรายชื่อศูนย์ระดับจังหวัด จึงจะแสดงเมื่อมีข้อมูลเพิ่ม</p>
            </section>
          </div>
          <form className="member-filter center-filter" action="/centers" method="get" role="search">
            <label htmlFor="center-query">ค้นหาศูนย์ประสานงาน</label>
            <div><input id="center-query" name="q" type="search" defaultValue={query} placeholder="เช่น ภาคใต้ หรือ เชียงใหม่" maxLength={80} /><button className="button button--dark" type="submit">ค้นหา</button></div>
          </form>
          <p className="filter-result-count">พบ {centers.length} ศูนย์ภูมิภาค</p>
          {centers.length > 0 ? <ol className="regional-center-grid">{centers.map((center) => <li key={center.name}>
            <span>ศูนย์ประสานงานประจำ{center.name}</span><strong>{center.location}</strong>{"note" in center && <small>{center.note}</small>}
          </li>)}</ol> : <p className="content-empty">ไม่พบศูนย์ที่ค้นหา</p>}
        </div>
      </section>
    </>
  );
}

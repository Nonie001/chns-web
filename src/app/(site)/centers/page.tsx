import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/site/page-hero";
import { PartnerLogoGrid } from "@/components/site/partner-logo-grid";
import { RegionalCenterMap } from "@/components/site/regional-center-map";
import { regionalCenters } from "@/content/static/organization";
import { listPublishedPartners } from "@/features/partners/partner-store";

export const metadata: Metadata = {
  title: "ศูนย์ประสานงาน | CHNS",
  description: "ศูนย์ประสานงานระดับภูมิภาค จังหวัด และองค์กรสมาชิกของ CHNS",
};

export default async function CentersPage() {
  const partners = await listPublishedPartners();
  return (
    <>
      <PageHero
        eyebrow="OUR NETWORK"
        title="ศูนย์ประสานงาน"
        description="ศูนย์ประสานงานและองค์กรสมาชิกที่ร่วมขับเคลื่อนงานด้านมนุษยธรรม"
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
              <Link className="text-link" href="#members">
                ดูองค์กรสมาชิก <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <Image className="editorial-photo" src="/editorial/coordination.webp" width={960} height={640} alt="" />
          </div>
          <div className="center-levels">
            <section id="regional">
              <p className="eyebrow">REGIONAL</p>
              <h2>ศูนย์ประสานงานระดับภูมิภาค</h2>
              <p>ดูรายชื่อศูนย์และตำแหน่งที่ตั้งบนแผนที่</p>
            </section>
            <section id="provincial">
              <p className="eyebrow">PROVINCIAL</p>
              <h2>ศูนย์ประสานงานระดับจังหวัด</h2>
              <p>เอกสารที่ได้รับยังไม่มีรายชื่อศูนย์ระดับจังหวัด จึงจะแสดงเมื่อมีข้อมูลเพิ่ม</p>
            </section>
          </div>
          <RegionalCenterMap centers={regionalCenters} />
        </div>
      </section>
      <section className="section center-members" id="members" aria-labelledby="center-members-title">
        <div className="shell">
          <div className="home-heading">
            <div><p className="eyebrow">PARTNER NETWORK</p><h2 id="center-members-title" className="section-title">องค์กรสมาชิกและภาคีเครือข่าย</h2></div>
            {partners.length > 0 && <p className="home-network__count">{partners.length} องค์กรที่เผยแพร่แล้ว</p>}
          </div>
          {partners.length > 0 ? <PartnerLogoGrid partners={partners} /> : <p className="content-empty">ยังไม่มีโลโก้ภาคีที่เผยแพร่</p>}
        </div>
      </section>
    </>
  );
}

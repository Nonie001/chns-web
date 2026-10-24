import Link from "next/link";
import { organizationStructure } from "@/content/static/organization";
import { departments } from "@/content/static/site";
import styles from "./organization-chart.module.css";

const chart = organizationStructure;

export function OrganizationChart() {
  return (
    <div className={styles.chart} role="group" aria-label={`โครงสร้างบริหารงานสภาเครือข่าย พ.ศ. ${chart.term}`}>
      <div className={styles.meta}>
        <strong>ผังองค์กร พ.ศ. {chart.term}</strong>
        <span>ปรับปรุง {chart.revision}</span>
      </div>

      <div className={styles.flow}>
        <div className={styles.memberGroup} role="group" aria-label="ประเภทสมาชิก">
          {chart.memberTypes.map((type) => <div className={styles.member} key={type}>{type}</div>)}
        </div>

        <div className={styles.councilRow}>
          <div className={styles.sideCard}>{chart.councilSupport[0]}</div>
          <div className={`${styles.mainCard} ${styles.council}`}>{chart.council}</div>
          <div className={styles.sideCard}>{chart.councilSupport[1]}</div>
        </div>

        <div className={`${styles.mainCard} ${styles.executive}`}>{chart.executive}</div>
        <div className={`${styles.mainCard} ${styles.chair}`}>{chart.chair}</div>

        <div className={styles.supportRow} role="group" aria-label="ตำแหน่งและฝ่ายที่เชื่อมกับประธาน">
          {chart.chairSupport.map((role) => <div className={styles.sideCard} key={role}>{role}</div>)}
        </div>

        <div className={styles.leadership} role="group" aria-label="รองประธานสภาและเลขาธิการ">
          {chart.leadership.map((role, index) => (
            <div className={index === 2 ? styles.secretary : styles.roleCard} key={`${role}-${index}`}>{role}</div>
          ))}
        </div>

        <div className={styles.departments} role="group" aria-label="ฝ่ายงานทั้ง 8 ส่วน">
          <div className={styles.departmentHeading}><span>ฝ่ายงานปฏิบัติ</span><strong>8 ฝ่ายงาน</strong></div>
          <div className={styles.departmentGrid}>
            {departments.map((department) => (
              <Link href={`/departments/${department.slug}`} key={department.slug}>
                <span>{department.name}</span><span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.centers} role="group" aria-label="ศูนย์ประสานงานและองค์กรสมาชิก">
          <div className={styles.centerCard}>{chart.regional}</div>
          <div className={styles.centerCard}>{chart.provincial}</div>
          <div className={styles.organizations}>
            {Array.from({ length: 3 }, (_, index) => <div key={index}>{chart.memberOrganization}</div>)}
          </div>
        </div>
      </div>

      <p className={styles.source}>อ้างอิงผังโครงสร้างบริหารงานสภาเครือข่าย · Revision no.23-04-2569</p>
    </div>
  );
}

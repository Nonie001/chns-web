import { changeContactStatusAction } from "@/features/contact/actions";
import { listAdminContactInquiries } from "@/features/contact/contact-store";
import { contactDepartments } from "@/content/static/site";
import type { ContactDepartmentSlug } from "@/features/contact/contact-store";

const statusLabels = { new: "รอรับเรื่อง", in_progress: "กำลังดำเนินการ", closed: "ปิดเรื่อง" } as const;

export default async function AdminInquiriesPage({ searchParams }: PageProps<"/admin/inquiries">) {
  const params = await searchParams;
  const department = contactDepartments.find((item) => item.slug === params.department)?.slug as ContactDepartmentSlug | undefined;
  const inquiries = await listAdminContactInquiries(department);

  return (
    <>
      <div className="admin-page-header">
        <p className="eyebrow">CONTACT INBOX</p>
        <h1>ข้อความติดต่อ</h1>
        <p>ข้อความจากหน้าเว็บไซต์ แยกตามฝ่ายที่ผู้ส่งเลือก เฉพาะผู้ดูแลระบบที่ได้รับสิทธิ์เท่านั้น</p>
      </div>
      <form className="inquiry-filter" method="get">
        <label htmlFor="inquiry-department">ฝ่ายที่รับเรื่อง</label>
        <select id="inquiry-department" name="department" defaultValue={department ?? ""}>
          <option value="">ทุกฝ่าย</option>
          {contactDepartments.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
        </select>
        <button className="button button--dark" type="submit">แสดงรายการ</button>
      </form>
      {inquiries.length === 0 ? <div className="admin-empty"><h2>ยังไม่มีข้อความในรายการนี้</h2></div> :
        <div className="inquiry-list">{inquiries.map((inquiry) => (
          <article className="inquiry-card" key={inquiry.id}>
            <div className="inquiry-card__header">
              <div>
                <span className="inquiry-card__department">{contactDepartments.find((item) => item.slug === inquiry.departmentSlug)?.name ?? inquiry.departmentSlug}</span>
                <h2>{inquiry.subject}</h2>
                <p>{new Date(inquiry.createdAt).toLocaleString("th-TH", { timeZone: "Asia/Bangkok", dateStyle: "medium", timeStyle: "short" })}</p>
              </div>
              <span className={`inquiry-card__status inquiry-card__status--${inquiry.status}`}>{statusLabels[inquiry.status]}</span>
            </div>
            <p className="inquiry-card__message">{inquiry.message}</p>
            <dl className="inquiry-card__contact">
              <div><dt>ชื่อ–สกุล</dt><dd>{inquiry.fullName}</dd></div>
              {inquiry.phone && <div><dt>โทรศัพท์</dt><dd><a href={`tel:${inquiry.phone}`}>{inquiry.phone}</a></dd></div>}
              {inquiry.email && <div><dt>อีเมล</dt><dd><a href={`mailto:${inquiry.email}`}>{inquiry.email}</a></dd></div>}
              {inquiry.lineId && <div><dt>LINE ID</dt><dd>{inquiry.lineId}</dd></div>}
            </dl>
            <div className="inquiry-card__actions">
              {inquiry.status !== "in_progress" && <form action={changeContactStatusAction}><input type="hidden" name="id" value={inquiry.id} /><input type="hidden" name="status" value="in_progress" /><button type="submit">กำลังดำเนินการ</button></form>}
              {inquiry.status !== "closed" && <form action={changeContactStatusAction}><input type="hidden" name="id" value={inquiry.id} /><input type="hidden" name="status" value="closed" /><button type="submit">ปิดเรื่อง</button></form>}
              {inquiry.status !== "new" && <form action={changeContactStatusAction}><input type="hidden" name="id" value={inquiry.id} /><input type="hidden" name="status" value="new" /><button type="submit">กลับไปรอรับเรื่อง</button></form>}
            </div>
          </article>
        ))}</div>}
    </>
  );
}

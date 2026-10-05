import Link from "next/link";
import { PartnerEditor } from "@/components/admin/partner-editor";

export default function NewPartnerPage() {
  return <><div className="admin-page-header"><Link className="text-link" href="/admin/partners">← กลับไปรายการ</Link><p className="eyebrow">NEW PARTNER</p><h1>เพิ่มภาคี</h1><p>ระบุชื่อจริงและที่มาของไฟล์โลโก้ ก่อนเผยแพร่</p></div><PartnerEditor /></>;
}

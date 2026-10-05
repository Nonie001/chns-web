import { StatusView } from "@/components/ui/status-view";

export default function Forbidden() {
  return <StatusView code="403" eyebrow="ACCESS DENIED" title="คุณไม่มีสิทธิ์เข้าถึงหน้านี้" description="บัญชีนี้ยังไม่ได้รับสิทธิ์จัดการเนื้อหา หากควรเข้าถึงได้ โปรดติดต่อผู้ดูแลระบบ" primaryHref="/admin/login" primaryLabel="กลับหน้าเข้าสู่ระบบ" secondaryHref="/" secondaryLabel="ดูเว็บไซต์" />;
}

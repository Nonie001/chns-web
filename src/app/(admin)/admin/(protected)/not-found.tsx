import { StatusView } from "@/components/ui/status-view";

export default function AdminNotFound() {
  return <StatusView code="404" eyebrow="CONTENT ADMIN" title="ไม่พบรายการนี้" description="รายการอาจถูกลบ เปลี่ยนที่อยู่ หรือคุณอาจใช้ลิงก์เก่า" primaryHref="/admin" primaryLabel="กลับภาพรวมหลังบ้าน" />;
}

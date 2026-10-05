import { StatusView } from "@/components/ui/status-view";

export default function NotFound() {
  return <StatusView code="404" eyebrow="PAGE NOT FOUND" title="ไม่พบหน้าที่คุณต้องการ" description="ลิงก์นี้อาจเปลี่ยนไป หรือหน้านี้ยังไม่เปิดเผยแพร่ ลองกลับไปดูหน้าแรกหรือรายการข่าวสาร" primaryHref="/" primaryLabel="กลับหน้าแรก" secondaryHref="/news" secondaryLabel="ดูข่าวสาร" />;
}

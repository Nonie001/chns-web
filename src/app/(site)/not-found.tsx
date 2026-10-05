import { StatusView } from "@/components/ui/status-view";

export default function SiteNotFound() {
  return <StatusView code="404" eyebrow="PAGE NOT FOUND" title="ไม่พบเนื้อหานี้" description="เนื้อหาอาจถูกย้าย ปิดเผยแพร่ หรือยังไม่พร้อมให้เข้าชม" primaryHref="/" primaryLabel="กลับหน้าแรก" secondaryHref="/news" secondaryLabel="ดูข่าวสาร" />;
}

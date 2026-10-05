"use client";

import { StatusView } from "@/components/ui/status-view";

export default function AdminError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <StatusView code="500" eyebrow="CONTENT ADMIN" title="โหลดข้อมูลหลังบ้านไม่สำเร็จ" description="ข้อมูลที่บันทึกไว้ไม่ถูกเปลี่ยนจากหน้าข้อผิดพลาดนี้ กรุณาลองโหลดใหม่" primaryHref="/admin" primaryLabel="กลับภาพรวม" action={<button className="button button--accent" type="button" onClick={() => retry()}>ลองอีกครั้ง</button>} />;
}

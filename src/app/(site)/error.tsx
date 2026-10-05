"use client";

import { StatusView } from "@/components/ui/status-view";

export default function SiteError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <StatusView code="500" eyebrow="TEMPORARY ERROR" title="ขณะนี้แสดงหน้านี้ไม่ได้" description="เกิดข้อขัดข้องชั่วคราว กรุณาลองอีกครั้ง หรือกลับหน้าแรก" primaryHref="/" primaryLabel="กลับหน้าแรก" action={<button className="button button--accent" type="button" onClick={() => retry()}>ลองอีกครั้ง</button>} />;
}

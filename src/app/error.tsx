"use client";

import { StatusView } from "@/components/ui/status-view";

export default function RootError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <StatusView code="500" eyebrow="TEMPORARY ERROR" title="ระบบขัดข้องชั่วคราว" description="กรุณาลองอีกครั้งในอีกสักครู่" primaryHref="/" primaryLabel="กลับหน้าแรก" action={<button className="button button--accent" type="button" onClick={() => retry()}>ลองอีกครั้ง</button>} />;
}

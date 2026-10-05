"use client";

import "./globals.css";
import { StatusView } from "@/components/ui/status-view";

export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="th">
      <body>
        <StatusView code="500" eyebrow="TEMPORARY ERROR" title="ระบบขัดข้องชั่วคราว" description="กรุณาลองอีกครั้งในอีกสักครู่" primaryHref="/" primaryLabel="กลับหน้าแรก" action={<button className="button button--accent" type="button" onClick={() => retry()}>ลองอีกครั้ง</button>} />
      </body>
    </html>
  );
}

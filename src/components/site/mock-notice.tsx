import type { ReactNode } from "react";

export function MockNotice({ children }: { children?: ReactNode }) {
  return (
    <div className="mock-notice" role="note">
      <strong>ตัวอย่างโครงหน้า</strong>
      <span>
        {children ??
          "เนื้อหาและภาพในหน้านี้ใช้เพื่อดูรูปแบบเท่านั้น จะเปลี่ยนเป็นข้อมูลที่ CHNS อนุมัติก่อนเผยแพร่"}
      </span>
    </div>
  );
}

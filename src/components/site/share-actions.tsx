"use client";

import { useState } from "react";

export function ShareActions({ title }: { title: string }) {
  const [message, setMessage] = useState("");

  function openShare(destination: "facebook" | "line") {
    const pageUrl = encodeURIComponent(window.location.href);
    const url = destination === "facebook"
      ? `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`
      : `https://social-plugins.line.me/lineit/share?url=${pageUrl}`;
    window.open(url, "_blank", "noopener,noreferrer,width=680,height=600");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setMessage("คัดลอกลิงก์แล้ว");
    } catch {
      setMessage("คัดลอกไม่ได้ กรุณาคัดลอก URL จากแถบที่อยู่");
    }
  }

  return (
    <div className="share-actions" aria-label={`แชร์ ${title}`}>
      <strong>แชร์หน้านี้</strong>
      <div>
        <button type="button" onClick={() => openShare("facebook")}>Facebook</button>
        <button type="button" onClick={() => openShare("line")}>LINE</button>
        <button type="button" onClick={copyLink}>คัดลอกลิงก์</button>
      </div>
      <span role="status" aria-live="polite">{message}</span>
    </div>
  );
}

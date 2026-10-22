"use client";

import Image from "next/image";
import { useState } from "react";
import { donationDetails } from "@/content/static/donation";

export function DonationAccounts() {
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function copyAccount(number: string, purpose: string) {
    try {
      await navigator.clipboard.writeText(number.replaceAll("-", ""));
      setCopiedNumber(number);
      setMessage(`คัดลอกเลขบัญชีสำหรับ${purpose}แล้ว`);
    } catch {
      setCopiedNumber(null);
      setMessage(`คัดลอกไม่สำเร็จ กรุณาเลือกเลขบัญชี ${number} เพื่อคัดลอก`);
    }
  }

  return (
    <div className="donation-accounts">
      <div className="donation-accounts__bank">
        <div className="donation-accounts__bank-name">
          <Image src="/brand/ibank-logo.webp" alt="โลโก้ธนาคารอิสลามแห่งประเทศไทย" width={240} height={60} />
        </div>
        <div className="donation-accounts__owner">
          <span>ชื่อบัญชีสำหรับทุกวัตถุประสงค์</span>
          <strong>{donationDetails.accountName}</strong>
        </div>
      </div>

      <div className="donation-accounts__grid">
        {donationDetails.accounts.map(({ purpose, number }, index) => (
          <article className="donation-card" key={number}>
            <div className="donation-card__heading">
              <span className="donation-card__index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3>เพื่อ{purpose}</h3>
            </div>
            <div className="donation-card__bottom">
              <div className="donation-card__account">
                <span>เลขบัญชี</span>
                <strong className="donation-card__number" aria-label={`เลขบัญชี ${number}`}>{number}</strong>
              </div>
              <button
                className="donation-card__copy"
                type="button"
                onClick={() => copyAccount(number, purpose)}
                aria-label={`คัดลอกเลขบัญชี ${number} สำหรับ${purpose}`}
              >
                {copiedNumber === number ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></svg>
                )}
                <span>{copiedNumber === number ? "คัดลอกแล้ว" : "คัดลอก"}</span>
              </button>
            </div>
          </article>
        ))}
      </div>
      <p className="donation-accounts__note">เลขบัญชีที่คัดลอกจะไม่มีขีดคั่น โปรดตรวจสอบชื่อบัญชีในแอปธนาคารก่อนยืนยันการโอน</p>
      <p className="sr-only" role="status" aria-live="polite">{message}</p>
    </div>
  );
}

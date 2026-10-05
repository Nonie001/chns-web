import type { Metadata } from "next";
import { DM_Sans, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const thaiSans = Noto_Sans_Thai({
  variable: "--font-thai",
  subsets: ["thai", "latin"],
  display: "swap",
});

const latinSans = DM_Sans({
  variable: "--font-latin",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CHNS | สภาเครือข่ายช่วยเหลือด้านมนุษยธรรม",
  description: "เว็บไซต์สภาเครือข่ายช่วยเหลือด้านมนุษยธรรม สำนักจุฬาราชมนตรี",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${thaiSans.variable} ${latinSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}

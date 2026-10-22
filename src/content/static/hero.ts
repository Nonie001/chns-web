import type { HeroCarouselItem } from "@/features/hero/types";

// เจ้าของเว็บเลือกภาพนี้เป็นภาพแรกของ Hero เมื่อ 23 ต.ค. 2569
// แหล่งภาพ: ชุดสื่อ CHNS ที่มีอยู่ใน public/editorial/chns/gallery-winter.webp
// การเปลี่ยนภาพหลักนี้ทำผ่าน code review/deploy
export const leadHeroSlide: HeroCarouselItem = {
  id: "chns-winter-relief",
  imageSrc: "/editorial/chns/gallery-winter.webp",
  mobileImageSrc: null,
  imageAlt: "ผู้ร่วมงานและเด็กในพื้นที่กิจกรรมแบ่งปันเครื่องนุ่งห่ม",
};

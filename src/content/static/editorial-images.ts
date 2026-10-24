// ภาพจากชุดสื่อ CHNS ที่เจ้าของเว็บส่งให้ใช้บนเว็บไซต์
// เปลี่ยนไฟล์ผ่าน Supabase Storage และปรับชื่อที่อ้างในโค้ดเมื่อเปลี่ยนภาพ
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

export function editorialImage(name: string): string {
  if (!supabaseUrl) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  if (!/^[a-z0-9-]+\.webp$/.test(name)) throw new Error("Invalid editorial image name");
  return `${supabaseUrl}/storage/v1/object/public/chns-editorial/${name}`;
}

# โมเดลเนื้อหา CHNS

สถานะ: Hero, Article, Project, Report, Partner และ HomepageFeature มีตาราง Supabase PostgreSQL/RLS ใช้งานแล้ว; entity อื่นยังเป็นสัญญาระดับแนวคิด

## กติกากลาง

- ทุกเนื้อหาที่เผยแพร่มี `id`, `slug` เมื่อมีหน้ารายละเอียด, `status`, `createdAt`, `updatedAt`, `publishedAt` และผู้แก้ไข; ผู้อนุมัติแยกยังเป็นงานถัดไป
- รายการตัวอย่างมี `is_mockup=true` และต้องคงสถานะ `draft`; กฎฐานข้อมูลห้ามเปลี่ยนเป็น `published` แม้ผู้ดูแลกดผิด ข่าว/บทความและโครงการตัวอย่างที่เจ้าของเว็บขอให้เห็นบนหน้าเว็บใช้ `showcase_visible=true` แยกจากสถานะเผยแพร่จริงและติดป้ายตัวอย่าง
- สถานะปัจจุบันเริ่ม `draft` และ `admin` เผยแพร่ได้โดยตรง ส่วนเป้าหมายก่อนปิดเฟสคือ `in_review → approved → published` กับ revision ใหม่สำหรับการแก้ไขเนื้อหาที่เผยแพร่
- ข้อความสองภาษาเก็บแยกตาม locale และแสดงเฉพาะ locale ที่ผ่านการอนุมัติ; ไม่เติมภาษาอังกฤษอัตโนมัติจากภาษาไทย
- สื่อมีเจ้าของ/แหล่งที่มา, alt text, สิทธิ์เผยแพร่, caption เมื่อจำเป็น และวันหมดสิทธิ์ถ้ามี
- ตัวเลขสาธารณะต้องมีหน่วย วันที่อัปเดต และแหล่งอ้างอิง; หน้าโครงการแยกยอดเงินออกจากจำนวนผู้ได้รับประโยชน์

## ประเภทข้อมูล

| Entity | ฟิลด์สำคัญ | ความสัมพันธ์ |
| --- | --- | --- |
| `Department` | ชื่อทางการ, slug, คำอธิบาย, บทบาท, ภาพ, ช่องทางติดต่อ | โครงการและข่าวหลายรายการ; ข้อมูลแกนหลักอาจอยู่ใน `src/content/static/` |
| `Project` (ใช้งานขั้นแรก) | slug, title, category, location, departmentSlug, summary, body, imageKey, imageAlt, imageCredit, imageRightsConfirmed, status, isMockup, showcaseVisible, publishedAt | หน้าเว็บอ่าน published และข้อยกเว้นเฉพาะตัวอย่างที่ `showcase_visible=true`; การแก้ไขบันทึก `project_audit`; เวลา เป้าหมาย ผลลัพธ์ หลักฐาน และความสัมพันธ์กับข่าว/รายงานยังเป็นงานถัดไป |
| `Article` (ใช้งานขั้นแรก) | kind, title, slug, summary, body, imageKey, imageAlt, imageCredit, imageRightsConfirmed, status, isMockup, showcaseVisible, publishedAt | หน้าเว็บอ่าน published และข้อยกเว้นเฉพาะตัวอย่างที่ `showcase_visible=true`; การแก้ไขบันทึก `article_audit`; วันกิจกรรม ฝ่าย พื้นที่ แหล่งข่าวและ tags ยังต้องเพิ่มเมื่อยืนยัน workflow |
| `Report` (ใช้งานขั้นแรก) | slug, title, kind, year, summary, source, fileKey, fileRightsConfirmed, status, publishedAt | public อ่านเฉพาะ published ที่มี PDF; `report_audit` เก็บการแก้ไข; ความสัมพันธ์กับโครงการหรือฝ่ายยังเป็นงานถัดไป |
| `Center` | ระดับภูมิภาค/จังหวัด, ชื่อ, พื้นที่รับผิดชอบ, ช่องทางสาธารณะ | เชื่อมจังหวัดและฝ่ายที่เกี่ยวข้อง |
| `Partner` | ชื่อ, โลโก้, URL, alt, เครดิต, สิทธิ์เผยแพร่, สถานะ, ลำดับ | โมดูลโลโก้ภาคีใช้งานแล้ว; การเชื่อมโครงการ/ศูนย์ยังเป็นแผน |
| `MediaAsset` | storage key, MIME, size, alt, caption, permission, visibility | อ้างอิงจากคอนเทนต์หลายประเภท |
| `HomepageFeature` (ใช้งานขั้นแรก) | slot (`article_1`, `project_1`, `project_2`), contentId, updatedBy, updatedAt | เลือกข่าว/โครงการที่เผยแพร่แล้ว; ตารางเวลาและแบนเนอร์เร่งด่วนยังเป็นงานถัดไป |
| `SiteSetting` | emergency banner, ช่องทางที่ต้องแก้โดยทีมงาน | แยกค่าที่แก้ผ่าน admin จากข้อมูล static ในโค้ด |
| `HeroSlide` (ใช้งานแล้ว) | title สำหรับหลังบ้าน, imageKey, mobileImageKey (ไม่บังคับ), imageAlt, status, position, publishedAt | หน้าแรกแสดงเฉพาะภาพของ published; ข้อความที่เห็นอยู่ในไฟล์ภาพ ทุกการแก้ไขบันทึก `hero_slide_audit` |

Taxonomy กลาง: ฝ่าย, ประเภทภารกิจ, ประเภทข่าว, ประเทศ/จังหวัด, ปี และ tag. ไม่ใช้ข้อความอิสระสำหรับความสัมพันธ์หลัก เช่น ชื่อฝ่ายในข่าว เพราะเปลี่ยนชื่อแล้วข้อมูลจะไม่เชื่อมกัน

## ข้อมูลที่ต้องตรวจจากเอกสารต้นทาง

- ปีในประวัติภาษาไทย/อังกฤษไม่ตรงกัน; ห้ามถือข้อความอังกฤษเป็นคำแปลที่อนุมัติแล้ว
- ชื่อฝ่ายและโครงสร้างใช้เอกสาร Revision no.23-04-2569 เป็นแหล่งยืนยัน
- หน้าโครงการตัวอย่างมี field ว่างและข้อความหัวข้อศูนย์ประสานงานปะปนในช่องงบประมาณ
- ฝ่ายกิจการพิเศษและศูนย์ระดับจังหวัดยังไม่มีข้อมูลครบ
- ข้อมูลติดต่อและสิทธิ์ภาพต้องยืนยันก่อนใส่ทั้งใน static code และ CMS

รายละเอียดและบริบทจาก DOCX อยู่ใน [website-analysis.md](website-analysis.md)

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const examples = [
  {
    slug: "food-support", title: "ตัวอย่างโครงการ: ส่งต่ออาหารและสิ่งของจำเป็น",
    category: "ความช่วยเหลือพื้นฐาน", location: "พื้นที่ตัวอย่าง", department: "domestic",
    summary: "ดูรูปแบบโครงการที่เริ่มจากการตรวจความต้องการ จัดชุดสิ่งของ และติดตามการส่งมอบอย่างเป็นระบบ",
    image: "assets/mockups/food-packing.jpg", alt: "ภาพจำลองการเตรียมชุดอาหารและสิ่งของจำเป็น",
    paragraphs: [
      "โครงการตัวอย่างนี้ออกแบบเพื่ออธิบายว่าการสนับสนุนอาหารและสิ่งของจำเป็นควรเริ่มจากข้อมูลความต้องการที่ได้รับการตรวจสอบ ไม่ใช้เพียงรายการสิ่งของที่มีอยู่เป็นตัวตั้ง ฝ่ายในประเทศและผู้ประสานงานพื้นที่จะทบทวนกลุ่มเป้าหมายและข้อจำกัดก่อนกำหนดวิธีดำเนินงาน",
      "ขั้นเตรียมงานประกอบด้วยการจัดรายการสิ่งของ ตรวจสภาพและความเหมาะสม ระบุผู้รับผิดชอบการจัดชุด และวางช่องทางส่งมอบที่เคารพความเป็นส่วนตัวของผู้รับความช่วยเหลือ ข้อมูลส่วนบุคคลใช้เท่าที่จำเป็นต่อการประสานงาน",
      "ระหว่างดำเนินงานควรบันทึกจำนวนชุดที่เตรียม จำนวนที่ส่ง และหลักฐานการรับแยกจากกัน หากมีรายการที่ยังส่งไม่ถึงหรือพื้นที่ที่เข้าไม่ได้ ต้องระบุสถานะอย่างตรงไปตรงมาแทนการสรุปว่าเสร็จสิ้นทั้งหมด",
      "หน้ารายละเอียดโครงการจริงควรแสดงวันที่ พื้นที่ เป้าหมาย ผู้รับผิดชอบ ความคืบหน้า และผลที่ตรวจรับแล้วพร้อมแหล่งข้อมูล ตัวอย่างนี้ไม่มีการรับเงินและไม่ใช่โครงการที่กำลังดำเนินการจริง",
    ],
  },
  {
    slug: "community-network", title: "ตัวอย่างโครงการ: เครือข่ายประสานงานชุมชน",
    category: "การประสานงาน", location: "พื้นที่ตัวอย่าง", department: "relations",
    summary: "รูปแบบโครงการที่เชื่อมองค์กรสมาชิก ศูนย์ประสานงาน และฝ่ายงานให้เห็นหน้าที่ของแต่ละส่วน",
    image: "assets/mockups/coordination.jpg", alt: "ภาพจำลองการประชุมร่วมกันของเครือข่าย",
    paragraphs: [
      "โครงการจำลองนี้แสดงการสร้างช่องทางทำงานร่วมกันระหว่างองค์กรสมาชิกและผู้ประสานงานในพื้นที่ เป้าหมายของแบบหน้าโครงการคือให้ผู้อ่านเห็นว่าใครรับข้อมูล ใครตรวจสอบ และใครช่วยดำเนินการในแต่ละขั้น",
      "กิจกรรมที่อาจอยู่ในโครงการลักษณะนี้ ได้แก่ การประชุมกำหนดบทบาท การรวบรวมข้อมูลติดต่อที่ใช้สำหรับงาน การทดลองส่งต่อเรื่อง และการทบทวนปัญหาหลังปฏิบัติงาน ทุกองค์กรยังคงรับผิดชอบงานตามขอบเขตของตน",
      "การติดตามผลควรดูว่าการส่งต่อข้อมูลถึงฝ่ายรับผิดชอบหรือไม่ ใช้เวลานานเพียงใด และมีเรื่องใดที่ต้องปรับช่องทางประสาน ทั้งหมดต้องอาศัยข้อมูลจริงก่อนใส่ผลลัพธ์บนหน้าเว็บ",
      "ตัวอย่างนี้ไม่อ้างว่าองค์กรสมาชิกใดเข้าร่วมโครงการจริง ชื่อภาคี บทบาท และคำรับรองต้องผ่านการตรวจจากแต่ละองค์กรก่อนเผยแพร่เป็นภารกิจจริง",
    ],
  },
  {
    slug: "emergency-response", title: "ตัวอย่างโครงการ: เตรียมระบบตอบสนองเหตุฉุกเฉิน",
    category: "ภารกิจเร่งด่วน", location: "พื้นที่ตัวอย่าง", department: "international",
    summary: "ตัวอย่างหน้าภารกิจที่อธิบายการรับแจ้งเหตุ การประเมินความปลอดภัย และการประสานความช่วยเหลือ",
    image: "assets/mockups/community-relief.jpg", alt: "ภาพจำลองทีมงานส่งต่อความช่วยเหลือ",
    paragraphs: [
      "เมื่อต้องตอบสนองเหตุฉุกเฉิน ขั้นตอนแรกคือการยืนยันข้อมูลจากแหล่งที่เชื่อถือได้และประเมินความปลอดภัยของผู้เกี่ยวข้อง โครงการตัวอย่างนี้จัดลำดับข้อมูลเพื่อให้เห็นการตัดสินใจอย่างรอบคอบก่อนลงมือ",
      "ทีมประสานงานอาจต้องตรวจช่องทางเข้าถึงพื้นที่ ความต้องการเร่งด่วน ทรัพยากรที่มี และหน่วยงานที่ดำเนินการอยู่แล้ว การประสานกับผู้ที่ทำงานในพื้นที่ช่วยลดความซ้ำซ้อนและความเสี่ยงที่อาจเกิดกับผู้รับความช่วยเหลือ",
      "หลังเริ่มภารกิจ ควรแยกสถานะเป็นสิ่งที่ยืนยันแล้ว สิ่งที่กำลังทำ และสิ่งที่รอข้อมูลเพิ่มเติม ทุกการอัปเดตควรมีวันที่และเจ้าของข้อมูล ไม่ควรใช้ยอดคาดการณ์แทนผลที่ตรวจรับแล้ว",
      "รูปแบบนี้เป็นเพียงการสาธิตหน้าภารกิจเร่งด่วน ไม่ได้ประกาศเหตุการณ์จริง พื้นที่จริง หรือช่องทางระดมทุนใด ๆ",
    ],
  },
  {
    slug: "refugee-support-coordination", title: "ตัวอย่างโครงการ: ประสานความช่วยเหลือผู้พลัดถิ่น",
    category: "การคุ้มครองและประสานงาน", location: "พื้นที่ตัวอย่าง", department: "refugees",
    summary: "ตัวอย่างการเล่าภารกิจที่ให้ความสำคัญกับความปลอดภัย ความเป็นส่วนตัว และการส่งต่อบริการที่เหมาะสม",
    image: "public/editorial/participation.webp", alt: "ภาพประกอบแนวคิดการประสานความช่วยเหลืออย่างปลอดภัย",
    paragraphs: [
      "ภารกิจที่เกี่ยวข้องกับผู้พลัดถิ่นต้องเริ่มจากความปลอดภัยและความต้องการของผู้ได้รับผลกระทบ ตัวอย่างนี้จึงเน้นวิธีรับเรื่องและส่งต่อให้ผู้รับผิดชอบโดยเปิดเผยข้อมูลต่อสาธารณะให้น้อยที่สุด",
      "ผู้ประสานงานควรตรวจว่ามีหน่วยงานใดให้บริการอยู่แล้ว ช่องทางติดต่อใดเหมาะสม และมีข้อจำกัดด้านภาษา เอกสาร หรือการเดินทางหรือไม่ การทำงานร่วมกับเครือข่ายช่วยลดการส่งต่อหลายทอดโดยไม่มีผู้ติดตาม",
      "ความคืบหน้าที่นำขึ้นเว็บควรเป็นข้อมูลภาพรวมที่ไม่ทำให้บุคคลถูกระบุตัวตน เช่น ประเภทของการประสานงานและขั้นตอนที่เสร็จแล้ว ไม่ใช่รายชื่อ ที่อยู่ หรือเรื่องส่วนตัว",
      "ข้อความและภาพในหน้านี้เป็นแบบจำลอง ไม่มีบุคคลหรือกรณีจริง เมื่อจัดทำโครงการจริงต้องให้ฝ่ายที่รับผิดชอบตรวจถ้อยคำ สิทธิ์ภาพ และมาตรการคุ้มครองก่อนเผยแพร่",
    ],
  },
  {
    slug: "humanitarian-knowledge", title: "ตัวอย่างโครงการ: พัฒนาความรู้เพื่องานมนุษยธรรม",
    category: "ความรู้และการเรียนรู้", location: "เครือข่ายทั่วประเทศ (ตัวอย่าง)", department: "academic",
    summary: "ดูรูปแบบภารกิจด้านวิชาการ ตั้งแต่รวบรวมคำถามจากพื้นที่จนถึงผลิตข้อมูลที่นำไปใช้ร่วมกันได้",
    image: "public/editorial/work-areas.webp", alt: "ภาพประกอบแนวคิดการเรียนรู้ร่วมกันในเครือข่าย",
    paragraphs: [
      "งานวิชาการที่เชื่อมกับภารกิจควรเริ่มจากคำถามของผู้ปฏิบัติงาน ไม่ใช่เริ่มจากหัวข้อที่กำหนดไว้ล่วงหน้า โครงการตัวอย่างนี้แสดงวิธีรวบรวมประเด็นจากฝ่ายงานและศูนย์ประสานงานอย่างเป็นระบบ",
      "หลังระบุประเด็น ทีมงานอาจทบทวนข้อมูลที่มี เชิญผู้เชี่ยวชาญที่เกี่ยวข้อง และจัดทำสื่อหรือเวทีแลกเปลี่ยนที่เข้าใจง่าย เนื้อหาทุกชิ้นควรระบุที่มา วันที่จัดทำ และข้อจำกัดของข้อมูล",
      "ผลที่คาดหวังจากโครงการลักษณะนี้ไม่ใช่เพียงจำนวนเอกสารหรือกิจกรรม แต่รวมถึงการนำความรู้ไปปรับขั้นตอนทำงานจริง ซึ่งต้องมีวิธีติดตามและหลักฐานที่เหมาะสมก่อนรายงานต่อสาธารณะ",
      "หน้านี้แสดงตัวอย่างการจัดวางโครงการวิชาการเท่านั้น ยังไม่มีหลักสูตร กำหนดการ หรือผลการศึกษาใดที่ CHNS รับรอง",
    ],
  },
  {
    slug: "responsible-communication", title: "ตัวอย่างโครงการ: สื่อสารภารกิจอย่างรับผิดชอบ",
    category: "การสื่อสาร", location: "ช่องทางออนไลน์ (ตัวอย่าง)", department: "communications",
    summary: "รูปแบบโครงการด้านสื่อที่เชื่อมข่าว ภาพ และผลการทำงาน พร้อมตรวจสิทธิ์และความถูกต้องก่อนเผยแพร่",
    image: "public/editorial/transparency.webp", alt: "ภาพประกอบแนวคิดการตรวจข้อมูลก่อนสื่อสาร",
    paragraphs: [
      "การสื่อสารภารกิจช่วยให้สังคมเข้าใจงานและติดตามความคืบหน้าได้ แต่ต้องคำนึงถึงความถูกต้องและศักดิ์ศรีของผู้เกี่ยวข้อง โครงการจำลองนี้จัดลำดับงานตั้งแต่รับข้อมูลดิบจนถึงการตรวจทานก่อนเผยแพร่",
      "ทีมสื่อสารควรตรวจแหล่งข้อมูล วันเวลา คำบรรยายภาพ และขอบเขตการอนุญาตใช้สื่อ พร้อมแยกข้อเท็จจริงที่ตรวจแล้วออกจากแผนที่ยังไม่เกิดขึ้น การสรุปให้สั้นไม่ควรทำให้ความหมายคลาดเคลื่อน",
      "หลังเผยแพร่ควรมีช่องทางรับข้อแก้ไขและบันทึกการเปลี่ยนแปลง เพื่อให้ข่าวและรายงานที่อ้างอิงภารกิจเดียวกันสอดคล้องกันในทุกช่องทาง",
      "ตัวอย่างนี้ไม่ได้อ้างว่ามีแคมเปญหรือผลงานจริง ภาพทั้งหมดเป็นภาพประกอบสำหรับทดสอบการออกแบบหน้าโครงการ",
    ],
  },
  {
    slug: "zakat-family-support", title: "ตัวอย่างโครงการ: ซะกาตเพื่อครอบครัวเปราะบาง",
    category: "ซะกาตและสวัสดิการ", location: "พื้นที่ตัวอย่าง", department: "zakat",
    summary: "ตัวอย่างหน้าภารกิจที่อธิบายการคัดกรองผู้มีสิทธิรับซะกาตและการส่งต่อความช่วยเหลืออย่างเป็นธรรม",
    image: "public/editorial/home-relief.jpg", alt: "ภาพประกอบแนวคิดการดูแลครอบครัวเปราะบาง",
    paragraphs: [
      "การจัดการซะกาตเริ่มจากการระบุผู้มีสิทธิตามหลักการและตรวจสอบความต้องการจริง ตัวอย่างนี้แสดงลำดับงานตั้งแต่รับข้อมูล คัดกรอง จนถึงการส่งมอบที่ตรวจสอบได้",
      "ข้อมูลของครอบครัวที่เปราะบางควรใช้เท่าที่จำเป็นและเก็บอย่างปลอดภัย การตัดสินใจช่วยเหลือควรอ้างอิงเกณฑ์ที่ชัดเจนและโปร่งใส ไม่ใช้ความรู้สึกส่วนตัวเป็นตัวตั้ง",
      "ความคืบหน้าที่เผยแพร่ควรเป็นภาพรวมที่ไม่ทำให้ผู้รับถูกระบุตัวตน ตัวอย่างนี้ไม่มีการรับเงินและไม่ใช่โครงการที่กำลังดำเนินการจริง",
    ],
  },
  {
    slug: "special-affairs-readiness", title: "ตัวอย่างโครงการ: เตรียมความพร้อมกิจการพิเศษ",
    category: "กิจการพิเศษ", location: "พื้นที่ตัวอย่าง", department: "special",
    summary: "ตัวอย่างหน้าภารกิจที่อธิบายการวางระบบและทรัพยากรสำหรับงานเฉพาะกิจที่ยังอยู่ระหว่างจัดทำ",
    image: "assets/mockups/coordination.jpg", alt: "ภาพประกอบแนวคิดการวางแผนงานเฉพาะกิจ",
    paragraphs: [
      "งานเฉพาะกิจมักเกิดขึ้นเมื่อมีสถานการณ์ที่ต้องอาศัยการประสานหลายฝ่าย ตัวอย่างนี้แสดงการเตรียมบทบาท ทรัพยากร และช่องทางตัดสินใจไว้ล่วงหน้าเพื่อให้เริ่มงานได้เร็ว",
      "การซักซ้อมและทบทวนแผนช่วยให้ทีมเข้าใจหน้าที่ของตนและลดความสับสนเมื่อเกิดเหตุจริง ข้อมูลและเอกสารที่ใช้ควรจัดเก็บในที่เดียวและเข้าถึงได้ตามสิทธิ์",
      "รูปแบบนี้เป็นการสาธิตหน้าภารกิจเท่านั้น ยังไม่มีกิจกรรม พื้นที่ หรือกำหนดการจริงที่ CHNS รับรอง",
    ],
  },
  {
    slug: "flood-relief-kits", title: "ตัวอย่างโครงการ: ถุงยังชีพฤดูน้ำหลาก",
    category: "ความช่วยเหลือพื้นฐาน", location: "พื้นที่ตัวอย่าง", department: "domestic",
    summary: "ตัวอย่างหน้าภารกิจที่อธิบายการเตรียมและส่งมอบถุงยังชีพในช่วงอุทกภัยอย่างเป็นระบบ",
    image: "assets/mockups/community-relief.jpg", alt: "ภาพประกอบแนวคิดการเตรียมถุงยังชีพ",
    paragraphs: [
      "เมื่อเข้าสู่ฤดูน้ำหลาก ความต้องการสิ่งของจำเป็นมักเพิ่มขึ้นอย่างรวดเร็ว ตัวอย่างนี้แสดงการประเมินพื้นที่ จัดชุดยังชีพ และวางเส้นทางส่งมอบที่ปลอดภัยสำหรับทั้งผู้ให้และผู้รับ",
      "การบันทึกจำนวนที่เตรียม จำนวนที่ส่งถึง และพื้นที่ที่ยังเข้าไม่ได้ ช่วยให้การรายงานตรงกับความเป็นจริง มากกว่าการสรุปว่าดำเนินการครบแล้ว",
      "ตัวอย่างนี้ไม่มีการรับเงินและไม่ใช่ภารกิจที่กำลังดำเนินการจริง ภาพเป็นภาพประกอบเพื่อทดสอบการออกแบบ",
    ],
  },
  {
    slug: "clean-water-shelter", title: "ตัวอย่างโครงการ: น้ำสะอาดในพื้นที่พักพิง",
    category: "ภารกิจต่างประเทศ", location: "พื้นที่ตัวอย่าง", department: "international",
    summary: "ตัวอย่างหน้าภารกิจที่อธิบายการสนับสนุนน้ำสะอาดและสุขอนามัยในพื้นที่พักพิงร่วมกับหน่วยงานในพื้นที่",
    image: "public/editorial/participation.webp", alt: "ภาพประกอบแนวคิดการสนับสนุนน้ำสะอาด",
    paragraphs: [
      "การเข้าถึงน้ำสะอาดเป็นพื้นฐานของสุขภาพในพื้นที่พักพิง ตัวอย่างนี้แสดงการประสานกับหน่วยงานที่ทำงานอยู่แล้วเพื่อเลือกวิธีสนับสนุนที่เหมาะกับบริบทของพื้นที่",
      "การติดตามควรดูทั้งปริมาณน้ำ คุณภาพ และความต่อเนื่องของการดูแลรักษา ไม่ใช่เพียงจำนวนครั้งที่ส่งมอบ เพื่อให้ประโยชน์เกิดขึ้นจริงในระยะยาว",
      "ตัวอย่างนี้ไม่อ้างพื้นที่หรือพันธมิตรจริง และไม่ใช่โครงการที่เปิดรับการสนับสนุนในขณะนี้",
    ],
  },
];

const apply = process.argv.includes("--apply");
const root = process.cwd();
const env = Object.fromEntries((await readFile(join(root, ".env.local"), "utf8")).split("\n")
  .filter((line) => line.includes("=") && !line.trimStart().startsWith("#"))
  .map((line) => { const index = line.indexOf("="); return [line.slice(0, index), line.slice(index + 1)]; }));
const url = new URL(env.NEXT_PUBLIC_SUPABASE_URL);
const ref = url.hostname.match(/^([a-z0-9]+)\.supabase\.co$/)?.[1];
if (!ref) throw new Error("Supabase project URL ไม่ถูกต้อง");
const keys = JSON.parse(execFileSync("supabase", ["projects", "api-keys", "--project-ref", ref, "--reveal", "--output", "json"],
  { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }));
const serviceKey = keys.find((item) => item.name === "service_role")?.api_key;
if (!serviceKey) throw new Error("Supabase CLI ไม่มีสิทธิ์อ่าน service key ของโปรเจกต์นี้");
const client = createClient(url.toString(), serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
const { data: existing, error: queryError } = await client.from("projects")
  .select("id,slug,title,category,location,department_slug,summary,body,status,is_mockup,showcase_visible")
  .in("slug", examples.map((item) => item.slug));
if (queryError) throw queryError;
const bySlug = new Map(existing.map((item) => [item.slug, item]));
const conflicts = existing.filter((item) => item.status !== "draft" || !item.is_mockup);
if (conflicts.length) throw new Error(`พบ slug ที่ไม่ใช่ mockup draft: ${conflicts.map((item) => item.slug).join(", ")}`);
const bodyFor = (item) => ["ข้อมูลจำลองสำหรับพรีวิวเว็บไซต์เท่านั้น ไม่ใช่โครงการหรือภารกิจจริงของ CHNS", ...item.paragraphs].join("\n\n");
const additions = examples.filter((item) => !bySlug.has(item.slug));
const updates = examples.filter((item) => {
  const row = bySlug.get(item.slug);
  return row && (row.title !== item.title || row.category !== item.category || row.location !== item.location
    || row.department_slug !== item.department || row.summary !== item.summary || row.body !== bodyFor(item)
    || !row.showcase_visible);
});
console.log(`Project mockups: ${examples.length} total, ${updates.length} update, ${additions.length} add.`);
if (!apply) {
  console.log("Dry run only. Use --apply to update Supabase.");
  process.exit(0);
}

for (const item of examples) {
  const row = bySlug.get(item.slug);
  if (row) {
    if (!updates.includes(item)) continue;
    const { error } = await client.from("projects").update({
      title: item.title, category: item.category, location: item.location, department_slug: item.department,
      summary: item.summary, body: bodyFor(item), showcase_visible: true, updated_at: new Date().toISOString(),
    }).eq("id", row.id).eq("status", "draft").eq("is_mockup", true);
    if (error) throw new Error(`${item.slug}: ${error.message}`);
    console.log(`Updated ${item.slug}`);
    continue;
  }
  const hex = createHash("sha256").update(`chns-expanded-project-preview:${item.slug}`).digest("hex").slice(0, 32);
  const imageKey = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}.webp`;
  const bytes = await readFile(join(root, item.image));
  const image = await sharp(bytes).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
  const { error: uploadError } = await client.storage.from("chns-content")
    .upload(`project-images/${imageKey}`, image, { contentType: "image/webp", upsert: false });
  if (uploadError && !/already exists|duplicate/i.test(uploadError.message)) throw new Error(`${item.slug}: ${uploadError.message}`);
  const { error: insertError } = await client.from("projects").insert({
    slug: item.slug, title: item.title, category: item.category, location: item.location,
    department_slug: item.department, summary: item.summary, body: bodyFor(item),
    image_key: imageKey, image_alt: item.alt, image_credit: "ภาพประกอบจำลองสำหรับพรีวิว CHNS",
    image_rights_confirmed: false, status: "draft", is_mockup: true, showcase_visible: true,
    created_by: null, updated_by: null,
  });
  if (insertError) throw new Error(`${item.slug}: ${insertError.message}`);
  console.log(`Added ${item.slug}`);
}
console.log("All project examples remain labeled draft mockups; only these showcase records are visible publicly.");

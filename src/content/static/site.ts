// ชื่อฝ่ายอ้างอิงผังองค์กรใน CHNS Revision Brief 01; รายละเอียดรายฝ่ายรออนุมัติ
export const departments = [
  { slug: "domestic", name: "ฝ่ายในประเทศ" },
  { slug: "refugees", name: "ฝ่ายผู้ลี้ภัย" },
  { slug: "zakat", name: "กองซะกาต" },
  { slug: "international", name: "ฝ่ายต่างประเทศ" },
  { slug: "academic", name: "ฝ่ายวิชาการ" },
  { slug: "relations", name: "ฝ่ายองค์กรสัมพันธ์" },
  { slug: "special", name: "ฝ่ายกิจการพิเศษ" },
  { slug: "communications", name: "ฝ่ายการตลาดและสื่อสาร" },
] as const;

export const contactDepartments = [
  { slug: "general", name: "สำนักงานกลาง / ไม่แน่ใจ" },
  ...departments,
] as const;

type NavigationItem = {
  label: string;
  href: string;
  children?: readonly { label: string; href: string }[];
};

export const site = {
  shortName: "CHNS",
  officialName: "สภาเครือข่ายช่วยเหลือด้านมนุษยธรรม สำนักจุฬาราชมนตรี",
  navigation: [
    { label: "หน้าแรก", href: "/" },
    { label: "เกี่ยวกับเรา", href: "/about" },
    { label: "โครงการและภารกิจ", href: "/projects" },
    { label: "ฝ่ายของเรา", href: "/departments", children: [
      ...departments.map((department) => ({ label: department.name, href: `/departments/${department.slug}` })),
    ] },
    { label: "ศูนย์ประสานงาน", href: "/centers", children: [
      { label: "ศูนย์ระดับภูมิภาค", href: "/centers#regional" },
      { label: "ศูนย์ระดับจังหวัด", href: "/centers#provincial" },
      { label: "องค์กรสมาชิก", href: "/#network" },
    ] },
    { label: "ข่าวสาร", href: "/news", children: [
      { label: "วิดีโอและสื่อ", href: "/media" },
      { label: "รายงานและเอกสาร", href: "/reports" },
    ] },
    { label: "ร่วมกับเรา", href: "/participate" },
    { label: "ติดต่อเรา", href: "/contact" },
  ] satisfies readonly NavigationItem[],
} as const;

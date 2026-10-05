import Link from "next/link";

export type BreadcrumbItem = { label: string; href?: string };

export function SiteBreadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="site-breadcrumbs" aria-label="เส้นทางหน้า">
      <ol className="shell">
        <li><Link href="/">หน้าแรก</Link></li>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

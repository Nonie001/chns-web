import Link from "next/link";

export function ListPagination({
  pathname,
  page,
  pageCount,
  filters,
}: {
  pathname: "/news" | "/projects";
  page: number;
  pageCount: number;
  filters: Record<string, string>;
}) {
  if (pageCount <= 1) return null;

  const href = (target: number) => {
    const params = new URLSearchParams(filters);
    params.set("page", String(target));
    return `${pathname}?${params.toString()}#results`;
  };
  const pageNumbers = pageCount <= 5
    ? Array.from({ length: pageCount }, (_, index) => index + 1)
    : page <= 3
      ? [1, 2, 3, pageCount]
      : page >= pageCount - 2
        ? [1, pageCount - 2, pageCount - 1, pageCount]
        : [1, page - 1, page, page + 1, pageCount];

  return (
    <nav className="list-pagination" aria-label="เปลี่ยนหน้ารายการ">
      {page > 1 && <Link className="list-pagination__direction list-pagination__previous" href={href(page - 1)} aria-label="หน้าก่อนหน้า">← <span className="list-pagination__direction-label">ก่อนหน้า</span></Link>}
      <div className="list-pagination__pages">
        {pageNumbers.map((number, index) => (
          <span className="list-pagination__page-group" key={number}>
            {index > 0 && number - pageNumbers[index - 1] > 1 && <span className="list-pagination__ellipsis" aria-hidden="true">…</span>}
            <Link href={href(number)} aria-label={`หน้า ${number}`} aria-current={number === page ? "page" : undefined}>{number}</Link>
          </span>
        ))}
      </div>
      {page < pageCount && <Link className="list-pagination__direction list-pagination__next" href={href(page + 1)} aria-label="หน้าถัดไป"><span className="list-pagination__direction-label">ถัดไป</span> →</Link>}
    </nav>
  );
}

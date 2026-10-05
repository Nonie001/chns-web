import Link from "next/link";

type StatusViewProps = {
  code: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  action?: React.ReactNode;
};

export function StatusView({
  code, eyebrow, title, description, primaryHref, primaryLabel,
  secondaryHref, secondaryLabel, action,
}: StatusViewProps) {
  return (
    <section className="status-page" aria-labelledby="status-title">
      <div className="status-page__glow" aria-hidden="true" />
      <div className="status-page__content">
        <p className="status-page__eyebrow">{eyebrow}</p>
        <p className="status-page__code" aria-hidden="true">{code}</p>
        <h1 id="status-title">{title}</h1>
        <p className="status-page__description">{description}</p>
        <div className="status-page__actions">
          {action}
          <Link className="button button--dark" href={primaryHref}>{primaryLabel} <span aria-hidden="true">↗</span></Link>
          {secondaryHref && secondaryLabel && <Link className="text-link" href={secondaryHref}>{secondaryLabel} <span aria-hidden="true">↗</span></Link>}
        </div>
      </div>
    </section>
  );
}

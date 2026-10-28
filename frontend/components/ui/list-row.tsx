import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRightIcon } from "./icons";

type ListRowProps = {
  title: string;
  subtitle?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  /** Renders the row as a link when set, otherwise as a button if onClick is set. */
  href?: string;
  onClick?: () => void;
  selected?: boolean;
};

const ROW =
  "flex min-h-16 w-full items-center gap-3 rounded-md px-3 py-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

export function ListRow({ title, subtitle, leading, trailing, href, onClick, selected }: ListRowProps) {
  const interactive = Boolean(href || onClick);
  const content = (
    <>
      {leading && <div className="shrink-0 text-ink-muted">{leading}</div>}
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-medium text-ink">{title}</p>
        {subtitle && <div className="truncate text-sm text-ink-muted">{subtitle}</div>}
      </div>
      {trailing && <div className="flex shrink-0 flex-col items-end gap-1 text-sm">{trailing}</div>}
      {interactive && <ChevronRightIcon className="size-4 shrink-0 text-ink-muted" />}
    </>
  );
  const tone = selected ? "bg-primary-soft" : interactive ? "hover:bg-surface-muted" : "";

  if (href) {
    return (
      <Link href={href} className={`${ROW} ${tone}`}>
        {content}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-pressed={selected} className={`${ROW} ${tone}`}>
        {content}
      </button>
    );
  }
  return <div className={`${ROW} ${tone}`}>{content}</div>;
}

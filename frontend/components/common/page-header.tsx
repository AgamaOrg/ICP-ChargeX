import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronLeftIcon } from "@/components/ui/icons";

type PageHeaderProps = {
  title: string;
  /** Up to two icon actions on the right (design.md §3). */
  actions?: ReactNode;
  backHref?: string;
  /** Shown before the title when there is no back link, e.g. the brand mark. */
  leading?: ReactNode;
  backLabel?: string;
};

export function PageHeader({ title, actions, backHref, backLabel = "Back", leading }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 bg-canvas px-4">
      {backHref && (
        <Link
          href={backHref}
          aria-label={backLabel}
          className="-ml-2 inline-flex size-11 items-center justify-center rounded-md text-ink hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          <ChevronLeftIcon />
        </Link>
      )}
      {!backHref && leading}
      <h1 className="min-w-0 flex-1 truncate text-xl font-semibold text-ink">{title}</h1>
      {actions && <div className="flex items-center gap-1">{actions}</div>}
    </header>
  );
}

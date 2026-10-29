import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronLeftIcon } from "@/components/ui/icons";

type PageHeaderProps = {
  title: string;
  /** Up to two icon actions on the right (design.md §3). */
  actions?: ReactNode;
  backHref?: string;
  backLabel?: string;
};

/**
 * Inner-screen header: a short version of the home screen's teal band
 * (components/common/brand-header.tsx), so every screen reads as one app.
 */
export function PageHeader({ title, actions, backHref, backLabel = "Back" }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-30 mb-4 flex min-h-16 items-center gap-2 rounded-b-xl bg-primary px-4 py-3 text-primary-foreground shadow-card">
      {backHref && (
        <Link
          href={backHref}
          aria-label={backLabel}
          className="-ml-2 inline-flex size-11 items-center justify-center rounded-md hover:bg-primary-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground"
        >
          <ChevronLeftIcon />
        </Link>
      )}
      <h1 className="min-w-0 flex-1 truncate text-xl font-semibold">{title}</h1>
      {actions && <div className="flex items-center gap-1">{actions}</div>}
    </header>
  );
}

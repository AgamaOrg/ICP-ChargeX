import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "./logo";

type BrandHeaderProps = {
  title: string;
  /** Small line above the title, e.g. a greeting. */
  eyebrow?: string;
  /** Extra bottom room so a summary card can overlap the band (home screens). */
  tall?: boolean;
  /** Right-hand controls, e.g. the bell and <LogoutLink />. */
  actions?: ReactNode;
};

/**
 * Wallet-style header band in the brand's deep teal, shared by the rider and
 * admin home screens (design.md §8.8: borrow the layout, not GCash's colours).
 * Kept solid: §4.4 keeps gradients off headers.
 */
export function BrandHeader({ title, eyebrow, tall = false, actions }: BrandHeaderProps) {
  return (
    <header className={`rounded-b-xl bg-primary px-4 pt-4 text-primary-foreground ${tall ? "pb-16" : "pb-5"}`}>
      <div className="flex items-center gap-3">
        {/* Colour mark on a white chip: the dark tile would vanish into the band. */}
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-surface">
          <Logo variant="mark" size="sm" />
        </span>
        <div className="min-w-0 flex-1">
          {eyebrow && <p className="text-sm text-primary-foreground/80">{eyebrow}</p>}
          <h1 className="truncate text-xl font-semibold">{title}</h1>
        </div>
        {actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
      </div>
    </header>
  );
}

/** Back to the login page. Demo only: there is no session to end (glossary). */
export function LogoutLink() {
  return (
    <Link
      href="/"
      className="inline-flex min-h-11 items-center rounded-md px-3 text-base font-semibold text-primary-foreground hover:bg-primary-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground"
    >
      Log out
    </Link>
  );
}

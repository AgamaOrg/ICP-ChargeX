"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BatteryIcon, HomeIcon, LeasesIcon, TradeIcon } from "@/components/ui/icons";

const ITEMS = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/batteries", label: "Batteries", icon: BatteryIcon },
  { href: "/leases", label: "Leases", icon: LeasesIcon },
  { href: "/trading", label: "Trade", icon: TradeIcon },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex h-16 max-w-md">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex h-full flex-col items-center justify-center gap-0.5 text-xs font-medium focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus ${active ? "text-primary" : "text-ink-muted"}`}
              >
                <Icon className={`size-6 ${active ? "fill-primary-soft" : ""}`} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

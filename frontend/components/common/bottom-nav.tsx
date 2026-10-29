"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BoltIcon, HomeIcon, LeasesIcon } from "@/components/ui/icons";
// TRADING PAUSED (2026-10-29): restore a Trade item when trading returns.
// import { TradeIcon } from "@/components/ui/icons";

// Wallet-style: two plain items around a raised centre action (design.md §3).
// Three items on purpose: riders have three places to go, and fewer choices
// suit older users (§1). The map lives inside Find battery (List/Map).
const SIDE_ITEMS = {
  left: { href: "/dashboard", label: "Home", icon: HomeIcon },
  right: { href: "/leases", label: "My leases", icon: LeasesIcon },
  // TRADING PAUSED (2026-10-29): { href: "/trading", label: "Trade", icon: TradeIcon },
} as const;

export function BottomNav() {
  const pathname = usePathname();
  const findActive = pathname.startsWith("/batteries");

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto grid h-16 max-w-md grid-cols-3">
        <SideItem item={SIDE_ITEMS.left} active={pathname.startsWith(SIDE_ITEMS.left.href)} />
        <li className="flex justify-center">
          <Link
            href="/batteries"
            aria-current={findActive ? "page" : undefined}
            className="-mt-6 flex flex-col items-center gap-0.5 text-xs font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sheet ring-4 ring-surface">
              <BoltIcon className="size-7" />
            </span>
            Find battery
          </Link>
        </li>
        <SideItem item={SIDE_ITEMS.right} active={pathname.startsWith(SIDE_ITEMS.right.href)} />
      </ul>
    </nav>
  );
}

type Item = (typeof SIDE_ITEMS)[keyof typeof SIDE_ITEMS];

function SideItem({ item, active }: { item: Item; active: boolean }) {
  const Icon = item.icon;
  return (
    <li>
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={`flex h-full flex-col items-center justify-center gap-0.5 text-xs font-semibold focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus ${active ? "text-primary" : "text-ink-muted"}`}
      >
        <Icon className={`size-6 ${active ? "fill-primary-soft" : ""}`} />
        {item.label}
      </Link>
    </li>
  );
}

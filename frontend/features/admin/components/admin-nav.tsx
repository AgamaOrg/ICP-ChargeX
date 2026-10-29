import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { BatteryIcon, BoltIcon, HomeIcon, LeasesIcon, MapIcon } from "@/components/ui/icons";
import type { AdminView } from "../types";

type AdminNavProps = {
  view: AdminView;
  onRentOut: () => void;
};

type Item = { view: AdminView; label: string; icon: ComponentType<SVGProps<SVGSVGElement>> };

const LEFT: Item[] = [
  { view: "home", label: "Home", icon: HomeIcon },
  { view: "rentals", label: "Rentals", icon: LeasesIcon },
];
const RIGHT: Item[] = [
  { view: "batteries", label: "Batteries", icon: BatteryIcon },
  { view: "map", label: "Map", icon: MapIcon },
];

export const viewHref = (view: AdminView) => (view === "home" ? "/admin" : `/admin?view=${view}`);

/** Bottom nav with a raised centre action, like a wallet app's scan button. */
export function AdminNav({ view, onRentOut }: AdminNavProps) {
  return (
    <nav
      aria-label="Admin"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto grid h-16 max-w-md grid-cols-5">
        {LEFT.map((item) => (
          <NavItem key={item.view} item={item} active={item.view === view} />
        ))}
        <li className="flex justify-center">
          <button
            type="button"
            onClick={onRentOut}
            className="-mt-6 flex flex-col items-center gap-0.5 text-xs font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sheet ring-4 ring-surface">
              <BoltIcon className="size-7" />
            </span>
            Rent out
          </button>
        </li>
        {RIGHT.map((item) => (
          <NavItem key={item.view} item={item} active={item.view === view} />
        ))}
      </ul>
    </nav>
  );
}

function NavItem({ item, active }: { item: Item; active: boolean }) {
  const Icon = item.icon;
  return (
    <li>
      <Link
        href={viewHref(item.view)}
        scroll
        aria-current={active ? "page" : undefined}
        className={`flex h-full flex-col items-center justify-center gap-0.5 text-xs font-semibold focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus ${active ? "text-primary" : "text-ink-muted"}`}
      >
        <Icon className={`size-6 ${active ? "fill-primary-soft" : ""}`} />
        {item.label}
      </Link>
    </li>
  );
}

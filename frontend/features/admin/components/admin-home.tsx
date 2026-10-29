import Link from "next/link";
import type { ComponentType, ReactNode, SVGProps } from "react";
import { Card } from "@/components/ui/card";
import { BatteryIcon, LeasesIcon, MapIcon, ReturnIcon } from "@/components/ui/icons";
import type { Rental } from "../types";
import { viewHref } from "./admin-nav";
import type { BranchStock } from "./branch-card";
import { RentalList } from "./rental-list";

type AdminHomeProps = {
  outNow: number;
  late: number;
  dueSoon: number;
  ready: number;
  /** Late and due-soon rentals, most urgent first. */
  attention: Rental[];
  stocks: BranchStock[];
  nowMs: number;
  onOpenRental: (id: string) => void;
};

const ATTENTION_LIMIT = 3;

export function AdminHome({
  outNow,
  late,
  dueSoon,
  ready,
  attention,
  stocks,
  nowMs,
  onOpenRental,
}: AdminHomeProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Summary card overlaps the teal header band, like a wallet balance card.
          Renting out lives on the raised centre button in the nav. */}
      <Card className="-mt-12 flex flex-col gap-4">
        <div>
          <p className="text-base text-ink-muted">Batteries out now</p>
          <p className="text-5xl font-semibold tabular-nums text-ink">{outNow}</p>
        </div>
        <dl className="grid grid-cols-3 divide-x divide-line rounded-lg bg-surface-muted py-3 text-center">
          <Stat label="Late" value={late} tone={late > 0 ? "text-danger" : "text-ink"} />
          <Stat label="Due soon" value={dueSoon} tone="text-ink" />
          <Stat label="Ready" value={ready} tone="text-ink" />
        </dl>
      </Card>

      <Card aria-label="Shortcuts">
        <ul className="grid grid-cols-4 gap-2">
          <Shortcut icon={LeasesIcon} label="Rentals" href={viewHref("rentals")} />
          <Shortcut icon={ReturnIcon} label="Returned" href={`${viewHref("rentals")}&tab=returned`} />
          <Shortcut icon={BatteryIcon} label="Batteries" href={viewHref("batteries")} />
          <Shortcut icon={MapIcon} label="Map" href={viewHref("map")} />
        </ul>
      </Card>

      <Card aria-labelledby="attention-title" className="flex flex-col gap-2">
        <SectionTitle id="attention-title" action={<SeeAll href={viewHref("rentals")} />}>
          Needs attention
        </SectionTitle>
        {attention.length === 0 ? (
          <p className="py-3 text-base text-ink-muted">Everyone is on time.</p>
        ) : (
          <RentalList rentals={attention.slice(0, ATTENTION_LIMIT)} nowMs={nowMs} onOpen={onOpenRental} />
        )}
      </Card>

      <Card aria-labelledby="branches-title" className="flex flex-col gap-3">
        <SectionTitle id="branches-title" action={<SeeAll href={viewHref("batteries")} />}>
          Ready by branch
        </SectionTitle>
        <ul className="grid grid-cols-3 gap-2">
          {stocks.map(({ branch, batteries }) => {
            const count = batteries.filter((b) => b.status === "ready").length;
            return (
              <li key={branch.name}>
                <Link
                  href={`${viewHref("map")}&branch=${branch.code}`}
                  aria-label={`${branch.name}, ${count} ready. Show on map`}
                  className="flex min-h-16 flex-col justify-center rounded-lg border border-line px-3 py-2 hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  <span className="text-sm text-ink-muted">{branch.name}</span>
                  <span className={`text-2xl font-semibold tabular-nums ${count === 0 ? "text-warning" : "text-ink"}`}>
                    {count}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="flex flex-col-reverse">
      <dt className="text-sm text-ink-muted">{label}</dt>
      <dd className={`text-2xl font-semibold tabular-nums ${tone}`}>{value}</dd>
    </div>
  );
}

type ShortcutProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  href: string;
};

const SHORTCUT =
  "flex w-full flex-col items-center gap-1.5 rounded-lg py-1 text-sm font-medium text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

function Shortcut({ icon: Icon, label, href }: ShortcutProps) {
  return (
    <li>
      <Link href={href} className={SHORTCUT}>
        <span className="flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Icon className="size-6" />
        </span>
        {label}
      </Link>
    </li>
  );
}

function SectionTitle({ id, action, children }: { id: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h2 id={id} className="text-lg font-semibold text-ink">
        {children}
      </h2>
      {action}
    </div>
  );
}

function SeeAll({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center rounded-md px-2 text-base font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
    >
      See all
    </Link>
  );
}

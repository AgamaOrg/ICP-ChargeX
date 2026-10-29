"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { ListRow } from "@/components/ui/list-row";
import { LoadingRegion, Skeleton } from "@/components/ui/skeleton";
import { StatusPill } from "@/components/ui/status-pill";
import { formatMoney, formatRelative } from "@/lib/format";
import { useMockNow } from "@/lib/mock/use-mock-now";
import { useSimulatedLoad } from "@/lib/mock/use-simulated-load";
import { byLeaseUrgency, LEASE_STATUS_PILL } from "@/lib/status";
import type { Lease } from "@/lib/types/lease";

const MAX_ROWS = 3;

type ActiveLeasesListProps = {
  leases: Lease[];
};

export function ActiveLeasesList({ leases }: ActiveLeasesListProps) {
  const { state, retry } = useSimulatedLoad("We couldn't load your leases. Check your connection and try again.");
  const now = useMockNow();

  if (state.status === "loading") return <ActiveLeasesSkeleton />;

  const rows = state.status === "ready" && !state.forceEmpty ? [...leases].sort(byLeaseUrgency).slice(0, MAX_ROWS) : [];

  return (
    <Card aria-labelledby="active-leases-title" className="px-2">
      <SectionHeading />
      {state.status === "error" ? (
        <ErrorState message={state.message} onRetry={retry} />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No active leases"
          description="When you lease a battery, it shows up here with the time left."
          action={
            <Link
              href="/batteries"
              className="inline-flex h-10 items-center rounded-md border border-line px-4 text-sm font-medium text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              Browse batteries
            </Link>
          }
        />
      ) : (
        <ul>
          {rows.map((lease) => {
            const pill = LEASE_STATUS_PILL[lease.status];
            const when =
              lease.status === "overdue"
                ? `Was due ${formatRelative(lease.endsAt, now)}`
                : `Ends ${formatRelative(lease.endsAt, now)}`;
            return (
              <li key={lease.id}>
                <ListRow
                  href={`/leases?lease=${lease.id}`}
                  title={lease.batteryLabel}
                  subtitle={when}
                  trailing={
                    <>
                      <StatusPill tone={pill.tone} label={pill.label} />
                      <span className="tabular-nums text-ink">{formatMoney(lease.costMinorUnits)}</span>
                    </>
                  }
                />
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

function SectionHeading() {
  return (
    <div className="flex items-center justify-between px-2 pb-1">
      <h2 id="active-leases-title" className="text-base font-semibold text-ink">
        Active leases
      </h2>
      <Link
        href="/leases"
        className="inline-flex min-h-11 items-center rounded-md px-2 text-sm font-medium text-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        See all
      </Link>
    </div>
  );
}

export function ActiveLeasesSkeleton() {
  return (
    <Card className="px-2">
      <div className="px-2 pb-3">
        <Skeleton className="h-5 w-32" />
      </div>
      <LoadingRegion label="Loading active leases">
        {Array.from({ length: MAX_ROWS }, (_, i) => (
          <div key={i} className="flex min-h-16 items-center gap-3 px-3 py-2">
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-36" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </LoadingRegion>
    </Card>
  );
}

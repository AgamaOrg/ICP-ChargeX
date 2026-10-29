"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingRegion, Skeleton } from "@/components/ui/skeleton";
import { useMockNow } from "@/lib/mock/use-mock-now";
import { useSimulatedLoad } from "@/lib/mock/use-simulated-load";
import { byLeaseUrgency } from "@/lib/status";
import type { Lease } from "@/lib/types/lease";
import { useLeases } from "../../hooks/use-leases";
import type { DurationOption, LeaseTab } from "../../types";
import { LeaseDetail } from "./lease-detail";
import { LeaseRow } from "./lease-row";
import { LeaseTabs, panelId, tabId } from "./lease-tabs";

type LeasePanelProps = {
  extendOptions: DurationOption[];
  issueTypes: readonly string[];
};

// Two tabs instead of three: overdue leases sit at the top of "Now", where a
// rider will see them, rather than behind a separate tab.
const TAB_FILTER: Record<LeaseTab, (lease: Lease) => boolean> = {
  current: (l) => l.status !== "completed",
  past: (l) => l.status === "completed",
};

const TAB_LABEL: Record<LeaseTab, string> = { current: "Now", past: "Returned" };

const EMPTY_COPY: Record<LeaseTab, { title: string; description: string }> = {
  current: { title: "No battery right now", description: "Lease one from a kiosk near you." },
  past: { title: "Nothing returned yet", description: "Batteries you bring back will show here." },
};

export function LeasePanel({ extendOptions, issueTypes }: LeasePanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const allLeases = useLeases();
  const now = useMockNow();
  const { state, retry } = useSimulatedLoad("We couldn't load your leases. Check your connection and try again.");

  const tabParam = searchParams.get("tab");
  const tab: LeaseTab = tabParam === "past" ? "past" : "current";
  const leaseId = searchParams.get("lease");
  const leases = state.status === "ready" && !state.forceEmpty ? allLeases : [];

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null) params.delete(key);
      else params.set(key, value);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  if (state.status === "loading") return <LeasePanelSkeleton />;
  if (state.status === "error") return <ErrorState message={state.message} onRetry={retry} />;

  if (leaseId) {
    const lease = leases.find((l) => l.id === leaseId);
    return lease ? (
      <LeaseDetail
        key={lease.id}
        lease={lease}
        nowMs={now}
        extendOptions={extendOptions}
        issueTypes={issueTypes}
        onBack={() => updateParams({ lease: null })}
      />
    ) : (
      <EmptyState
        title="We couldn't find that lease"
        description="It may have been removed, or the link is out of date."
        action={
          <Link
            href="/leases"
            className="inline-flex h-12 items-center rounded-md border border-line px-4 text-base font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            See my leases
          </Link>
        }
      />
    );
  }

  const tabs = (Object.keys(TAB_FILTER) as LeaseTab[]).map((id) => ({
    id,
    label: TAB_LABEL[id],
    count: leases.filter(TAB_FILTER[id]).length,
  }));
  const rows = leases
    .filter(TAB_FILTER[tab])
    .sort(tab === "past" ? (a, b) => Date.parse(b.endsAt) - Date.parse(a.endsAt) : byLeaseUrgency);

  return (
    <div className="flex flex-col gap-4">
      <LeaseTabs tabs={tabs} value={tab} onChange={(next) => updateParams({ tab: next === "current" ? null : next })} />
      <div role="tabpanel" id={panelId(tab)} aria-labelledby={tabId(tab)} tabIndex={0} className="rounded-lg bg-surface p-2 shadow-card focus-visible:outline-2 focus-visible:outline-focus">
        {rows.length === 0 ? (
          <EmptyState
            title={EMPTY_COPY[tab].title}
            description={EMPTY_COPY[tab].description}
            action={
              tab === "current" ? (
                <Link
                  href="/batteries"
                  className="inline-flex h-12 items-center rounded-md border border-line px-4 text-base font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  Find a battery
                </Link>
              ) : undefined
            }
          />
        ) : (
          <ul>
            {rows.map((lease) => (
              <li key={lease.id}>
                <LeaseRow lease={lease} nowMs={now} onOpen={(id) => updateParams({ lease: id })} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function LeasePanelSkeleton() {
  return (
    <LoadingRegion label="Loading leases">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-13 w-full" />
        <div className="rounded-lg bg-surface p-2 shadow-card">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex min-h-16 items-center gap-3 px-3 py-2">
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      </div>
    </LoadingRegion>
  );
}

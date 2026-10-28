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

const TAB_FILTER: Record<LeaseTab, (lease: Lease) => boolean> = {
  active: (l) => l.status === "active" || l.status === "ending-soon",
  completed: (l) => l.status === "completed",
  overdue: (l) => l.status === "overdue",
};

const TAB_LABEL: Record<LeaseTab, string> = { active: "Active", completed: "Completed", overdue: "Overdue" };

const EMPTY_COPY: Record<LeaseTab, { title: string; description: string }> = {
  active: { title: "No active leases", description: "Lease a battery from a nearby kiosk to get started." },
  completed: { title: "No completed leases yet", description: "Leases you've returned will show up here." },
  overdue: { title: "Nothing overdue", description: "Every battery you've leased is on time." },
};

export function LeasePanel({ extendOptions, issueTypes }: LeasePanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const allLeases = useLeases();
  const now = useMockNow();
  const { state, retry } = useSimulatedLoad("We couldn't load your leases. Check your connection and try again.");

  const tabParam = searchParams.get("tab");
  const tab: LeaseTab = tabParam === "completed" || tabParam === "overdue" ? tabParam : "active";
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
            className="inline-flex h-10 items-center rounded-md border border-line px-4 text-sm font-medium text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            See all leases
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
    .sort(tab === "completed" ? (a, b) => Date.parse(b.endsAt) - Date.parse(a.endsAt) : byLeaseUrgency);

  return (
    <div className="flex flex-col gap-4">
      <LeaseTabs tabs={tabs} value={tab} onChange={(next) => updateParams({ tab: next === "active" ? null : next })} />
      <div role="tabpanel" id={panelId(tab)} aria-labelledby={tabId(tab)} tabIndex={0} className="rounded-lg bg-surface p-2 shadow-card focus-visible:outline-2 focus-visible:outline-focus">
        {rows.length === 0 ? (
          <EmptyState
            title={EMPTY_COPY[tab].title}
            description={EMPTY_COPY[tab].description}
            action={
              tab === "active" ? (
                <Link
                  href="/batteries"
                  className="inline-flex h-10 items-center rounded-md border border-line px-4 text-sm font-medium text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  Browse batteries
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
      <p className="text-center text-xs text-ink-muted">Demo data. Changes reset when you reload the page.</p>
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

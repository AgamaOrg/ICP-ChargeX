"use client";

import Link from "next/link";
import { BatteryMeter } from "@/components/ui/battery-meter";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { BatteryIcon } from "@/components/ui/icons";
import { LoadingRegion, Skeleton } from "@/components/ui/skeleton";
import { StatusPill } from "@/components/ui/status-pill";
import { formatDuration, formatPercent, formatRelative } from "@/lib/format";
import { useMockNow } from "@/lib/mock/use-mock-now";
import { useSimulatedLoad } from "@/lib/mock/use-simulated-load";
import { BATTERY_STATUS_PILL, batteryCondition } from "@/lib/status";
import type { Battery } from "@/lib/types/battery";
import { useBatteryStatus } from "../hooks/use-battery-status";

// Demo rates used for the time estimates (percent per minute).
const CHARGE_RATE = 0.5;
const DRAIN_RATE = 0.4;

type BatteryStatusCardProps = {
  battery: Battery | null;
};

export function BatteryStatusCard({ battery }: BatteryStatusCardProps) {
  const { state, retry } = useSimulatedLoad(
    "We couldn't load your battery. Check your connection and try again.",
  );

  if (state.status === "loading") return <BatteryStatusSkeleton />;

  return (
    <Card aria-labelledby="battery-status-title" className="min-h-48">
      <CardHeading />
      {state.status === "error" ? (
        <ErrorState message={state.message} onRetry={retry} />
      ) : !battery || state.forceEmpty ? (
        <EmptyState
          icon={<BatteryIcon className="size-8" />}
          title="No battery yet"
          description="Lease a battery from a nearby kiosk and its charge will show up here."
          action={
            <Link
              href="/batteries"
              className="inline-flex h-12 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              Find a battery
            </Link>
          }
        />
      ) : (
        <LiveBatteryStatus initial={battery} />
      )}
    </Card>
  );
}

function CardHeading() {
  return (
    <div className="mb-3">
      <h2 id="battery-status-title" className="text-base font-semibold text-ink">
        My battery
      </h2>
    </div>
  );
}

function LiveBatteryStatus({ initial }: { initial: Battery }) {
  const { battery, updatedAtMs } = useBatteryStatus(initial);
  const now = useMockNow(10_000);
  const pill = BATTERY_STATUS_PILL[battery.status];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-ink-muted">{battery.label}</p>
        <div aria-live="polite">
          <StatusPill tone={pill.tone} label={pill.label} />
        </div>
      </div>
      <p className="flex items-baseline gap-2">
        <span className="text-5xl font-semibold tabular-nums text-ink">{formatPercent(battery.chargePercent)}</span>
        <span className="text-lg text-ink-muted">charged</span>
      </p>
      <BatteryMeter label="Charge" value={battery.chargePercent} />
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-lg bg-surface-muted px-3 py-2 text-base">
        <span className="font-medium text-ink">{estimate(battery)}</span>
        <span className="text-ink-muted">Condition: {batteryCondition(battery.healthPercent)}</span>
      </div>
      <p className="text-sm text-ink-muted">
        Updated {formatRelative(new Date(updatedAtMs).toISOString(), now)}
      </p>
    </div>
  );
}

function estimate(battery: Battery): string {
  switch (battery.status) {
    case "charging":
      return battery.chargePercent >= 100
        ? "Fully charged"
        : `Full in about ${formatDuration((100 - battery.chargePercent) / CHARGE_RATE)}`;
    case "in-use":
      return `About ${formatDuration(battery.chargePercent / DRAIN_RATE)} left`;
    case "idle":
      return "Ready to use";
    case "fault":
      return "Stopped because of a fault. Return it to a kiosk.";
  }
}

export function BatteryStatusSkeleton() {
  return (
    <Card className="min-h-48">
      <LoadingRegion label="Loading battery status">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-4 w-48" />
        </div>
      </LoadingRegion>
    </Card>
  );
}

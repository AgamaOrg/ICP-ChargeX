"use client";

import Link from "next/link";
import { BatteryMeter } from "@/components/ui/battery-meter";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { BatteryIcon } from "@/components/ui/icons";
import { StatusPill, type StatusTone } from "@/components/ui/status-pill";
import { formatDateTime, formatDistance, formatPercent, formatRelative } from "@/lib/format";
import { useMockNow } from "@/lib/mock/use-mock-now";
import { BATTERY_STATUS_PILL } from "@/lib/status";
import { useBatteryTracking } from "../hooks/use-battery-tracking";
import type { BatteryTracking, MaintenanceSeverity } from "../types";
import { TrackingMap } from "./tracking-map";
import { UsageChart } from "./usage-chart";

type BatteryTrackingPanelProps = {
  tracking: BatteryTracking | null;
  empty: boolean;
};

const ALERT_TONE: Record<MaintenanceSeverity, StatusTone> = {
  info: "info",
  success: "success",
  warning: "warning",
  danger: "danger",
};

const ALERT_LABEL: Record<MaintenanceSeverity, string> = {
  info: "Info",
  success: "Passed",
  warning: "Action needed",
  danger: "Urgent",
};

export function BatteryTrackingPanel({ tracking, empty }: BatteryTrackingPanelProps) {
  if (!tracking || empty) {
    return (
      <Card>
        <EmptyState
          icon={<BatteryIcon className="size-8" />}
          title="No battery to track"
          description="Lease a battery and its live location, health, and usage will show up here."
          action={
            <Link
              href="/batteries"
              className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              Find a battery
            </Link>
          }
        />
      </Card>
    );
  }

  return <LiveTracking initial={tracking} />;
}

function LiveTracking({ initial }: { initial: BatteryTracking }) {
  const { tracking, updatedAtMs } = useBatteryTracking(initial);
  const now = useMockNow(10_000);
  const pill = BATTERY_STATUS_PILL[tracking.status];

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="mb-3 flex items-baseline justify-between gap-2">
          <h2 className="text-base font-semibold text-ink">Battery tracking</h2>
          <span className="text-xs text-ink-muted">Simulated live data</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-ink-muted">{tracking.batteryLabel}</p>
          <div aria-live="polite">
            <StatusPill tone={pill.tone} label={pill.label} />
          </div>
        </div>

        <p className="mt-2 text-3xl font-semibold tabular-nums text-ink">
          {formatPercent(tracking.chargePercent)}
          <span className="ml-2 text-sm font-normal text-ink-muted">charge</span>
        </p>
        <BatteryMeter label="Charge" value={tracking.chargePercent} />

        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-2 text-sm">
            <span className="text-ink">Health</span>
            <span className="tabular-nums text-ink-muted">{formatPercent(tracking.healthPercent)}</span>
          </div>
          <BatteryMeter label="Health" value={tracking.healthPercent} size="sm" />
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <div>
            <dt className="text-ink-muted">Estimated range</dt>
            <dd className="tabular-nums text-ink">{formatDistance(tracking.estimatedRangeKm)}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Distance</dt>
            <dd className="tabular-nums text-ink">{formatDistance(tracking.distanceKm)}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Kiosk</dt>
            <dd className="text-ink">{tracking.kioskName}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Updated</dt>
            <dd className="text-ink">{formatRelative(new Date(updatedAtMs).toISOString(), now)}</dd>
          </div>
        </dl>

        <div className="mt-4">
          <TrackingMap
            lat={tracking.lat}
            lng={tracking.lng}
            locationLabel={tracking.locationLabel}
            distanceKm={tracking.distanceKm}
          />
        </div>

        <Link
          href={`/batteries?battery=${tracking.batteryId}&sheet=details`}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-md border border-line bg-surface px-4 text-sm font-medium text-ink hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          View battery details
        </Link>
      </Card>

      <Card>
        <div className="mb-3 flex items-baseline justify-between gap-2">
          <h2 className="text-base font-semibold text-ink">Usage</h2>
          <span className="text-xs text-ink-muted">Demo data</span>
        </div>
        <UsageChart days={tracking.usageLast7Days} />
      </Card>

      <Card aria-labelledby="maintenance-title">
        <div className="mb-3 flex items-baseline justify-between gap-2">
          <h2 id="maintenance-title" className="text-base font-semibold text-ink">
            Maintenance
          </h2>
          <span className="text-xs text-ink-muted">Demo data</span>
        </div>
        {tracking.alerts.length === 0 ? (
          <EmptyState title="No maintenance alerts" description="This battery is reporting normally." />
        ) : (
          <ul className="flex flex-col gap-3">
            {tracking.alerts.map((alert) => (
              <li key={alert.id} className="rounded-md bg-surface-muted p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-ink">{alert.title}</p>
                  <StatusPill tone={ALERT_TONE[alert.severity]} label={ALERT_LABEL[alert.severity]} />
                </div>
                <p className="mt-1 text-sm text-ink-muted">{alert.body}</p>
                {alert.dueAt && <p className="mt-1 text-xs text-ink-muted">Due {formatDateTime(alert.dueAt)}</p>}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <p className="text-center text-xs text-ink-muted">
        Demo data. Location and telemetry are simulated and reset when you reload the page.
      </p>
    </div>
  );
}

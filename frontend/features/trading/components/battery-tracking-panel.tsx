"use client";

import Link from "next/link";
import { BatteryMeter } from "@/components/ui/battery-meter";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { BatteryIcon } from "@/components/ui/icons";
import { StatusPill, type StatusTone } from "@/components/ui/status-pill";
import { formatDateTime, formatDistance, formatPercent, formatRelative } from "@/lib/format";
import { useMockNow } from "@/lib/mock/use-mock-now";
import { BATTERY_STATUS_PILL, batteryCondition } from "@/lib/status";
import { useBatteryTracking } from "../hooks/use-battery-tracking";
import type { BatteryTracking, MaintenanceSeverity } from "../types";

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
  info: "OK",
  success: "Passed",
  warning: "Do this soon",
  danger: "Urgent",
};

export function BatteryTrackingPanel({ tracking, empty }: BatteryTrackingPanelProps) {
  if (!tracking || empty) {
    return (
      <Card>
        <EmptyState
          icon={<BatteryIcon className="size-8" />}
          title="No battery yet"
          description="Lease a battery and you can check it here."
          action={
            <Link
              href="/batteries"
              className="inline-flex h-14 items-center rounded-md bg-primary px-4 text-base font-semibold text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
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

// Values update on a demo timer (hooks/use-battery-tracking.ts). The GPS
// preview, coordinates and usage chart were removed to keep this to what a
// rider checks: charge, how far it goes, where it is, and anything to fix.
function LiveTracking({ initial }: { initial: BatteryTracking }) {
  const { tracking, updatedAtMs } = useBatteryTracking(initial);
  const now = useMockNow(10_000);
  const pill = BATTERY_STATUS_PILL[tracking.status];

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink">{tracking.batteryLabel}</h2>
          <div aria-live="polite">
            <StatusPill tone={pill.tone} label={pill.label} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="flex items-baseline gap-2">
            <span className="text-4xl font-semibold tabular-nums text-ink">{formatPercent(tracking.chargePercent)}</span>
            <span className="text-lg text-ink-muted">charged</span>
          </p>
          <BatteryMeter label="Charge" value={tracking.chargePercent} />
        </div>

        <dl className="flex flex-col divide-y divide-line rounded-lg border border-line text-base">
          <Fact label="You can drive about" value={formatDistance(tracking.estimatedRangeKm)} />
          <Fact label="Where" value={`${tracking.kioskName}, ${formatDistance(tracking.distanceKm)} away`} />
          <Fact label="Battery condition" value={batteryCondition(tracking.healthPercent)} />
        </dl>

        <p className="text-sm text-ink-muted">Updated {formatRelative(new Date(updatedAtMs).toISOString(), now)}</p>
      </Card>

      <Card aria-labelledby="care-title">
        <h2 id="care-title" className="mb-3 text-lg font-semibold text-ink">
          Battery care
        </h2>
        {tracking.alerts.length === 0 ? (
          <EmptyState title="Nothing to do" description="Your battery is working normally." />
        ) : (
          <ul className="flex flex-col gap-3">
            {tracking.alerts.map((alert) => (
              <li key={alert.id} className="flex flex-col gap-1 rounded-md bg-surface-muted p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-base font-semibold text-ink">{alert.title}</p>
                  <StatusPill tone={ALERT_TONE[alert.severity]} label={ALERT_LABEL[alert.severity]} />
                </div>
                <p className="text-base text-ink-muted">{alert.body}</p>
                {alert.dueAt && <p className="text-sm text-ink-muted">By {formatDateTime(alert.dueAt)}</p>}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <dt className="shrink-0 text-ink-muted">{label}</dt>
      <dd className="text-right font-semibold text-ink">{value}</dd>
    </div>
  );
}

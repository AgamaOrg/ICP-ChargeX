import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeftIcon } from "@/components/ui/icons";
import { StatusPill } from "@/components/ui/status-pill";
import { clampPercent, formatDateTime, formatMoney, formatPercent, formatRelative } from "@/lib/format";
import { LEASE_STATUS_PILL } from "@/lib/status";
import type { Lease } from "@/lib/types/lease";
import type { DurationOption } from "../../types";
import { LeaseActions } from "./lease-actions";

type LeaseDetailProps = {
  lease: Lease;
  nowMs: number;
  extendOptions: DurationOption[];
  issueTypes: readonly string[];
  onBack: () => void;
};

export function LeaseDetail({ lease, nowMs, extendOptions, issueTypes, onBack }: LeaseDetailProps) {
  const pill = LEASE_STATUS_PILL[lease.status];
  const start = Date.parse(lease.startedAt);
  const end = Date.parse(lease.endsAt);
  const elapsed = lease.status === "completed" ? 100 : clampPercent(((nowMs - start) / (end - start)) * 100);

  return (
    <div className="flex flex-col gap-4">
      <Button variant="ghost" onClick={onBack} className="self-start">
        <ChevronLeftIcon className="size-4" />
        All leases
      </Button>

      <Card as="article" aria-labelledby="lease-detail-title" className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 id="lease-detail-title" className="text-xl font-semibold text-ink">
              {lease.batteryLabel}
            </h2>
            <p className="text-sm text-ink-muted">{lease.kioskName}</p>
          </div>
          <StatusPill tone={pill.tone} label={pill.label} />
        </div>

        <p className="text-3xl font-semibold tabular-nums text-ink">{formatMoney(lease.costMinorUnits)}</p>

        <section aria-label="Timeline" className="flex flex-col gap-2">
          <div
            role="meter"
            aria-label="Lease time used"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(elapsed)}
            aria-valuetext={`${formatPercent(elapsed)} of the lease time used`}
            className="h-2 overflow-hidden rounded-full bg-surface-muted"
          >
            {/* Inline style: progress width is a runtime value. */}
            <div
              className={`h-full rounded-full ${lease.status === "overdue" ? "bg-danger" : "bg-primary"}`}
              style={{ width: `${elapsed}%` }}
            />
          </div>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <dt className="text-ink-muted">Started</dt>
              <dd className="text-ink">{formatDateTime(lease.startedAt)}</dd>
            </div>
            <div className="text-right">
              <dt className="text-ink-muted">{lease.status === "completed" ? "Returned" : "Ends"}</dt>
              <dd className="text-ink">{formatDateTime(lease.endsAt)}</dd>
            </div>
          </dl>
          {lease.status !== "completed" && (
            <p className="text-sm text-ink">
              {lease.status === "overdue"
                ? `Was due back ${formatRelative(lease.endsAt, nowMs)}.`
                : `Ends ${formatRelative(lease.endsAt, nowMs)}.`}
            </p>
          )}
        </section>

        {lease.status === "overdue" && (
          <p className="rounded-md bg-danger-soft p-3 text-sm text-danger">
            <span aria-hidden="true">■ </span>
            This lease has ended. Return the battery to any kiosk when you can. Extra time is charged at{" "}
            {formatMoney(lease.pricePerHourMinorUnits)} per hour until it&apos;s back.
          </p>
        )}

        <LeaseActions lease={lease} nowMs={nowMs} extendOptions={extendOptions} issueTypes={issueTypes} />

        <p className="text-xs text-ink-muted">
          Need help with something else? Report an issue and we&apos;ll follow up. Demo data.
        </p>
      </Card>
    </div>
  );
}

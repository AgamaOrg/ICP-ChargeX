import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeftIcon } from "@/components/ui/icons";
import { StatusPill } from "@/components/ui/status-pill";
import { formatDateTime, formatMoney, formatRelative } from "@/lib/format";
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

// Built around one question, "when does it go back?", with the date as the
// big line. Lease data is mock and in memory (data/lease-store.ts).
export function LeaseDetail({ lease, nowMs, extendOptions, issueTypes, onBack }: LeaseDetailProps) {
  const pill = LEASE_STATUS_PILL[lease.status];
  const when = formatRelative(lease.endsAt, nowMs);
  const headline =
    lease.status === "completed"
      ? `Returned ${when}`
      : lease.status === "overdue"
        ? `Was due ${when}`
        : `Bring back ${when}`;

  return (
    <div className="flex flex-col gap-4">
      <Button variant="ghost" onClick={onBack} className="self-start">
        <ChevronLeftIcon className="size-5" />
        Back
      </Button>

      <Card as="article" aria-labelledby="lease-detail-title" className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 id="lease-detail-title" className="text-xl font-semibold text-ink">
              {lease.batteryLabel}
            </h2>
            <p className="text-base text-ink-muted">{lease.kioskName}</p>
          </div>
          <StatusPill tone={pill.tone} label={pill.label} />
        </div>

        <div>
          <p className={`text-2xl font-semibold ${lease.status === "overdue" ? "text-danger" : "text-ink"}`}>
            {headline}
          </p>
          <p className="text-base text-ink-muted">{formatDateTime(lease.endsAt)}</p>
        </div>

        {lease.status === "overdue" && (
          <p className="rounded-md bg-danger-soft p-4 text-base text-danger">
            <span aria-hidden="true">■ </span>
            Please bring it to any kiosk. Extra time costs {formatMoney(lease.pricePerHourMinorUnits)} per hour.
          </p>
        )}

        <p className="flex justify-between border-t border-line pt-4 text-base">
          <span className="text-ink-muted">Cost</span>
          <span className="font-semibold tabular-nums text-ink">{formatMoney(lease.costMinorUnits)}</span>
        </p>

        <LeaseActions lease={lease} nowMs={nowMs} extendOptions={extendOptions} issueTypes={issueTypes} />
      </Card>
    </div>
  );
}

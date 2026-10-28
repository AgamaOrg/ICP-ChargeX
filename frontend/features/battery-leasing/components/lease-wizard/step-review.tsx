import { formatMoney } from "@/lib/format";
import type { Battery } from "@/lib/types/battery";
import type { DurationOption, LeaseDraft, StartOption } from "../../types";

type StepReviewProps = {
  battery: Battery;
  draft: LeaseDraft;
  duration: DurationOption;
  start: StartOption;
  totalMinorUnits: number;
};

export function StepReview({ battery, draft, duration, start, totalMinorUnits }: StepReviewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-ink-muted">Total</p>
        <p className="text-3xl font-semibold tabular-nums text-ink">{formatMoney(totalMinorUnits)}</p>
        <p className="text-sm text-ink-muted">
          {duration.label} at {formatMoney(battery.pricePerHourMinorUnits)} / hour
        </p>
      </div>

      <dl className="flex flex-col divide-y divide-line rounded-md border border-line text-sm">
        {[
          ["Battery", battery.label],
          ["Pick up", `${battery.kioskName}, ${battery.location.label}`],
          ["Duration", duration.label],
          ["Starts", start.label],
          ["Picked up by", `${draft.contactName} · ${draft.contactPhone}`],
        ].map(([term, value]) => (
          <div key={term} className="flex justify-between gap-4 px-3 py-3">
            <dt className="shrink-0 text-ink-muted">{term}</dt>
            <dd className="text-right text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <p className="text-sm text-ink-muted">
        Return the battery by the end of your lease. Extra time is charged at the hourly rate. This is a demo,
        so no lease is actually created with a kiosk.
      </p>
    </div>
  );
}

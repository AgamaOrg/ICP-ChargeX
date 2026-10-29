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

// Nothing is created here; the payment step carries the demo-only notice.
export function StepReview({ battery, draft, duration, totalMinorUnits }: StepReviewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-base text-ink-muted">You will pay</p>
        <p className="text-4xl font-semibold tabular-nums text-ink">{formatMoney(totalMinorUnits)}</p>
        <p className="text-base text-ink-muted">for {duration.label}</p>
      </div>

      <dl className="flex flex-col divide-y divide-line rounded-lg border border-line text-base">
        {[
          ["Pick up at", battery.kioskName],
          ["How long", duration.label],
          ["Name", draft.contactName],
          ["Mobile", draft.contactPhone],
        ].map(([term, value]) => (
          <div key={term} className="flex justify-between gap-4 px-4 py-3">
            <dt className="shrink-0 text-ink-muted">{term}</dt>
            <dd className="text-right font-medium text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <p className="text-base text-ink-muted">
        Bring it back on time. Extra time costs {formatMoney(battery.pricePerHourMinorUnits)} per hour.
      </p>
    </div>
  );
}

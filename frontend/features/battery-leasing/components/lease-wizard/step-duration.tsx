import { formatMoney } from "@/lib/format";
import type { DurationId, DurationOption } from "../../types";

type StepDurationProps = {
  pricePerHourMinorUnits: number;
  durationOptions: DurationOption[];
  durationId: DurationId | null;
  error?: string;
  onDuration: (id: DurationId) => void;
};

// Leases start now; the start-time choice was dropped to keep this step to a
// single question. The draft still carries `startId: "now"`.
export function StepDuration({ pricePerHourMinorUnits, durationOptions, durationId, error, onDuration }: StepDurationProps) {
  return (
    <fieldset aria-describedby={error ? "duration-error" : undefined} className="flex flex-col gap-3">
      <legend className="sr-only">How long do you need it?</legend>
      {durationOptions.map((option) => {
        const checked = option.id === durationId;
        return (
          <label
            key={option.id}
            className={`flex min-h-16 cursor-pointer items-center gap-4 rounded-lg border-2 px-4 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus ${checked ? "border-primary bg-primary-soft" : "border-line bg-surface"}`}
          >
            <input
              type="radio"
              name="duration"
              value={option.id}
              checked={checked}
              onChange={() => onDuration(option.id)}
              className="size-6 accent-primary"
            />
            <span className="flex-1 text-lg font-medium text-ink">{option.label}</span>
            <span className="text-lg font-semibold tabular-nums text-ink">
              {formatMoney(pricePerHourMinorUnits * option.hours)}
            </span>
          </label>
        );
      })}
      {error && (
        <p id="duration-error" className="text-base text-danger">
          <span aria-hidden="true">⚠ </span>
          {error}
        </p>
      )}
    </fieldset>
  );
}

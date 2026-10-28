import { formatMoney } from "@/lib/format";
import type { DurationId, DurationOption, StartId, StartOption } from "../../types";

type StepDurationProps = {
  pricePerHourMinorUnits: number;
  durationOptions: DurationOption[];
  startOptions: StartOption[];
  durationId: DurationId | null;
  startId: StartId;
  error?: string;
  onDuration: (id: DurationId) => void;
  onStart: (id: StartId) => void;
};

export function StepDuration({
  pricePerHourMinorUnits,
  durationOptions,
  startOptions,
  durationId,
  startId,
  error,
  onDuration,
  onStart,
}: StepDurationProps) {
  return (
    <div className="flex flex-col gap-6">
      <fieldset aria-describedby={error ? "duration-error" : undefined} className="flex flex-col gap-2">
        <legend className="mb-2 text-base font-semibold text-ink">How long do you need it?</legend>
        {durationOptions.map((option) => {
          const checked = option.id === durationId;
          return (
            <label
              key={option.id}
              className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-md border px-4 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus ${checked ? "border-primary bg-primary-soft" : "border-line bg-surface"}`}
            >
              <input
                type="radio"
                name="duration"
                value={option.id}
                checked={checked}
                onChange={() => onDuration(option.id)}
                className="size-5 accent-primary"
              />
              <span className="flex-1 text-base text-ink">{option.label}</span>
              <span className="tabular-nums text-sm text-ink-muted">
                {formatMoney(pricePerHourMinorUnits * option.hours)}
              </span>
            </label>
          );
        })}
        {error && (
          <p id="duration-error" className="text-xs text-danger">
            <span aria-hidden="true">⚠ </span>
            {error}
          </p>
        )}
      </fieldset>

      <div className="flex flex-col gap-1">
        <label htmlFor="start-time" className="text-sm font-medium text-ink">
          Start time
        </label>
        <select
          id="start-time"
          value={startId}
          onChange={(event) => onStart(event.target.value as StartId)}
          className="h-12 rounded-sm border border-line bg-surface px-3 text-base text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          {startOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

import { clampPercent, formatPercent } from "@/lib/format";

type BatteryMeterProps = {
  label: string;
  value: number;
  /** Visual size; the bar always spans the container width. */
  size?: "sm" | "md";
};

export function BatteryMeter({ label, value, size = "md" }: BatteryMeterProps) {
  const percent = clampPercent(value);
  const fill = percent <= 20 ? "bg-warning" : "bg-linear-to-r from-primary to-brand-green";
  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percent)}
      aria-valuetext={formatPercent(percent)}
      className={`w-full overflow-hidden rounded-full bg-surface-muted ${size === "sm" ? "h-1.5" : "h-3"}`}
    >
      {/* Inline style: the width is a runtime value Tailwind cannot express. */}
      <div
        className={`h-full rounded-full transition-[width] duration-200 ease-out ${fill}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

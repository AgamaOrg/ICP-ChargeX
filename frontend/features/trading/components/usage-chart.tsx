import { formatEnergy, formatNumber, formatWeekday } from "@/lib/format";
import type { UsageDay } from "../types";

type UsageChartProps = {
  days: UsageDay[];
};

export function UsageChart({ days }: UsageChartProps) {
  const max = Math.max(...days.map((day) => day.kwh), 0.1);
  const total = days.reduce((sum, day) => sum + day.kwh, 0);

  return (
    <figure>
      <figcaption className="mb-2 flex items-baseline justify-between gap-2">
        <span className="text-sm text-ink-muted">Energy used, last 7 days</span>
        <span className="text-sm font-medium tabular-nums text-ink">{formatEnergy(total)}</span>
      </figcaption>
      <div aria-hidden="true" className="flex h-24 items-end gap-2">
        {days.map((day) => (
          <div key={day.dateIso} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
            {/* Inline style: bar height is a runtime value. */}
            <div
              className="w-full rounded-sm bg-linear-to-t from-primary to-brand-green"
              style={{ height: `${Math.max(4, (day.kwh / max) * 100)}%` }}
            />
            <span className="text-[0.7rem] text-ink-muted">{formatWeekday(day.dateIso)}</span>
          </div>
        ))}
      </div>
      <table className="sr-only">
        <caption>Energy used per day, last 7 days</caption>
        <tbody>
          {days.map((day) => (
            <tr key={day.dateIso}>
              <th scope="row">{formatWeekday(day.dateIso)}</th>
              <td>{formatNumber(day.kwh)} kWh</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

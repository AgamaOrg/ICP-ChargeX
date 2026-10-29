import { Button } from "@/components/ui/button";
import { formatDistance, formatMoney, formatPercent } from "@/lib/format";
import type { Battery } from "@/lib/types/battery";

type SelectedBatteryCardProps = {
  battery: Battery;
  onViewDetails: () => void;
};

export function SelectedBatteryCard({ battery, onViewDetails }: SelectedBatteryCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-surface p-4 shadow-sheet">
      <div className="flex items-baseline justify-between gap-3">
        <p className="min-w-0 truncate text-lg font-semibold text-ink">{battery.kioskName}</p>
        <p className="shrink-0 text-lg font-semibold tabular-nums text-ink">{formatPercent(battery.chargePercent)}</p>
      </div>
      <p className="text-base text-ink-muted">
        {formatDistance(battery.distanceKm)} away · {formatMoney(battery.pricePerHourMinorUnits)} per hour
      </p>
      <Button onClick={onViewDetails}>See this battery</Button>
    </div>
  );
}

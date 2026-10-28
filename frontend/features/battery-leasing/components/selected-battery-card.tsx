import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { formatDistance, formatPercent } from "@/lib/format";
import { AVAILABILITY_PILL } from "@/lib/status";
import type { Battery } from "@/lib/types/battery";

type SelectedBatteryCardProps = {
  battery: Battery;
  onViewDetails: () => void;
};

export function SelectedBatteryCard({ battery, onViewDetails }: SelectedBatteryCardProps) {
  const pill = AVAILABILITY_PILL[battery.availability];
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-surface p-4 shadow-sheet">
      <div className="flex items-center justify-between gap-2">
        <p className="text-base font-semibold text-ink">{battery.label}</p>
        <StatusPill tone={pill.tone} label={pill.label} />
      </div>
      <p className="truncate text-sm text-ink-muted">
        {formatDistance(battery.distanceKm)} · {battery.kioskName} · {formatPercent(battery.chargePercent)} charge
      </p>
      <Button onClick={onViewDetails}>View details</Button>
    </div>
  );
}

import { BatteryIcon } from "@/components/ui/icons";
import { ListRow } from "@/components/ui/list-row";
import { formatDistance, formatPercent } from "@/lib/format";
import type { Battery } from "@/lib/types/battery";

type BatteryListProps = {
  batteries: Battery[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

// Riders look for a place and a full battery, so the kiosk leads and the
// charge is the big number. The battery code lives in the details sheet.
export function BatteryList({ batteries, selectedId, onSelect }: BatteryListProps) {
  return (
    <ul aria-label="Batteries near you" className="flex flex-col gap-2">
      {batteries.map((battery) => (
        <li key={battery.id} className="rounded-lg bg-surface shadow-card">
          <ListRow
            onClick={() => onSelect(battery.id)}
            selected={battery.id === selectedId}
            leading={<BatteryIcon className="size-7 text-primary" />}
            title={battery.kioskName}
            subtitle={`${formatDistance(battery.distanceKm)} away`}
            trailing={
              <span className="flex flex-col items-end leading-tight">
                <span className="text-xl font-semibold tabular-nums text-ink">{formatPercent(battery.chargePercent)}</span>
                <span className="text-sm text-ink-muted">charged</span>
              </span>
            }
          />
        </li>
      ))}
    </ul>
  );
}

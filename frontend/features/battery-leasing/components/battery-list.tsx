import { BatteryIcon } from "@/components/ui/icons";
import { ListRow } from "@/components/ui/list-row";
import { StatusPill } from "@/components/ui/status-pill";
import { formatDistance, formatPercent } from "@/lib/format";
import { AVAILABILITY_PILL } from "@/lib/status";
import type { Battery } from "@/lib/types/battery";

type BatteryListProps = {
  batteries: Battery[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function BatteryList({ batteries, selectedId, onSelect }: BatteryListProps) {
  return (
    <ul aria-label="Batteries near you" className="flex flex-col">
      {batteries.map((battery) => {
        const pill = AVAILABILITY_PILL[battery.availability];
        return (
          <li key={battery.id}>
            <ListRow
              onClick={() => onSelect(battery.id)}
              selected={battery.id === selectedId}
              leading={<BatteryIcon />}
              title={battery.label}
              subtitle={`${formatDistance(battery.distanceKm)} · ${battery.kioskName}`}
              trailing={
                <>
                  <StatusPill tone={pill.tone} label={pill.label} />
                  <span className="tabular-nums text-ink-muted">{formatPercent(battery.chargePercent)} charge</span>
                </>
              }
            />
          </li>
        );
      })}
    </ul>
  );
}

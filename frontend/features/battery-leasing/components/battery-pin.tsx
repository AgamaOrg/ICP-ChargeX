import { MapPinIcon } from "@/components/ui/icons";
import { formatDistance } from "@/lib/format";
import { AVAILABILITY_PILL } from "@/lib/status";
import type { Battery } from "@/lib/types/battery";

type BatteryPinProps = {
  battery: Battery;
  selected: boolean;
  onSelect: (id: string) => void;
};

const PIN_COLOR = {
  available: "text-success",
  leased: "text-ink-muted",
  maintenance: "text-danger",
} as const;

// Rendered inside a map marker anchored at its bottom edge. The white disc
// keeps the pin readable on every basemap, including dark and satellite.
export function BatteryPin({ battery, selected, onSelect }: BatteryPinProps) {
  const availability = AVAILABILITY_PILL[battery.availability].label;
  return (
    <button
      type="button"
      onClick={() => onSelect(battery.id)}
      aria-pressed={selected}
      aria-label={`${battery.label}, ${availability}, ${formatDistance(battery.distanceKm)} away`}
      className={`relative flex size-11 items-center justify-center rounded-full bg-surface shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${selected ? "ring-2 ring-primary" : ""}`}
    >
      <MapPinIcon className={`size-6 ${PIN_COLOR[battery.availability]} ${selected ? "fill-primary-soft" : ""}`} />
      {selected && (
        <span className="absolute top-full left-1/2 mt-1 -translate-x-1/2 rounded-sm bg-surface px-1.5 py-0.5 text-[0.7rem] font-medium whitespace-nowrap text-ink shadow-card">
          {battery.label} · {availability}
        </span>
      )}
    </button>
  );
}

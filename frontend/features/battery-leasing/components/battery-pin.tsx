import { MapPinIcon } from "@/components/ui/icons";
import { formatDistance } from "@/lib/format";
import { AVAILABILITY_PILL } from "@/lib/status";
import type { Battery } from "@/lib/types/battery";

type BatteryPinProps = {
  battery: Battery;
  selected: boolean;
  /** Position inside the map area, in percent. */
  x: number;
  y: number;
  onSelect: (id: string) => void;
};

const PIN_COLOR = {
  available: "text-success",
  leased: "text-ink-muted",
  maintenance: "text-danger",
} as const;

export function BatteryPin({ battery, selected, x, y, onSelect }: BatteryPinProps) {
  const availability = AVAILABILITY_PILL[battery.availability].label;
  return (
    <button
      type="button"
      onClick={() => onSelect(battery.id)}
      aria-pressed={selected}
      aria-label={`${battery.label}, ${availability}, ${formatDistance(battery.distanceKm)} away`}
      // Inline style: pin coordinates are runtime values.
      style={{ left: `${x}%`, top: `${y}%` }}
      className={`absolute flex size-11 -translate-x-1/2 -translate-y-full items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${selected ? "z-10 bg-surface shadow-card" : ""}`}
    >
      <MapPinIcon className={`size-7 ${PIN_COLOR[battery.availability]} ${selected ? "fill-primary-soft" : ""}`} />
      {selected && (
        <span className="absolute top-full mt-0.5 rounded-sm bg-surface px-1.5 py-0.5 text-[0.7rem] font-medium whitespace-nowrap text-ink shadow-card">
          {battery.label} · {availability}
        </span>
      )}
    </button>
  );
}

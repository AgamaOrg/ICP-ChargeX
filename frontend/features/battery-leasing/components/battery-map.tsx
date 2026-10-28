import type { Battery } from "@/lib/types/battery";
import { BatteryPin } from "./battery-pin";

type BatteryMapProps = {
  batteries: Battery[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

// Keeps pins away from the edges of the map area.
const PADDING = 12;

/**
 * Placeholder map: no map provider is approved yet (roadmap 2.1), so pins are
 * placed by scaling their coordinates into a fixed box. The list view is
 * always available as the accessible, complete alternative.
 */
export function BatteryMap({ batteries, selectedId, onSelect }: BatteryMapProps) {
  const lats = batteries.map((b) => b.location.lat);
  const lngs = batteries.map((b) => b.location.lng);
  const [minLat, maxLat] = [Math.min(...lats), Math.max(...lats)];
  const [minLng, maxLng] = [Math.min(...lngs), Math.max(...lngs)];
  const scale = (value: number, min: number, max: number) =>
    max === min ? 50 : PADDING + ((value - min) / (max - min)) * (100 - PADDING * 2);

  return (
    <div className="flex flex-col gap-2">
      <div
        role="group"
        aria-label="Map preview of batteries"
        className="relative h-72 overflow-hidden rounded-lg border border-line bg-surface-muted"
      >
        {batteries.map((battery) => (
          <BatteryPin
            key={battery.id}
            battery={battery}
            selected={battery.id === selectedId}
            x={scale(battery.location.lng, minLng, maxLng)}
            // Latitude grows northwards; screen y grows downwards.
            y={100 - scale(battery.location.lat, minLat, maxLat)}
            onSelect={onSelect}
          />
        ))}
      </div>
      <p className="text-xs text-ink-muted">
        Map preview. A map provider hasn&apos;t been chosen yet, so pin positions are approximate. Use the list
        for full details.
      </p>
    </div>
  );
}

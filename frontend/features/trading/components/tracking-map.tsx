import { MapPinIcon } from "@/components/ui/icons";
import { formatDistance } from "@/lib/format";

type TrackingMapProps = {
  lat: number;
  lng: number;
  locationLabel: string;
  distanceKm: number;
};

/**
 * Placeholder map: no map provider is approved yet, so this shows a fixed
 * radar-style preview while the coordinates update. The location text below
 * is the accessible source of truth.
 */
export function TrackingMap({ lat, lng, locationLabel, distanceKm }: TrackingMapProps) {
  return (
    <div className="flex flex-col gap-2">
      <div
        aria-hidden="true"
        className="relative h-52 overflow-hidden rounded-lg border border-line bg-surface-muted"
      >
        <div className="absolute inset-x-0 top-1/3 h-px bg-line" />
        <div className="absolute inset-x-0 top-2/3 h-px bg-line" />
        <div className="absolute inset-y-0 left-1/3 w-px bg-line" />
        <div className="absolute inset-y-0 left-2/3 w-px bg-line" />
        <div className="absolute top-1/2 left-1/2 size-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line" />
        <div className="absolute top-1/2 left-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line" />
        <div className="absolute top-1/2 left-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line" />
        <div className="absolute top-1/2 left-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-surface shadow-card">
          <MapPinIcon className="size-6 text-primary" />
        </div>
        <span className="absolute bottom-2 left-2 rounded-sm bg-surface px-2 py-1 text-xs text-ink-muted shadow-card">
          Simulated GPS
        </span>
      </div>
      <div className="flex items-start justify-between gap-3 text-sm">
        <p className="text-ink">{locationLabel}</p>
        <p className="shrink-0 text-ink-muted">{formatDistance(distanceKm)} away</p>
      </div>
      <p className="tabular-nums text-xs text-ink-muted">
        {lat.toFixed(5)}, {lng.toFixed(5)}
      </p>
    </div>
  );
}

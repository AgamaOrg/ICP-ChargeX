"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Map, MapMarker, MarkerContent, useMap } from "@/components/ui/map";
import type { Battery } from "@/lib/types/battery";
import { MAP_STYLE_IDS, MAP_STYLES, type MapStyleId } from "@/lib/map-styles";
import { BatteryPin } from "./battery-pin";
import { MapErrorBoundary } from "@/components/ui/map-error-boundary";

type BatteryMapProps = {
  batteries: Battery[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  styleId: MapStyleId;
  onStyleChange: (id: MapStyleId) => void;
  /** Switches the finder to the list when the map cannot load. */
  onShowList: () => void;
};

// Makati, roughly the middle of the demo kiosks; used when there are no pins.
const FALLBACK_CENTER: [number, number] = [121.03, 14.56];

/**
 * Battery map built on mapcn (MapLibre). The list view stays the complete,
 * accessible alternative; the map only adds a spatial overview.
 */
export function BatteryMap({ batteries, selectedId, onSelect, styleId, onStyleChange, onShowList }: BatteryMapProps) {
  const style = MAP_STYLES[styleId].style;

  return (
    <div className="flex flex-col gap-2">
      <div className="relative h-80 overflow-hidden rounded-lg border border-line bg-surface-muted">
        <MapErrorBoundary fallback={<MapUnavailable onShowList={onShowList} />}>
          <Map
            // Same style for both themes: the picker, not the OS theme, decides.
            theme="light"
            styles={{ light: style, dark: style }}
            center={FALLBACK_CENTER}
            zoom={12}
            bounds={boundsOf(batteries)}
            // Extra top and right room so pins clear the style picker and zoom buttons.
            fitBoundsOptions={{ padding: { top: 80, right: 72, bottom: 48, left: 40 }, maxZoom: 15 }}
            // Page scrolling keeps working; panning needs two fingers or Ctrl.
            cooperativeGestures
          >
            {batteries.map((battery) => {
              const selected = battery.id === selectedId;
              return (
                <MapMarker
                  // Remounting the selected marker appends it last, so its
                  // label draws above neighbouring pins.
                  key={selected ? `${battery.id}-selected` : battery.id}
                  longitude={battery.location.lng}
                  latitude={battery.location.lat}
                  anchor="bottom"
                >
                  <MarkerContent>
                    <BatteryPin battery={battery} selected={selected} onSelect={onSelect} />
                  </MarkerContent>
                </MapMarker>
              );
            })}
            <FollowSelection battery={batteries.find((b) => b.id === selectedId) ?? null} />
            <ZoomControls />
          </Map>
          <MapStylePicker value={styleId} onChange={onStyleChange} />
        </MapErrorBoundary>
      </div>
      <p className="text-sm text-ink-muted">
        Tap a pin to see that battery.
      </p>
    </div>
  );
}

function boundsOf(batteries: Battery[]): [[number, number], [number, number]] | undefined {
  if (batteries.length === 0) return undefined;
  const lngs = batteries.map((b) => b.location.lng);
  const lats = batteries.map((b) => b.location.lat);
  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ];
}

// Pans to a battery picked from the list or a pin. MapLibre skips the
// animation when the user prefers reduced motion.
function FollowSelection({ battery }: { battery: Battery | null }) {
  const { map, isLoaded } = useMap();
  const lng = battery?.location.lng;
  const lat = battery?.location.lat;

  useEffect(() => {
    if (!map || !isLoaded || lng === undefined || lat === undefined) return;
    map.easeTo({ center: [lng, lat], duration: 400 });
  }, [map, isLoaded, lng, lat]);

  return null;
}

// Own zoom buttons instead of mapcn's MapControls: those are 32px, below the
// 44px touch target in rules.md.
function ZoomControls() {
  const { map } = useMap();
  const buttonClass =
    "flex size-11 items-center justify-center text-lg font-medium text-ink hover:bg-surface-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus";

  return (
    <div className="absolute top-2 right-2 z-10 flex flex-col divide-y divide-line overflow-hidden rounded-md border border-line bg-surface shadow-card">
      <button type="button" aria-label="Zoom in" onClick={() => map?.zoomIn()} className={buttonClass}>
        <span aria-hidden="true">+</span>
      </button>
      <button type="button" aria-label="Zoom out" onClick={() => map?.zoomOut()} className={buttonClass}>
        <span aria-hidden="true">−</span>
      </button>
    </div>
  );
}

type MapStylePickerProps = {
  value: MapStyleId;
  onChange: (id: MapStyleId) => void;
};

// Native radios: arrow keys move between styles, and the group is announced.
function MapStylePicker({ value, onChange }: MapStylePickerProps) {
  return (
    <fieldset className="absolute top-2 left-2 z-10 flex rounded-md border border-line bg-surface p-0.5 shadow-card">
      <legend className="sr-only">Map style</legend>
      {MAP_STYLE_IDS.map((id) => (
        <label
          key={id}
          className={`flex min-h-11 cursor-pointer items-center rounded-sm px-3 text-sm font-medium has-focus-visible:outline-2 has-focus-visible:outline-offset-1 has-focus-visible:outline-focus ${value === id ? "bg-primary text-primary-foreground" : "text-ink-muted hover:text-ink"}`}
        >
          <input
            type="radio"
            name="map-style"
            value={id}
            checked={value === id}
            onChange={() => onChange(id)}
            className="sr-only"
          />
          {MAP_STYLES[id].label}
        </label>
      ))}
    </fieldset>
  );
}

function MapUnavailable({ onShowList }: { onShowList: () => void }) {
  return (
    <div role="alert" className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="text-sm text-ink">The map couldn&apos;t load on this device.</p>
      <p className="text-sm text-ink-muted">Every battery is still in the list.</p>
      <Button variant="secondary" onClick={onShowList}>
        Show list
      </Button>
    </div>
  );
}

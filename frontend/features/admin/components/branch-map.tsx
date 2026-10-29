"use client";

import { Map, MapMarker, MarkerContent } from "@/components/ui/map";
import { MAP_STYLES } from "@/lib/map-styles";
import type { BranchStock } from "./branch-card";

type BranchMapProps = {
  stocks: BranchStock[];
  selectedCode: string | null;
  onSelect: (code: string) => void;
};

/**
 * Branches on a mapcn map, each pin showing how many batteries are ready.
 * The list view is the complete alternative; this only adds the "where".
 */
export function BranchMap({ stocks, selectedCode, onSelect }: BranchMapProps) {
  const style = MAP_STYLES.color.style;
  const lngs = stocks.map((s) => s.branch.lng);
  const lats = stocks.map((s) => s.branch.lat);

  return (
    <div className="relative h-80 overflow-hidden rounded-lg border border-line bg-surface-muted">
      <Map
        theme="light"
        styles={{ light: style, dark: style }}
        center={[121.03, 14.56]}
        zoom={11}
        bounds={
          stocks.length > 0
            ? [
                [Math.min(...lngs), Math.min(...lats)],
                [Math.max(...lngs), Math.max(...lats)],
              ]
            : undefined
        }
        fitBoundsOptions={{ padding: { top: 48, right: 72, bottom: 56, left: 56 }, maxZoom: 14 }}
        // Page scrolling keeps working; panning needs two fingers or Ctrl.
        cooperativeGestures
      >
        {stocks.map(({ branch, batteries }) => {
          const ready = batteries.filter((b) => b.status === "ready").length;
          const selected = branch.code === selectedCode;
          return (
            <MapMarker
              // MapLibre sets the marker class only on creation, so remount on
              // selection to apply z-10 and lift it above nearby branches.
              key={selected ? `${branch.name}-selected` : branch.name}
              className={selected ? "z-10" : undefined}
              longitude={branch.lng}
              latitude={branch.lat}
              anchor="bottom"
            >
              <MarkerContent>
                <button
                  type="button"
                  onClick={() => onSelect(branch.code)}
                  aria-pressed={selected}
                  aria-label={`${branch.name}, ${ready} ready`}
                  className={`flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full px-3 text-base font-semibold whitespace-nowrap shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${selected ? "bg-primary text-primary-foreground" : "bg-surface text-ink"}`}
                >
                  {/* Letter only: full names overlap at this zoom. The label and the card below give the name. */}
                  {branch.code}
                  <span
                    className={`rounded-full px-1.5 tabular-nums ${ready === 0 ? "bg-warning-soft text-warning" : selected ? "bg-primary-foreground text-primary" : "bg-primary-soft text-primary"}`}
                  >
                    {ready}
                  </span>
                </button>
              </MarkerContent>
            </MapMarker>
          );
        })}
      </Map>
    </div>
  );
}

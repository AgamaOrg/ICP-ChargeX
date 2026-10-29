"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { ListIcon, MapIcon } from "@/components/ui/icons";
import { LoadingRegion, Skeleton } from "@/components/ui/skeleton";
import { formatDistance } from "@/lib/format";
import { useSimulatedLoad } from "@/lib/mock/use-simulated-load";
import type { Battery } from "@/lib/types/battery";
import type { FinderView, LocationPermission } from "../types";
import { BatteryDetailsSheet } from "./battery-details-sheet";
import { BatteryList } from "./battery-list";
import { isMapStyleId } from "@/lib/map-styles";
import { BatteryMap } from "./battery-map";
import { LocationStatus } from "./location-status";
import { SelectedBatteryCard } from "./selected-battery-card";

type BatteryFinderProps = {
  batteries: Battery[];
  defaultRadiusKm: number;
  wideRadiusKm: number;
  fallbackLocationLabel: string;
};

export function BatteryFinder({ batteries, defaultRadiusKm, wideRadiusKm, fallbackLocationLabel }: BatteryFinderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { state, retry } = useSimulatedLoad("We couldn't load batteries near you. Check your connection and try again.");
  const [radiusKm, setRadiusKm] = useState(defaultRadiusKm);
  const [permission, setPermission] = useState<LocationPermission>("idle");

  // URL holds the shareable state: view, map style, selected battery, open sheet.
  const view: FinderView = searchParams.get("view") === "map" ? "map" : "list";
  const mapParam = searchParams.get("map");
  const mapStyle = isMapStyleId(mapParam) ? mapParam : "color";
  const selectedId = searchParams.get("battery");
  const detailsOpen = searchParams.get("sheet") === "details" && selectedId !== null;
  const selected = batteries.find((b) => b.id === selectedId) ?? null;

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null) params.delete(key);
      else params.set(key, value);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function requestLocation() {
    if (!("geolocation" in navigator)) {
      setPermission("denied");
      return;
    }
    setPermission("requesting");
    // The position itself is not used or stored: distances are demo values.
    navigator.geolocation.getCurrentPosition(
      () => setPermission("granted"),
      () => setPermission("denied"),
      { timeout: 10_000 },
    );
  }

  const nearby =
    state.status === "ready" && !state.forceEmpty
      ? batteries
          // Only batteries a rider can take now; busy ones would just be noise.
          .filter((b) => b.availability === "available" && b.distanceKm <= radiusKm)
          .sort((a, b) => a.distanceKm - b.distanceKm)
      : [];

  return (
    <div className="flex flex-col gap-4 px-4 pb-6">
      <LocationStatus permission={permission} fallbackLabel={fallbackLocationLabel} onRequest={requestLocation} />

      <div role="group" aria-label="View" className="grid grid-cols-2 gap-1 rounded-md bg-surface-muted p-1">
        {(["list", "map"] as const).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={view === option}
            onClick={() => updateParams({ view: option === "list" ? null : option })}
            className={`flex min-h-12 items-center justify-center gap-2 rounded-sm text-base font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${view === option ? "bg-surface text-ink shadow-card" : "text-ink-muted"}`}
          >
            {option === "list" ? <ListIcon /> : <MapIcon />}
            {option === "list" ? "List" : "Map"}
          </button>
        ))}
      </div>

      {state.status === "loading" ? (
        <FinderSkeleton />
      ) : state.status === "error" ? (
        <ErrorState message={state.message} onRetry={retry} />
      ) : nearby.length === 0 ? (
        <EmptyState
          title="No batteries nearby"
          description={`No battery is free within ${formatDistance(radiusKm)} right now.`}
          action={
            radiusKm < wideRadiusKm ? (
              <Button variant="secondary" onClick={() => setRadiusKm(wideRadiusKm)}>
                Look farther
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <p className="text-base text-ink">
            {nearby.length} {nearby.length === 1 ? "battery" : "batteries"} ready to lease
          </p>
          {view === "map" ? (
            <BatteryMap
              batteries={nearby}
              selectedId={selectedId}
              onSelect={(id) => updateParams({ battery: id })}
              styleId={mapStyle}
              onStyleChange={(id) => updateParams({ map: id === "color" ? null : id })}
              onShowList={() => updateParams({ view: null })}
            />
          ) : (
            <BatteryList batteries={nearby} selectedId={selectedId} onSelect={(id) => updateParams({ battery: id })} />
          )}
          {radiusKm < wideRadiusKm && (
            <Button variant="secondary" onClick={() => setRadiusKm(wideRadiusKm)}>
              Look farther
            </Button>
          )}
        </>
      )}

      <p aria-live="polite" className="sr-only">
        {selected ? `Selected ${selected.label}, ${formatDistance(selected.distanceKm)} away at ${selected.kioskName}.` : ""}
      </p>

      {selected && state.status === "ready" && (
        <div className="sticky bottom-[calc(5rem+env(safe-area-inset-bottom))] z-20">
          <SelectedBatteryCard battery={selected} onViewDetails={() => updateParams({ sheet: "details" })} />
        </div>
      )}

      <BatteryDetailsSheet open={detailsOpen} battery={selected} onClose={() => updateParams({ sheet: null })} />
    </div>
  );
}

export function FinderSkeleton() {
  return (
    <LoadingRegion label="Loading batteries">
      <div className="flex flex-col gap-1">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="flex min-h-16 items-center gap-3 px-3 py-2">
            <Skeleton className="size-6" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    </LoadingRegion>
  );
}

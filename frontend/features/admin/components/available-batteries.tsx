"use client";

import { Button } from "@/components/ui/button";
import { MapErrorBoundary } from "@/components/ui/map-error-boundary";
import { BranchCard, type BranchStock } from "./branch-card";
import { BranchMap } from "./branch-map";

type AvailableBatteriesProps = {
  stocks: BranchStock[];
  /** Picked by the bottom nav: Batteries shows the list, Map shows the map. */
  view: "list" | "map";
  /** Branch code from `?branch=`; the first branch when unset. */
  selectedCode: string | null;
  onSelect: (code: string) => void;
  onShowList: () => void;
  onRent: (batteryId: string) => void;
};

/** Ready batteries by branch, as a list or on a map (like the rider's finder). */
export function AvailableBatteries({
  stocks,
  view,
  selectedCode,
  onSelect,
  onShowList,
  onRent,
}: AvailableBatteriesProps) {
  if (view === "list") {
    return (
      <div className="flex flex-col gap-3">
        {stocks.map((stock) => (
          <BranchCard key={stock.branch.code} stock={stock} onRent={onRent} />
        ))}
      </div>
    );
  }

  const selected = stocks.find((s) => s.branch.code === selectedCode) ?? stocks[0] ?? null;

  return (
    <div className="flex flex-col gap-3">
      <MapErrorBoundary
        fallback={
          <div role="alert" className="flex flex-col items-center gap-3 rounded-lg border border-line p-6 text-center">
            <p className="text-base text-ink">The map couldn&apos;t load on this device.</p>
            <Button variant="secondary" onClick={onShowList}>
              Show list
            </Button>
          </div>
        }
      >
        <BranchMap stocks={stocks} selectedCode={selected?.branch.code ?? null} onSelect={onSelect} />
      </MapErrorBoundary>
      <p className="text-sm text-ink-muted">Tap a branch to see its batteries.</p>
      <div aria-live="polite">{selected && <BranchCard stock={selected} onRent={onRent} />}</div>
    </div>
  );
}

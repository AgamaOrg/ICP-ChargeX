import { Button } from "@/components/ui/button";
import type { LocationPermission } from "../types";

type LocationStatusProps = {
  permission: LocationPermission;
  fallbackLabel: string;
  onRequest: () => void;
};

// Distances are demo values whichever state this is in (see data/mock.ts).
export function LocationStatus({ permission, fallbackLabel, onRequest }: LocationStatusProps) {
  return (
    <div aria-live="polite" className="flex flex-wrap items-center justify-between gap-2 text-base text-ink-muted">
      {permission === "idle" && (
        <>
          <span>Near {fallbackLabel}</span>
          <Button variant="secondary" onClick={onRequest}>
            Use my location
          </Button>
        </>
      )}
      {permission === "requesting" && <span>Finding you…</span>}
      {permission === "granted" && <span>Near you</span>}
      {permission === "denied" && <span>Location is off. Showing batteries near {fallbackLabel}.</span>}
    </div>
  );
}

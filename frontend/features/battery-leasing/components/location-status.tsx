import { Button } from "@/components/ui/button";
import type { LocationPermission } from "../types";

type LocationStatusProps = {
  permission: LocationPermission;
  fallbackLabel: string;
  onRequest: () => void;
};

export function LocationStatus({ permission, fallbackLabel, onRequest }: LocationStatusProps) {
  return (
    <div aria-live="polite" className="flex flex-wrap items-center justify-between gap-2 text-sm text-ink-muted">
      {permission === "idle" && (
        <>
          <span>Distances are from {fallbackLabel}.</span>
          <Button variant="secondary" onClick={onRequest}>
            Use my location
          </Button>
        </>
      )}
      {permission === "requesting" && <span>Asking for your location…</span>}
      {permission === "granted" && <span>Using your location. Distances are still demo values.</span>}
      {permission === "denied" && (
        <span>
          Location is off, so distances are from {fallbackLabel}. You can turn it on in your browser settings.
        </span>
      )}
    </div>
  );
}

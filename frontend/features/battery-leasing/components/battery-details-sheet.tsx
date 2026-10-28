"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BatteryMeter } from "@/components/ui/battery-meter";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import { Sheet } from "@/components/ui/sheet";
import { LoadingRegion, Skeleton } from "@/components/ui/skeleton";
import { StatusPill } from "@/components/ui/status-pill";
import { formatDateTime, formatDistance, formatMoney, formatPercent } from "@/lib/format";
import { AVAILABILITY_PILL, BATTERY_STATUS_PILL } from "@/lib/status";
import type { Battery } from "@/lib/types/battery";

type BatteryDetailsSheetProps = {
  open: boolean;
  /** `null` when the requested battery doesn't exist. */
  battery: Battery | null;
  onClose: () => void;
};

const UNAVAILABLE_REASON: Record<Exclude<Battery["availability"], "available">, string> = {
  leased: "Someone is using this battery right now.",
  maintenance: "This battery is being checked and can't be leased.",
};

export function BatteryDetailsSheet({ open, battery, onClose }: BatteryDetailsSheetProps) {
  const available = battery?.availability === "available";
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={battery ? battery.label : "Battery details"}
      footer={battery ? <DetailsFooter battery={battery} available={available} /> : undefined}
    >
      {battery ? (
        <DetailsBody battery={battery} />
      ) : (
        <ErrorState message="We couldn't find this battery. It may have been removed from the map." />
      )}
    </Sheet>
  );
}

function DetailsBody({ battery }: { battery: Battery }) {
  // Simulates details arriving after the sheet opens. Remounts on every open
  // because the Sheet only renders its children while open.
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(id);
  }, []);

  if (loading) {
    return (
      <LoadingRegion label="Loading battery details">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </LoadingRegion>
    );
  }

  const availability = AVAILABILITY_PILL[battery.availability];
  const status = BATTERY_STATUS_PILL[battery.status];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <StatusPill tone={availability.tone} label={availability.label} />
        <StatusPill tone={status.tone} label={status.label} />
      </div>
      <p className="text-sm text-ink-muted">
        {battery.kioskName} · {formatDistance(battery.distanceKm)} away
      </p>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-sm">
          <span className="text-ink">Charge</span>
          <span className="font-semibold tabular-nums text-ink">{formatPercent(battery.chargePercent)}</span>
        </div>
        <BatteryMeter label="Charge" value={battery.chargePercent} />
        <p className="text-xs text-ink-muted">How full the battery is right now.</p>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-sm">
          <span className="text-ink">Health</span>
          <span className="font-semibold tabular-nums text-ink">{formatPercent(battery.healthPercent)}</span>
        </div>
        <BatteryMeter label="Health" value={battery.healthPercent} size="sm" />
        <p className="text-xs text-ink-muted">How much capacity it has left compared to new.</p>
      </div>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-ink-muted">Estimated range</dt>
          <dd className="font-medium text-ink">{formatDistance(battery.estimatedRangeKm)}</dd>
        </div>
        <div>
          <dt className="text-ink-muted">Price</dt>
          <dd className="font-medium text-ink">{formatMoney(battery.pricePerHourMinorUnits)} / hour</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-ink-muted">Last updated</dt>
          <dd className="text-ink">{formatDateTime(battery.updatedAt)}</dd>
        </div>
      </dl>
      <p className="text-xs text-ink-muted">Demo data.</p>
    </div>
  );
}

function DetailsFooter({ battery, available }: { battery: Battery; available: boolean }) {
  const [showDirections, setShowDirections] = useState(false);
  return (
    <>
      {available ? (
        <Link
          href={`/batteries/lease?battery=${battery.id}`}
          className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          Lease this battery
        </Link>
      ) : (
        <>
          <Button disabled aria-describedby="lease-unavailable-reason">
            Lease this battery
          </Button>
          <p id="lease-unavailable-reason" className="text-center text-sm text-ink-muted">
            {UNAVAILABLE_REASON[battery.availability as Exclude<Battery["availability"], "available">]}
          </p>
        </>
      )}
      <Button variant="ghost" aria-expanded={showDirections} onClick={() => setShowDirections((v) => !v)}>
        Directions
      </Button>
      {showDirections && (
        <p className="text-sm text-ink">
          {battery.kioskName} is at {battery.location.label}. Turn-by-turn directions are coming soon.
        </p>
      )}
    </>
  );
}

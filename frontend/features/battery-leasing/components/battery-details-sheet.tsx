"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BatteryMeter } from "@/components/ui/battery-meter";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import { Sheet } from "@/components/ui/sheet";
import { LoadingRegion, Skeleton } from "@/components/ui/skeleton";
import { formatDistance, formatMoney, formatPercent } from "@/lib/format";
import { batteryCondition } from "@/lib/status";
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
      title={battery ? battery.kioskName : "Battery details"}
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

  // Only what a rider needs to decide. Values are demo data (data/mock.ts).
  return (
    <div className="flex flex-col gap-5">
      <p className="text-base text-ink-muted">
        {formatDistance(battery.distanceKm)} away · Battery {battery.label}
      </p>

      <div className="flex flex-col gap-2">
        <p className="flex items-baseline gap-2">
          <span className="text-4xl font-semibold tabular-nums text-ink">{formatPercent(battery.chargePercent)}</span>
          <span className="text-lg text-ink-muted">charged</span>
        </p>
        <BatteryMeter label="Charge" value={battery.chargePercent} />
      </div>

      <dl className="flex flex-col divide-y divide-line rounded-lg border border-line text-base">
        <Fact label="You can drive about" value={formatDistance(battery.estimatedRangeKm)} />
        <Fact label="Price" value={`${formatMoney(battery.pricePerHourMinorUnits)} per hour`} />
        <Fact label="Battery condition" value={batteryCondition(battery.healthPercent)} />
      </dl>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="font-semibold text-ink">{value}</dd>
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
          className="inline-flex h-14 items-center justify-center rounded-md bg-primary px-4 text-lg font-semibold text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          Lease this battery
        </Link>
      ) : (
        <>
          <Button disabled aria-describedby="lease-unavailable-reason">
            Lease this battery
          </Button>
          <p id="lease-unavailable-reason" className="text-center text-base text-ink-muted">
            {UNAVAILABLE_REASON[battery.availability as Exclude<Battery["availability"], "available">]}
          </p>
        </>
      )}
      <Button variant="ghost" aria-expanded={showDirections} onClick={() => setShowDirections((v) => !v)}>
        Directions
      </Button>
      {showDirections && (
        <p className="text-base text-ink">
          {battery.kioskName} is at {battery.location.label}.
        </p>
      )}
    </>
  );
}

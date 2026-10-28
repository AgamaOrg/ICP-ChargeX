"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { TextField } from "@/components/ui/text-field";
import { formatEnergy, formatMoney, formatPercent } from "@/lib/format";
import { spareEnergyKwh } from "../data/mock";
import type { BatteryTracking, NewOfferInput } from "../types";

type CreateOfferSheetProps = {
  open: boolean;
  onClose: () => void;
  tracking: BatteryTracking | null;
  onCreated: (input: NewOfferInput) => void;
};

function validateEnergy(energyKwh: number, maxKwh: number): string | null {
  if (!Number.isFinite(energyKwh) || energyKwh <= 0) return "Enter how much energy you want to offer.";
  if (energyKwh < 0.1) return "Offer at least 0.1 kWh.";
  if (energyKwh > maxKwh) return `You have about ${formatEnergy(maxKwh)} of spare energy.`;
  return null;
}

function validatePrice(price: number): string | null {
  if (!Number.isFinite(price) || price <= 0) return "Enter a price per kWh.";
  if (price > 1_000) return "Keep the price under ₱1,000 per kWh.";
  return null;
}

export function CreateOfferSheet(props: CreateOfferSheetProps) {
  // Remounting on open resets the form to the current battery's spare energy.
  return <CreateOfferSheetContent key={props.open ? "open" : "closed"} {...props} />;
}

function CreateOfferSheetContent({ open, onClose, tracking, onCreated }: CreateOfferSheetProps) {
  const maxEnergyKwh = tracking ? spareEnergyKwh(tracking.chargePercent) : 0;

  const [energy, setEnergy] = useState(() => (tracking ? String(maxEnergyKwh) : ""));
  const [price, setPrice] = useState("18.50");
  const [energyError, setEnergyError] = useState<string | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);

  const energyValue = Number(energy);
  const priceValue = Number(price);
  const normalizedEnergy = Number.isFinite(energyValue) ? Math.round(energyValue * 10) / 10 : 0;
  const potentialMinorUnits =
    Number.isFinite(priceValue) ? Math.round(normalizedEnergy * priceValue * 100) : 0;

  function handleSubmit() {
    if (!tracking) return;
    const nextEnergyError = validateEnergy(energyValue, maxEnergyKwh);
    const nextPriceError = validatePrice(priceValue);
    setEnergyError(nextEnergyError);
    setPriceError(nextPriceError);
    if (nextEnergyError || nextPriceError) return;

    onCreated({
      batteryLabel: tracking.batteryLabel,
      kioskName: tracking.kioskName,
      energyKwh: normalizedEnergy,
      pricePerKwhMinorUnits: Math.round(priceValue * 100),
      healthPercent: tracking.healthPercent,
    });
  }

  const footer = (
    <>
      <Button onClick={handleSubmit} disabled={!tracking}>
        Publish offer
      </Button>
      <p className="text-center text-xs text-ink-muted">Demo only — your offer is not sent to a real canister.</p>
    </>
  );

  return (
    <Sheet open={open} onClose={onClose} title="Create offer" footer={footer}>
      {!tracking ? (
        <p className="text-sm text-ink-muted">
          You need a leased battery before you can offer spare energy. Lease a battery first, then come back.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-ink-muted">
            Offer spare energy from a battery you are leasing. Buyers pick it up at the kiosk.
          </p>

          <dl className="rounded-md bg-surface-muted p-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-ink-muted">Battery</dt>
              <dd className="text-ink">{tracking.batteryLabel}</dd>
            </div>
            <div className="mt-1 flex justify-between gap-3">
              <dt className="text-ink-muted">Pickup</dt>
              <dd className="text-right text-ink">{tracking.kioskName}</dd>
            </div>
            <div className="mt-1 flex justify-between gap-3">
              <dt className="text-ink-muted">Spare energy</dt>
              <dd className="tabular-nums text-ink">
                {formatEnergy(maxEnergyKwh)} · {formatPercent(tracking.healthPercent)} health
              </dd>
            </div>
          </dl>

          <TextField
            label="Energy to offer (kWh)"
            inputMode="decimal"
            value={energy}
            onChange={(event) => {
              setEnergy(event.target.value);
              setEnergyError(null);
            }}
            hint={`Up to ${formatEnergy(maxEnergyKwh)} based on the current charge.`}
            error={energyError ?? undefined}
          />

          <TextField
            label="Price per kWh (₱)"
            inputMode="decimal"
            value={price}
            onChange={(event) => {
              setPrice(event.target.value);
              setPriceError(null);
            }}
            hint="Buyers pay this rate for each kWh they take."
            error={priceError ?? undefined}
          />

          <dl className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-ink-muted">Potential earnings</dt>
              <dd className="tabular-nums text-ink">{formatMoney(potentialMinorUnits)}</dd>
            </div>
          </dl>
        </div>
      )}
    </Sheet>
  );
}

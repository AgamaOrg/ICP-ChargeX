"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import { Sheet } from "@/components/ui/sheet";
import { TextField } from "@/components/ui/text-field";
import { formatEnergy, formatMoney } from "@/lib/format";
import type { EnergyOffer } from "../types";

type TradeSheetProps = {
  offer: EnergyOffer | null;
  open: boolean;
  onClose: () => void;
  onComplete: (offerId: string, energyKwh: number) => void;
};

type TradePhase =
  | { status: "idle" }
  | { status: "processing" }
  | { status: "success"; energyKwh: number; totalMinorUnits: number }
  | { status: "failure"; message: string };

function validateTrade(energyKwh: number, offer: EnergyOffer): string | null {
  if (!Number.isFinite(energyKwh) || energyKwh <= 0) return "Enter how much energy you want to buy.";
  if (energyKwh < offer.minPurchaseKwh) return `The minimum is ${formatEnergy(offer.minPurchaseKwh)}.`;
  if (energyKwh > offer.energyKwh) return `Only ${formatEnergy(offer.energyKwh)} is available.`;
  return null;
}

export function TradeSheet(props: TradeSheetProps) {
  // Remounting on open (or on a different offer) resets the form without an
  // effect that writes state during render.
  return (
    <TradeSheetContent
      key={`${props.open ? "open" : "closed"}-${props.offer?.id ?? "none"}`}
      {...props}
    />
  );
}

function TradeSheetContent({ offer, open, onClose, onComplete }: TradeSheetProps) {
  const [phase, setPhase] = useState<TradePhase>({ status: "idle" });
  const [amount, setAmount] = useState(() => (offer ? String(offer.minPurchaseKwh) : ""));
  const [error, setError] = useState<string | null>(null);

  const energyValue = Number(amount);
  const normalizedEnergy = Number.isFinite(energyValue) ? Math.round(energyValue * 10) / 10 : 0;

  useEffect(() => {
    if (phase.status !== "processing" || !offer) return;
    const id = setTimeout(() => {
      if (Math.random() < 0.85) {
        setPhase({
          status: "success",
          energyKwh: normalizedEnergy,
          totalMinorUnits: Math.round(normalizedEnergy * offer.pricePerKwhMinorUnits),
        });
      } else {
        setPhase({
          status: "failure",
          message: "The trade didn't go through. Nothing was charged. Try again.",
        });
      }
    }, 900);
    return () => clearTimeout(id);
  }, [phase.status, offer, normalizedEnergy]);

  const totalMinorUnits = offer ? Math.round(normalizedEnergy * offer.pricePerKwhMinorUnits) : 0;

  function handleClose() {
    setPhase({ status: "idle" });
    setError(null);
    onClose();
  }

  function handleSubmit() {
    if (!offer) return;
    const message = validateTrade(Number(amount), offer);
    if (message) {
      setError(message);
      return;
    }
    setError(null);
    setPhase({ status: "processing" });
  }

  function handleDone() {
    if (!offer) {
      handleClose();
      return;
    }
    const offerId = offer.id;
    onClose();
    onComplete(offerId, normalizedEnergy);
  }

  const footer =
    phase.status === "success" ? (
      <Button onClick={handleDone}>Done</Button>
    ) : phase.status === "failure" ? (
      <>
        <Button onClick={() => setPhase({ status: "idle" })}>Try again</Button>
        <Button variant="ghost" onClick={handleClose}>
          Cancel
        </Button>
      </>
    ) : (
      <>
        <Button onClick={handleSubmit} loading={phase.status === "processing"} disabled={!offer}>
          {phase.status === "processing" ? "Processing…" : `Buy for ${formatMoney(totalMinorUnits)}`}
        </Button>
        <p className="text-center text-xs text-ink-muted">Demo only — no real trade or payment is processed.</p>
      </>
    );

  return (
    <Sheet open={open} onClose={handleClose} title="Buy energy" footer={footer}>
      {phase.status === "success" && offer ? (
        <div role="status" className="flex flex-col gap-3">
          <p className="text-sm text-ink-muted">Trade complete</p>
          <p className="text-3xl font-semibold tabular-nums text-ink">{formatMoney(phase.totalMinorUnits)}</p>
          <p className="text-base text-ink">
            Bought {formatEnergy(phase.energyKwh)} from {offer.sellerName}.
          </p>
          <dl className="rounded-md bg-surface-muted p-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-ink-muted">Battery</dt>
              <dd className="text-ink">{offer.batteryLabel}</dd>
            </div>
            <div className="mt-1 flex justify-between gap-3">
              <dt className="text-ink-muted">Pickup</dt>
              <dd className="text-right text-ink">{offer.kioskName}</dd>
            </div>
          </dl>
          <p className="text-xs text-ink-muted">Demo only — the trade is not connected to a real canister.</p>
        </div>
      ) : phase.status === "failure" ? (
        <ErrorState message={phase.message} />
      ) : offer ? (
        <div className="flex flex-col gap-4">
          <dl className="rounded-md bg-surface-muted p-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-ink-muted">Seller</dt>
              <dd className="text-ink">{offer.sellerName}</dd>
            </div>
            <div className="mt-1 flex justify-between gap-3">
              <dt className="text-ink-muted">Battery</dt>
              <dd className="text-ink">{offer.batteryLabel}</dd>
            </div>
            <div className="mt-1 flex justify-between gap-3">
              <dt className="text-ink-muted">Pickup</dt>
              <dd className="text-right text-ink">{offer.kioskName}</dd>
            </div>
          </dl>

          <TextField
            label="Energy to buy (kWh)"
            inputMode="decimal"
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value);
              setError(null);
            }}
            hint={`Available ${formatEnergy(offer.energyKwh)} · Minimum ${formatEnergy(offer.minPurchaseKwh)}`}
            error={error ?? undefined}
            disabled={phase.status === "processing"}
          />

          <dl className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-ink-muted">Price per kWh</dt>
              <dd className="tabular-nums text-ink">{formatMoney(offer.pricePerKwhMinorUnits)}</dd>
            </div>
            <div className="flex justify-between gap-3 text-base font-semibold">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatMoney(totalMinorUnits)}</dd>
            </div>
          </dl>
        </div>
      ) : null}
    </Sheet>
  );
}

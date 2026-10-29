"use client";

import { useRef, useState } from "react";
import { formatEnergy } from "@/lib/format";
import type { EnergyOffer, NewOfferInput, TradeRecord } from "../types";

/**
 * In-memory market state for the demo. Trades and offers reset on reload;
 * real canister calls will replace this hook's internals, not its callers.
 */
export function useMarket(initialOffers: EnergyOffer[], initialTrades: TradeRecord[]) {
  const [offers, setOffers] = useState(initialOffers);
  const [trades, setTrades] = useState(initialTrades);
  const [notice, setNotice] = useState("");
  const nextOfferId = useRef(1);

  function buy(offerId: string, energyKwh: number) {
    const offer = offers.find((item) => item.id === offerId);
    if (!offer) return;

    const amount = Math.round(energyKwh * 10) / 10;
    const remaining = Math.round((offer.energyKwh - amount) * 10) / 10;
    const totalMinorUnits = Math.round(amount * offer.pricePerKwhMinorUnits);

    setOffers((current) =>
      remaining <= 0
        ? current.filter((item) => item.id !== offerId)
        : current.map((item) => (item.id === offerId ? { ...item, energyKwh: remaining } : item)),
    );
    setTrades((current) => [
      {
        id: `trade-${Date.now()}`,
        batteryLabel: offer.batteryLabel,
        counterparty: offer.sellerName,
        side: "buy",
        energyKwh: amount,
        totalMinorUnits,
        executedAt: new Date().toISOString(),
      },
      ...current,
    ]);
    // The demo note stays: a purchase must never look like a real payment (rules.md §4).
    setNotice(`You bought ${formatEnergy(amount)} from ${offer.sellerName}. This is a demo. No money was taken.`);
  }

  function createOffer(input: NewOfferInput) {
    const id = `offer-user-${nextOfferId.current}`;
    nextOfferId.current += 1;

    setOffers((current) => [
      {
        id,
        batteryLabel: input.batteryLabel,
        sellerName: "You",
        kioskName: input.kioskName,
        distanceKm: 0,
        energyKwh: input.energyKwh,
        pricePerKwhMinorUnits: input.pricePerKwhMinorUnits,
        minPurchaseKwh: 0.5,
        healthPercent: input.healthPercent,
        status: "open",
        createdAt: new Date().toISOString(),
        mine: true,
      },
      ...current,
    ]);
    setNotice(`Your ${formatEnergy(input.energyKwh)} is now for sale.`);
  }

  function cancelOffer(offerId: string) {
    setOffers((current) => current.filter((item) => item.id !== offerId));
    setNotice("You stopped selling.");
  }

  return { offers, trades, notice, buy, createOffer, cancelOffer };
}

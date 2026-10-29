"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { BoltIcon, WalletIcon } from "@/components/ui/icons";
import { formatEnergy, formatMoney, formatRelative } from "@/lib/format";
import { useMockNow } from "@/lib/mock/use-mock-now";
import type { EnergyOffer, PortfolioSummary, TradeRecord } from "../types";

type PortfolioPanelProps = {
  offers: EnergyOffer[];
  trades: TradeRecord[];
  summary: PortfolioSummary;
  empty: boolean;
  onCreateOffer: () => void;
  onCancelOffer: (offer: EnergyOffer) => void;
};

export function PortfolioPanel({
  offers,
  trades,
  summary,
  empty,
  onCreateOffer,
  onCancelOffer,
}: PortfolioPanelProps) {
  const now = useMockNow();
  const myOffers = empty ? [] : offers.filter((offer) => offer.mine && offer.status === "open");
  const history = empty ? [] : [...trades].sort((a, b) => Date.parse(b.executedAt) - Date.parse(a.executedAt));

  if (empty) {
    return (
      <Card>
        <EmptyState
          title="Nothing here yet"
          description="When you buy or sell power, it will show here."
          action={<Button onClick={onCreateOffer}>Sell my extra power</Button>}
        />
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Values are mock data (data/mock.ts) and reset on reload. */}
      <Card aria-labelledby="portfolio-title">
        <h2 id="portfolio-title" className="text-lg font-semibold text-ink">
          This month
        </h2>
        <p className="mt-2 text-base text-ink-muted">You earned</p>
        <p className="text-4xl font-semibold tabular-nums text-ink">
          {formatMoney(summary.earnedThisMonthMinorUnits)}
        </p>
        <p className="mt-2 text-base text-ink-muted">You spent {formatMoney(summary.spentThisMonthMinorUnits)}</p>
      </Card>

      <Card aria-labelledby="open-offers-title">
        <h2 id="open-offers-title" className="mb-2 text-lg font-semibold text-ink">
          Selling now
        </h2>

        {myOffers.length === 0 ? (
          <EmptyState
            title="You are not selling anything"
            description="Sell extra power from the battery you are using."
            action={<Button onClick={onCreateOffer}>Sell my extra power</Button>}
          />
        ) : (
          <ul className="divide-y divide-line">
            {myOffers.map((offer) => (
              <li key={offer.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-lg font-semibold text-ink">{formatEnergy(offer.energyKwh)}</p>
                  <p className="truncate text-base text-ink-muted">
                    {formatMoney(offer.pricePerKwhMinorUnits)} per kWh · {offer.kioskName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onCancelOffer(offer)}
                  aria-label={`Stop selling ${formatEnergy(offer.energyKwh)}`}
                  className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-md border border-line px-3 text-base font-semibold text-danger hover:bg-danger-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  Stop
                </button>
              </li>
            ))}
          </ul>
        )}
        {myOffers.length > 0 && (
          <Button variant="secondary" onClick={onCreateOffer} className="mt-3 w-full">
            Sell more power
          </Button>
        )}
      </Card>

      <Card aria-labelledby="history-title">
        <h2 id="history-title" className="mb-2 text-lg font-semibold text-ink">
          Past buys and sales
        </h2>

        {history.length === 0 ? (
          <EmptyState title="Nothing yet" description="Your buys and sales will show here." />
        ) : (
          <ul className="divide-y divide-line">
            {history.map((trade) => (
              <li key={trade.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="text-ink-muted">
                    {trade.side === "buy" ? <WalletIcon /> : <BoltIcon />}
                  </span>
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-ink">
                      {trade.side === "buy" ? "Bought" : "Sold"} {formatEnergy(trade.energyKwh)}
                    </p>
                    <p className="truncate text-sm text-ink-muted">
                      {trade.side === "buy" ? "from" : "to"} {trade.counterparty} · {formatRelative(trade.executedAt, now)}
                    </p>
                  </div>
                </div>
                <p
                  className={`shrink-0 text-base font-semibold tabular-nums ${trade.side === "sell" ? "text-success" : "text-ink"}`}
                >
                  {trade.side === "sell" ? "+" : "−"}
                  {formatMoney(trade.totalMinorUnits)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

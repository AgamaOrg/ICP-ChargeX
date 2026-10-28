"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { BoltIcon, WalletIcon } from "@/components/ui/icons";
import { StatusPill } from "@/components/ui/status-pill";
import { formatDateTime, formatEnergy, formatMoney, formatRelative } from "@/lib/format";
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
          title="No trading activity yet"
          description="Once you buy, sell, or list energy, your balance and history show up here."
          action={<Button onClick={onCreateOffer}>Create offer</Button>}
        />
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Card aria-labelledby="portfolio-title">
        <div className="mb-3 flex items-baseline justify-between gap-2">
          <h2 id="portfolio-title" className="text-base font-semibold text-ink">
            Portfolio
          </h2>
          <span className="text-xs text-ink-muted">Demo data</span>
        </div>
        <p className="text-sm text-ink-muted">Earned this month</p>
        <p className="text-3xl font-semibold tabular-nums text-ink">
          {formatMoney(summary.earnedThisMonthMinorUnits)}
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <div>
            <dt className="text-ink-muted">Spent this month</dt>
            <dd className="tabular-nums text-ink">{formatMoney(summary.spentThisMonthMinorUnits)}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Energy traded</dt>
            <dd className="tabular-nums text-ink">{formatEnergy(summary.kwhTraded)}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Open offers</dt>
            <dd className="tabular-nums text-ink">{myOffers.length}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Net this month</dt>
            <dd className="tabular-nums text-ink">
              {formatMoney(summary.earnedThisMonthMinorUnits - summary.spentThisMonthMinorUnits)}
            </dd>
          </div>
        </dl>
      </Card>

      <Card aria-labelledby="open-offers-title">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h2 id="open-offers-title" className="text-base font-semibold text-ink">
            Your open offers
          </h2>
          {myOffers.length > 0 && (
            <Button variant="ghost" onClick={onCreateOffer}>
              New offer
            </Button>
          )}
        </div>

        {myOffers.length === 0 ? (
          <EmptyState
            title="No open offers"
            description="Offer spare energy from a battery you are leasing."
            action={<Button onClick={onCreateOffer}>Create offer</Button>}
          />
        ) : (
          <ul className="divide-y divide-line">
            {myOffers.map((offer) => (
              <li key={offer.id} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">
                    {formatEnergy(offer.energyKwh)} at {formatMoney(offer.pricePerKwhMinorUnits)}/kWh
                  </p>
                  <p className="truncate text-sm text-ink-muted">
                    {offer.batteryLabel} · {offer.kioskName}
                  </p>
                  <p className="text-xs text-ink-muted">Listed {formatRelative(offer.createdAt, now)}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <StatusPill tone="success" label="Open" />
                  <button
                    type="button"
                    onClick={() => onCancelOffer(offer)}
                    aria-label={`Cancel offer for ${formatEnergy(offer.energyKwh)}`}
                    className="inline-flex min-h-11 items-center justify-center rounded-md px-3 text-sm font-medium text-danger hover:bg-danger-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                  >
                    Cancel
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card aria-labelledby="history-title">
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <h2 id="history-title" className="text-base font-semibold text-ink">
            Trading history
          </h2>
          <span className="text-xs text-ink-muted">Demo data</span>
        </div>

        {history.length === 0 ? (
          <EmptyState title="No trades yet" description="Completed buys and sells will show up here." />
        ) : (
          <ul className="divide-y divide-line">
            {history.map((trade) => (
              <li key={trade.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="text-ink-muted">
                    {trade.side === "buy" ? <WalletIcon /> : <BoltIcon />}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">
                      {trade.side === "buy" ? "Bought" : "Sold"} {formatEnergy(trade.energyKwh)}
                    </p>
                    <p className="truncate text-xs text-ink-muted">
                      {trade.side === "buy" ? "from" : "to"} {trade.counterparty} · {formatDateTime(trade.executedAt)}
                    </p>
                  </div>
                </div>
                <p
                  className={`shrink-0 text-sm font-medium tabular-nums ${trade.side === "sell" ? "text-success" : "text-ink"}`}
                >
                  {trade.side === "sell" ? "+" : "−"}
                  {formatMoney(trade.totalMinorUnits)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <p className="text-center text-xs text-ink-muted">
        Demo data. Trades and offers are stored in memory and reset when you reload.
      </p>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusPill } from "@/components/ui/status-pill";
import { formatDistance, formatEnergy, formatMoney, formatPercent } from "@/lib/format";
import type { EnergyOffer, OfferSort } from "../types";

type MarketBrowserProps = {
  offers: EnergyOffer[];
  sort: OfferSort;
  onSortChange: (sort: OfferSort) => void;
  onBuy: (offerId: string) => void;
  onCreateOffer: () => void;
  empty: boolean;
};

const SORT_LABEL: Record<OfferSort, string> = {
  price: "Price",
  nearby: "Nearest",
  energy: "Energy",
};

const SORTS: OfferSort[] = ["price", "nearby", "energy"];

const COMPARATORS: Record<OfferSort, (a: EnergyOffer, b: EnergyOffer) => number> = {
  price: (a, b) => a.pricePerKwhMinorUnits - b.pricePerKwhMinorUnits || a.distanceKm - b.distanceKm,
  nearby: (a, b) => a.distanceKm - b.distanceKm || a.pricePerKwhMinorUnits - b.pricePerKwhMinorUnits,
  energy: (a, b) => b.energyKwh - a.energyKwh || a.pricePerKwhMinorUnits - b.pricePerKwhMinorUnits,
};

export function MarketBrowser({ offers, sort, onSortChange, onBuy, onCreateOffer, empty }: MarketBrowserProps) {
  const openOffers = offers.filter((offer) => offer.status === "open" && !offer.mine);
  const sorted = [...openOffers].sort(COMPARATORS[sort]);
  const isEmpty = empty || sorted.length === 0;

  return (
    <section aria-labelledby="market-title" className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="market-title" className="text-base font-semibold text-ink">
          Marketplace
        </h2>
        <span className="text-xs text-ink-muted">Demo data</span>
      </div>

      {isEmpty ? (
        <Card>
          <EmptyState
            title="No open offers"
            description="No one is selling spare energy nearby right now. You can list your own."
            action={<Button onClick={onCreateOffer}>Create offer</Button>}
          />
        </Card>
      ) : (
        <>
          <Button onClick={onCreateOffer} className="w-full">
            Create offer
          </Button>

          <div role="group" aria-label="Sort offers" className="grid grid-cols-3 gap-1 rounded-md bg-surface-muted p-1">
            {SORTS.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={sort === option}
                onClick={() => onSortChange(option)}
                className={`min-h-11 rounded-sm px-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${sort === option ? "bg-surface text-ink shadow-card" : "text-ink-muted"}`}
              >
                {SORT_LABEL[option]}
              </button>
            ))}
          </div>

          <p className="text-sm text-ink-muted">
            {sorted.length} {sorted.length === 1 ? "open offer" : "open offers"} · prices per kWh
          </p>

          <ul className="flex flex-col gap-2">
            {sorted.map((offer) => (
              <li key={offer.id}>
                <OfferCard offer={offer} onBuy={onBuy} />
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

function OfferCard({ offer, onBuy }: { offer: EnergyOffer; onBuy: (offerId: string) => void }) {
  return (
    <Card as="article">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm text-ink-muted">{offer.sellerName}</p>
          <h3 className="text-lg font-semibold text-ink">{formatEnergy(offer.energyKwh)} spare</h3>
        </div>
        <StatusPill tone="info" label="Open" />
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <dt className="text-ink-muted">Battery</dt>
          <dd className="truncate text-ink">{offer.batteryLabel}</dd>
        </div>
        <div>
          <dt className="text-ink-muted">Health</dt>
          <dd className="tabular-nums text-ink">{formatPercent(offer.healthPercent)}</dd>
        </div>
        <div>
          <dt className="text-ink-muted">Pickup</dt>
          <dd className="truncate text-ink">{offer.kioskName}</dd>
        </div>
        <div>
          <dt className="text-ink-muted">Distance</dt>
          <dd className="tabular-nums text-ink">{formatDistance(offer.distanceKm)}</dd>
        </div>
      </dl>

      <div className="mt-3 flex items-end justify-between gap-3">
        <p>
          <span className="text-xl font-semibold tabular-nums text-ink">
            {formatMoney(offer.pricePerKwhMinorUnits)}
          </span>
          <span className="text-sm text-ink-muted"> / kWh</span>
          <span className="mt-0.5 block text-xs text-ink-muted">Minimum {formatEnergy(offer.minPurchaseKwh)}</span>
        </p>
        <Button
          variant="secondary"
          onClick={() => onBuy(offer.id)}
          aria-label={`Buy energy from ${offer.sellerName}`}
        >
          Buy energy
        </Button>
      </div>
    </Card>
  );
}

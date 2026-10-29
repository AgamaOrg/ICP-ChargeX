import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDistance, formatEnergy, formatMoney } from "@/lib/format";
import type { EnergyOffer } from "../types";

type MarketBrowserProps = {
  offers: EnergyOffer[];
  onBuy: (offerId: string) => void;
  onCreateOffer: () => void;
  empty: boolean;
};

// Cheapest first, nearest breaks ties. The sort control was removed to keep
// this screen to one decision: which offer to buy. Offers are mock data.
const byPrice = (a: EnergyOffer, b: EnergyOffer) =>
  a.pricePerKwhMinorUnits - b.pricePerKwhMinorUnits || a.distanceKm - b.distanceKm;

export function MarketBrowser({ offers, onBuy, onCreateOffer, empty }: MarketBrowserProps) {
  const sorted = offers.filter((offer) => offer.status === "open" && !offer.mine).sort(byPrice);
  const isEmpty = empty || sorted.length === 0;

  return (
    <section aria-labelledby="market-title" className="flex flex-col gap-3">
      <h2 id="market-title" className="sr-only">
        Power for sale
      </h2>

      {isEmpty ? (
        <Card>
          <EmptyState
            title="No one is selling right now"
            description="Check again later, or sell your own extra power."
            action={<Button onClick={onCreateOffer}>Sell my extra power</Button>}
          />
        </Card>
      ) : (
        <>
          <p className="text-base text-ink">Cheapest first</p>
          <ul className="flex flex-col gap-3">
            {sorted.map((offer) => (
              <li key={offer.id}>
                <OfferCard offer={offer} onBuy={onBuy} />
              </li>
            ))}
          </ul>
          <Button variant="secondary" onClick={onCreateOffer} className="w-full">
            Sell my extra power
          </Button>
        </>
      )}
    </section>
  );
}

function OfferCard({ offer, onBuy }: { offer: EnergyOffer; onBuy: (offerId: string) => void }) {
  return (
    <Card as="article" className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-xl font-semibold text-ink">{formatEnergy(offer.energyKwh)}</h3>
        <p className="shrink-0">
          <span className="text-xl font-semibold tabular-nums text-ink">{formatMoney(offer.pricePerKwhMinorUnits)}</span>
          <span className="text-base text-ink-muted"> per kWh</span>
        </p>
      </div>
      <p className="truncate text-base text-ink-muted">
        {offer.sellerName} · {offer.kioskName} · {formatDistance(offer.distanceKm)} away
      </p>
      <Button variant="secondary" onClick={() => onBuy(offer.id)} aria-label={`Buy power from ${offer.sellerName}`}>
        Buy
      </Button>
    </Card>
  );
}

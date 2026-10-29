"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { Sheet } from "@/components/ui/sheet";
import { LoadingRegion, Skeleton } from "@/components/ui/skeleton";
import { formatEnergy } from "@/lib/format";
import { useSimulatedLoad } from "@/lib/mock/use-simulated-load";
import { useMarket } from "../hooks/use-market";
import type {
  BatteryTracking,
  EnergyOffer,
  NewOfferInput,
  PortfolioSummary,
  TradeRecord,
  TradingTab,
} from "../types";
import { BatteryTrackingPanel } from "./battery-tracking-panel";
import { CreateOfferSheet } from "./create-offer-sheet";
import { MarketBrowser } from "./market-browser";
import { PortfolioPanel } from "./portfolio-panel";
import { TradeSheet } from "./trade-sheet";
import { tradingPanelId, TradingTabs, tradingTabId } from "./trading-tabs";

type TradingWorkspaceProps = {
  initialOffers: EnergyOffer[];
  initialTrades: TradeRecord[];
  portfolio: PortfolioSummary;
  tracking: BatteryTracking | null;
};

export function TradingWorkspace({ initialOffers, initialTrades, portfolio, tracking }: TradingWorkspaceProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { state, retry } = useSimulatedLoad(
    "We couldn't load energy trading. Check your connection and try again.",
  );
  const market = useMarket(initialOffers, initialTrades);
  const [cancelTarget, setCancelTarget] = useState<EnergyOffer | null>(null);

  const tabParam = searchParams.get("tab");
  const tab: TradingTab = tabParam === "tracking" || tabParam === "portfolio" ? tabParam : "market";
  const offerId = searchParams.get("offer");
  const selectedOffer = market.offers.find((offer) => offer.id === offerId) ?? null;
  const createOpen = searchParams.get("sheet") === "new-offer";

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null) params.delete(key);
      else params.set(key, value);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function handleCreated(input: NewOfferInput) {
    market.createOffer(input);
    updateParams({ sheet: null });
  }

  function confirmCancel() {
    if (!cancelTarget) return;
    market.cancelOffer(cancelTarget.id);
    setCancelTarget(null);
  }

  if (state.status === "loading") return <TradingWorkspaceSkeleton />;
  if (state.status === "error") return <ErrorState message={state.message} onRetry={retry} />;

  return (
    <div className="flex flex-col gap-4 px-4 pb-6">
      <TradingTabs value={tab} onChange={(next) => updateParams({ tab: next === "market" ? null : next })} />

      <p role="status" aria-live="polite" className="text-base font-medium text-success empty:hidden">
        {market.notice}
      </p>

      <div
        role="tabpanel"
        id={tradingPanelId(tab)}
        aria-labelledby={tradingTabId(tab)}
        tabIndex={0}
        className="flex flex-col gap-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        {tab === "market" && (
          <MarketBrowser
            offers={market.offers}
            onBuy={(id) => updateParams({ offer: id })}
            onCreateOffer={() => updateParams({ sheet: "new-offer" })}
            empty={state.forceEmpty}
          />
        )}

        {tab === "tracking" && <BatteryTrackingPanel tracking={tracking} empty={state.forceEmpty} />}

        {tab === "portfolio" && (
          <PortfolioPanel
            offers={market.offers}
            trades={market.trades}
            summary={portfolio}
            empty={state.forceEmpty}
            onCreateOffer={() => updateParams({ sheet: "new-offer" })}
            onCancelOffer={setCancelTarget}
          />
        )}
      </div>

      <TradeSheet
        offer={selectedOffer}
        open={selectedOffer !== null}
        onClose={() => updateParams({ offer: null })}
        onComplete={market.buy}
      />

      <CreateOfferSheet
        open={createOpen}
        onClose={() => updateParams({ sheet: null })}
        tracking={tracking}
        onCreated={handleCreated}
      />

      <Sheet
        open={cancelTarget !== null}
        onClose={() => setCancelTarget(null)}
        title="Stop selling?"
        footer={
          <>
            <Button variant="danger" onClick={confirmCancel}>
              Stop selling
            </Button>
            <Button variant="secondary" onClick={() => setCancelTarget(null)}>
              Keep selling
            </Button>
          </>
        }
      >
        {cancelTarget && (
          <>
            <p className="text-base text-ink">
              Your {formatEnergy(cancelTarget.energyKwh)} at {cancelTarget.kioskName} will be taken off the list.
            </p>
          </>
        )}
      </Sheet>
    </div>
  );
}

export function TradingWorkspaceSkeleton() {
  return (
    <div className="px-4 pb-6">
      <LoadingRegion label="Loading energy trading">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-13 w-full" />
          <Card>
            <div className="flex flex-col gap-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-4 w-52" />
            </div>
          </Card>
          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 }, (_, index) => (
              <Card key={index}>
                <div className="flex items-center gap-3">
                  <Skeleton className="size-9" />
                  <div className="flex flex-1 flex-col gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </LoadingRegion>
    </div>
  );
}

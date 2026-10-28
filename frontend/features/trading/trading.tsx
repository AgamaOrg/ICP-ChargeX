import { Suspense } from "react";
import { PageHeader } from "@/components/common/page-header";
import {
  mockBatteryTracking,
  mockMarketOffers,
  mockPortfolioSummary,
  mockTrades,
} from "./data/mock";
import { TradingWorkspace, TradingWorkspaceSkeleton } from "./components/trading-workspace";

export default function Trading() {
  return (
    <>
      <PageHeader title="Energy trading" />
      <Suspense fallback={<TradingWorkspaceSkeleton />}>
        <TradingWorkspace
          initialOffers={mockMarketOffers}
          initialTrades={mockTrades}
          portfolio={mockPortfolioSummary}
          tracking={mockBatteryTracking}
        />
      </Suspense>
    </>
  );
}

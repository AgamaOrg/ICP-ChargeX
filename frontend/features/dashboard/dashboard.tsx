import { Suspense } from "react";
import { BrandHeader, LogoutLink } from "@/components/common/brand-header";
import { ActiveLeasesList, ActiveLeasesSkeleton } from "./components/active-leases-list";
import { BatteryStatusCard, BatteryStatusSkeleton } from "./components/battery-status-card";
import { NotificationBellPlaceholder, NotificationCenter } from "./components/notification-center";
import { QuickActions } from "./components/quick-actions";
// TRADING PAUSED (2026-10-29): restore with the trading card below.
// import { TradingSummary, TradingSummarySkeleton } from "./components/trading-summary";
import {
  mockDashboardBattery,
  mockDashboardLeases,
  mockIncomingNotification,
  mockNotifications,
  mockQuickActionsContext,
  // mockTradingSummary, // TRADING PAUSED (2026-10-29)
  mockUserName,
} from "./data/mock";

// Each data surface sits in its own Suspense boundary: they read the
// ?demo= search param, and their fallbacks are the matching skeletons.
// All values are mock data (see data/mock.ts). On-screen demo labels were
// removed at the product owner's request (2026-10-29); keep these comments.
export default function Dashboard() {
  return (
    <>
      <BrandHeader
        eyebrow="Good morning,"
        title={mockUserName}
        tall
        actions={
          <>
            <Suspense fallback={<NotificationBellPlaceholder />}>
              <NotificationCenter initial={mockNotifications} incoming={mockIncomingNotification} />
            </Suspense>
            <LogoutLink />
          </>
        }
      />
      <div className="flex flex-col gap-4 px-4 pt-4 pb-6">
        {/* The battery card overlaps the teal band, like a wallet balance card. */}
        <div className="-mt-12">
          <Suspense fallback={<BatteryStatusSkeleton />}>
            <BatteryStatusCard battery={mockDashboardBattery} />
          </Suspense>
        </div>
        <QuickActions {...mockQuickActionsContext} />
        <Suspense fallback={<ActiveLeasesSkeleton />}>
          <ActiveLeasesList leases={mockDashboardLeases} />
        </Suspense>
        {/* TRADING PAUSED (2026-10-29): hidden at the product owner's request, not deleted.
        <Suspense fallback={<TradingSummarySkeleton />}>
          <TradingSummary summary={mockTradingSummary} />
        </Suspense>
        */}
      </div>
    </>
  );
}

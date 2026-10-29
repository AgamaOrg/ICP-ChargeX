import { Suspense } from "react";
import { Logo } from "@/components/common/logo";
import { PageHeader } from "@/components/common/page-header";
import { ActiveLeasesList, ActiveLeasesSkeleton } from "./components/active-leases-list";
import { BatteryStatusCard, BatteryStatusSkeleton } from "./components/battery-status-card";
import { NotificationBellPlaceholder, NotificationCenter } from "./components/notification-center";
import { QuickActions } from "./components/quick-actions";
import { TradingSummary, TradingSummarySkeleton } from "./components/trading-summary";
import {
  mockDashboardBattery,
  mockDashboardLeases,
  mockIncomingNotification,
  mockNotifications,
  mockQuickActionsContext,
  mockTradingSummary,
  mockUserName,
} from "./data/mock";

// Each data surface sits in its own Suspense boundary: they read the
// ?demo= search param, and their fallbacks are the matching skeletons.
// All values are mock data (see data/mock.ts). On-screen demo labels were
// removed at the product owner's request (2026-10-29); keep these comments.
export default function Dashboard() {
  return (
    <>
      <PageHeader
        title={`Good morning, ${mockUserName}`}
        leading={<Logo variant="tile" size="sm" />}
        actions={
          <Suspense fallback={<NotificationBellPlaceholder />}>
            <NotificationCenter initial={mockNotifications} incoming={mockIncomingNotification} />
          </Suspense>
        }
      />
      <div className="flex flex-col gap-4 px-4 pb-6">
        <Suspense fallback={<BatteryStatusSkeleton />}>
          <BatteryStatusCard battery={mockDashboardBattery} />
        </Suspense>
        <QuickActions {...mockQuickActionsContext} />
        <Suspense fallback={<ActiveLeasesSkeleton />}>
          <ActiveLeasesList leases={mockDashboardLeases} />
        </Suspense>
        <Suspense fallback={<TradingSummarySkeleton />}>
          <TradingSummary summary={mockTradingSummary} />
        </Suspense>
      </div>
    </>
  );
}

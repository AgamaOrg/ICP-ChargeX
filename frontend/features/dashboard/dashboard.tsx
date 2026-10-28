import { Suspense } from "react";
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
export default function Dashboard() {
  return (
    <>
      <PageHeader
        title={`Good morning, ${mockUserName}`}
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
        <p className="text-center text-xs text-ink-muted">
          Demo data. Nothing here is connected to real batteries or payments.
        </p>
      </div>
    </>
  );
}

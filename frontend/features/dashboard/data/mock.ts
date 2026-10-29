import { MOCK_NOW_MS, mockBatteries, mockLeases } from "@/lib/mock/fixtures";
import type { Battery } from "@/lib/types/battery";
import type { AppNotification, QuickActionsContext, TradingSummary } from "../types";

const hoursAgo = (hours: number) => new Date(MOCK_NOW_MS - hours * 3_600_000).toISOString();
const daysAgo = (days: number) => hoursAgo(days * 24);

export const mockUserName = "Alex";

/** The battery the demo user currently holds. */
export const mockDashboardBattery: Battery | null = mockBatteries[0] ?? null;

export const mockDashboardLeases = mockLeases.filter((lease) => lease.status !== "completed");

export const mockQuickActionsContext: QuickActionsContext = (() => {
  const active = mockLeases.find((l) => l.status === "active" || l.status === "ending-soon");
  return {
    trackedBatteryId: mockDashboardBattery?.id ?? null,
    activeLease: active ? { id: active.id, batteryLabel: active.batteryLabel, kioskName: active.kioskName } : null,
    overdueLeaseId: mockLeases.find((l) => l.status === "overdue")?.id ?? null,
  };
})();

export const mockTradingSummary: TradingSummary = {
  earnedMinorUnits: 124_000,
  kwhSold: 12.4,
  openOffers: 2,
  last7Days: [
    { dateIso: daysAgo(6), earnedMinorUnits: 12_000 },
    { dateIso: daysAgo(5), earnedMinorUnits: 0 },
    { dateIso: daysAgo(4), earnedMinorUnits: 18_500 },
    { dateIso: daysAgo(3), earnedMinorUnits: 9_000 },
    { dateIso: daysAgo(2), earnedMinorUnits: 26_000 },
    { dateIso: daysAgo(1), earnedMinorUnits: 15_500 },
    { dateIso: daysAgo(0), earnedMinorUnits: 4_000 },
  ],
};

export const mockNotifications: AppNotification[] = [
  {
    id: "n-6",
    title: "Lease overdue",
    body: "CX-BAT-007 was due back 12 hours ago. Return it to any kiosk.",
    createdAt: hoursAgo(12),
    severity: "danger",
    category: "lease",
    read: false,
  },
  {
    id: "n-5",
    title: "Lease ending soon",
    body: "CX-BAT-063 is due back in about 2 hours.",
    createdAt: hoursAgo(0.5),
    severity: "warning",
    category: "lease",
    read: false,
  },
  {
    id: "n-4",
    title: "Charging",
    body: "CX-BAT-014 is charging at Kiosk A.",
    createdAt: hoursAgo(0.05),
    severity: "info",
    category: "battery",
    read: false,
  },
  {
    id: "n-1",
    title: "Need more time?",
    body: "You can extend CX-BAT-063 from Leases before it is due.",
    createdAt: hoursAgo(0.4),
    severity: "info",
    category: "payment",
    read: true,
  },
  {
    id: "n-2",
    title: "Scheduled maintenance",
    body: "Kiosk B will be offline Sunday from 2:00 to 4:00 AM.",
    createdAt: daysAgo(2),
    severity: "info",
    category: "maintenance",
    read: true,
  },
  // Was a "Payment received" notice; without a demo label it would present a
  // fake payment as real (rules.md §4), so it is a non-payment item now.
  {
    id: "n-3",
    title: "Lease completed",
    body: "You returned CX-BAT-021 to Kiosk B on time.",
    createdAt: daysAgo(4),
    severity: "success",
    category: "lease",
    read: true,
  },
];

/** Arrives a while after the dashboard opens, to demo live notifications. */
export const mockIncomingNotification: AppNotification = {
  id: "n-7",
  title: "Battery health check",
  body: "CX-BAT-014 passed its health check: 96% health.",
  createdAt: hoursAgo(0),
  severity: "success",
  category: "maintenance",
  read: false,
};

/**
 * Advances the simulated battery by one tick. Randomness is passed in so the
 * first render never calls Math.random() (keeps hydration clean).
 */
export function simulateTick(battery: Battery, stepRoll: number, faultRoll: number): Battery {
  if (battery.status === "fault") return { ...battery, status: "charging" };
  if (faultRoll < 0.02) return { ...battery, status: "fault" };

  const step = 0.1 + stepRoll * 0.4;
  if (battery.status === "charging") {
    const chargePercent = Math.min(100, battery.chargePercent + step);
    return { ...battery, chargePercent, status: chargePercent >= 100 ? "idle" : "charging" };
  }
  if (battery.status === "in-use") {
    return { ...battery, chargePercent: Math.max(0, battery.chargePercent - step) };
  }
  return battery;
}

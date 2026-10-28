export type TradingDay = {
  dateIso: string;
  earnedMinorUnits: number;
};

export type TradingSummary = {
  earnedMinorUnits: number;
  kwhSold: number;
  openOffers: number;
  last7Days: TradingDay[];
};

export type NotificationSeverity = "info" | "success" | "warning" | "danger";

export type NotificationCategory = "battery" | "lease" | "payment" | "maintenance";

/** Named AppNotification to avoid clashing with the DOM `Notification` type. */
export type AppNotification = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  severity: NotificationSeverity;
  category: NotificationCategory;
  read: boolean;
};

export type QuickActionsContext = {
  trackedBatteryId: string | null;
  activeLease: { id: string; batteryLabel: string; kioskName: string } | null;
  overdueLeaseId: string | null;
};

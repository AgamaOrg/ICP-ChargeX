import type { BatteryStatus } from "@/lib/types/battery";

export type TradingTab = "market" | "tracking" | "portfolio";


export type EnergyOffer = {
  id: string;
  batteryLabel: string;
  sellerName: string;
  kioskName: string;
  distanceKm: number;
  /** Energy still available to buy, in kWh. */
  energyKwh: number;
  pricePerKwhMinorUnits: number;
  minPurchaseKwh: number;
  healthPercent: number;
  status: "open" | "sold-out";
  createdAt: string;
  mine: boolean;
};

export type TradeRecord = {
  id: string;
  batteryLabel: string;
  counterparty: string;
  side: "buy" | "sell";
  energyKwh: number;
  totalMinorUnits: number;
  executedAt: string;
};

export type PortfolioSummary = {
  earnedThisMonthMinorUnits: number;
  spentThisMonthMinorUnits: number;
  kwhTraded: number;
};

export type UsageDay = {
  dateIso: string;
  kwh: number;
};

export type MaintenanceSeverity = "info" | "success" | "warning" | "danger";

export type MaintenanceAlert = {
  id: string;
  severity: MaintenanceSeverity;
  title: string;
  body: string;
  dueAt: string | null;
};

export type BatteryTracking = {
  batteryId: string;
  batteryLabel: string;
  status: BatteryStatus;
  chargePercent: number;
  healthPercent: number;
  estimatedRangeKm: number;
  distanceKm: number;
  kioskName: string;
  locationLabel: string;
  lat: number;
  lng: number;
  updatedAt: string;
  usageLast7Days: UsageDay[];
  alerts: MaintenanceAlert[];
};

export type NewOfferInput = {
  batteryLabel: string;
  kioskName: string;
  energyKwh: number;
  pricePerKwhMinorUnits: number;
  healthPercent: number;
};

import { MOCK_NOW_MS, mockBatteries } from "@/lib/mock/fixtures";
import type {
  BatteryTracking,
  EnergyOffer,
  PortfolioSummary,
  TradeRecord,
} from "../types";

const hoursAgo = (hours: number) => new Date(MOCK_NOW_MS - hours * 3_600_000).toISOString();
const hoursFromNow = (hours: number) => new Date(MOCK_NOW_MS + hours * 3_600_000).toISOString();
const daysAgo = (days: number) => hoursAgo(days * 24);

/** Demo pack size used to estimate how much spare energy a battery can offer. */
export const mockBatteryCapacityKwh = 4.8;

export const mockMarketOffers: EnergyOffer[] = [
  {
    id: "offer-201",
    batteryLabel: "CX-BAT-021",
    sellerName: "Maria S.",
    kioskName: "Kiosk B",
    distanceKm: 2.4,
    energyKwh: 3.5,
    pricePerKwhMinorUnits: 1_850,
    minPurchaseKwh: 0.5,
    healthPercent: 91,
    status: "open",
    createdAt: hoursAgo(3),
    mine: false,
  },
  {
    id: "offer-202",
    batteryLabel: "CX-BAT-019",
    sellerName: "Juan D.",
    kioskName: "Kiosk A",
    distanceKm: 1.2,
    energyKwh: 4.2,
    pricePerKwhMinorUnits: 2_100,
    minPurchaseKwh: 1,
    healthPercent: 99,
    status: "open",
    createdAt: hoursAgo(1.5),
    mine: false,
  },
  {
    id: "offer-203",
    batteryLabel: "CX-BAT-058",
    sellerName: "Ana R.",
    kioskName: "Kiosk C",
    distanceKm: 3.1,
    energyKwh: 2,
    pricePerKwhMinorUnits: 1_700,
    minPurchaseKwh: 0.5,
    healthPercent: 64,
    status: "open",
    createdAt: hoursAgo(7),
    mine: false,
  },
  {
    id: "offer-204",
    batteryLabel: "CX-BAT-033",
    sellerName: "Kiosk C pool",
    kioskName: "Kiosk C",
    distanceKm: 3.1,
    energyKwh: 1.2,
    pricePerKwhMinorUnits: 1_950,
    minPurchaseKwh: 0.3,
    healthPercent: 83,
    status: "open",
    createdAt: hoursAgo(10),
    mine: false,
  },
  {
    id: "offer-205",
    batteryLabel: "CX-BAT-071",
    sellerName: "Mika T.",
    kioskName: "Kiosk E — Mall of Asia Arena North Parking",
    distanceKm: 8.9,
    energyKwh: 5,
    pricePerKwhMinorUnits: 2_300,
    minPurchaseKwh: 1,
    healthPercent: 88,
    status: "open",
    createdAt: hoursAgo(20),
    mine: false,
  },
  {
    id: "offer-301",
    batteryLabel: "CX-BAT-014",
    sellerName: "You",
    kioskName: "Kiosk A",
    distanceKm: 0,
    energyKwh: 2.4,
    pricePerKwhMinorUnits: 2_050,
    minPurchaseKwh: 0.5,
    healthPercent: 96,
    status: "open",
    createdAt: hoursAgo(5),
    mine: true,
  },
  {
    id: "offer-302",
    batteryLabel: "CX-BAT-063",
    sellerName: "You",
    kioskName: "Kiosk D",
    distanceKm: 0,
    energyKwh: 1.4,
    pricePerKwhMinorUnits: 2_250,
    minPurchaseKwh: 0.5,
    healthPercent: 93,
    status: "open",
    createdAt: hoursAgo(2),
    mine: true,
  },
];

export const mockTrades: TradeRecord[] = [
  {
    id: "trade-501",
    batteryLabel: "CX-BAT-021",
    counterparty: "Maria S.",
    side: "buy",
    energyKwh: 2,
    totalMinorUnits: 3_700,
    executedAt: daysAgo(2),
  },
  {
    id: "trade-502",
    batteryLabel: "CX-BAT-014",
    counterparty: "Ana R.",
    side: "sell",
    energyKwh: 1.5,
    totalMinorUnits: 2_775,
    executedAt: daysAgo(4),
  },
  {
    id: "trade-503",
    batteryLabel: "CX-BAT-019",
    counterparty: "Juan D.",
    side: "buy",
    energyKwh: 1,
    totalMinorUnits: 2_100,
    executedAt: daysAgo(6),
  },
  {
    id: "trade-504",
    batteryLabel: "CX-BAT-014",
    counterparty: "Kiosk C pool",
    side: "sell",
    energyKwh: 0.8,
    totalMinorUnits: 1_360,
    executedAt: daysAgo(9),
  },
];

export const mockPortfolioSummary: PortfolioSummary = {
  earnedThisMonthMinorUnits: 124_000,
  spentThisMonthMinorUnits: 38_500,
  kwhTraded: 12.4,
};

const trackedBattery = mockBatteries[0];

export const mockBatteryTracking: BatteryTracking | null = trackedBattery
  ? {
      batteryId: trackedBattery.id,
      batteryLabel: trackedBattery.label,
      status: trackedBattery.status,
      chargePercent: trackedBattery.chargePercent,
      healthPercent: trackedBattery.healthPercent,
      estimatedRangeKm: trackedBattery.estimatedRangeKm,
      distanceKm: trackedBattery.distanceKm,
      kioskName: trackedBattery.kioskName,
      locationLabel: trackedBattery.location.label,
      lat: trackedBattery.location.lat,
      lng: trackedBattery.location.lng,
      updatedAt: trackedBattery.updatedAt,
      usageLast7Days: [
        { dateIso: daysAgo(6), kwh: 1.2 },
        { dateIso: daysAgo(5), kwh: 2.4 },
        { dateIso: daysAgo(4), kwh: 1.8 },
        { dateIso: daysAgo(3), kwh: 3.1 },
        { dateIso: daysAgo(2), kwh: 2.6 },
        { dateIso: daysAgo(1), kwh: 0.9 },
        { dateIso: daysAgo(0), kwh: 1.5 },
      ],
      alerts: [
        {
          id: "alert-1",
          severity: "warning",
          title: "Needs a quick check",
          body: "The battery got hot twice this week. Bring it to Kiosk A within 3 days.",
          dueAt: hoursFromNow(72),
        },
        {
          id: "alert-2",
          severity: "info",
          title: "Battery updated",
          body: "Everything is working normally.",
          dueAt: null,
        },
      ],
    }
  : null;

/** Spare energy available to sell, estimated from the current charge. */
export function spareEnergyKwh(chargePercent: number, capacityKwh = mockBatteryCapacityKwh): number {
  const usable = Math.min(100, Math.max(0, chargePercent)) / 100;
  return Math.round(usable * capacityKwh * 10) / 10;
}

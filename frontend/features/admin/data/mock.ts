import { MOCK_NOW_MS } from "@/lib/mock/fixtures";
import type { Branch, FleetBattery, Rental, RentDuration } from "../types";

// Demo data for the rental admin. Names and numbers are made up; times are
// relative to MOCK_NOW so the first render is deterministic. Marking a rental
// as returned changes in-memory state only and resets on reload.
const hoursFromNow = (hours: number) => new Date(MOCK_NOW_MS + hours * 3_600_000).toISOString();

export const mockAdminName = "Rental admin";

export const mockRentals: Rental[] = [
  {
    id: "r-1001",
    riderName: "Mario Santos",
    riderPhone: "0900 000 0142",
    batteryId: "bat-007",
    batteryLabel: "CX-BAT-007",
    kioskName: "Kiosk C",
    startedAt: hoursFromNow(-36),
    dueAt: hoursFromNow(-12),
    returnedAt: null,
    costMinorUnits: 30_000,
  },
  {
    id: "r-1002",
    riderName: "Danilo Bautista",
    riderPhone: "0900 000 0188",
    batteryId: "bat-025",
    batteryLabel: "CX-BAT-025",
    kioskName: "Kiosk B",
    startedAt: hoursFromNow(-27),
    dueAt: hoursFromNow(-3),
    returnedAt: null,
    costMinorUnits: 60_000,
  },
  {
    id: "r-1003",
    riderName: "Lorna Reyes",
    riderPhone: "0900 000 0177",
    batteryId: "bat-063",
    batteryLabel: "CX-BAT-063",
    kioskName: "Kiosk D",
    startedAt: hoursFromNow(-22),
    dueAt: hoursFromNow(2),
    returnedAt: null,
    costMinorUnits: 24_000,
  },
  {
    id: "r-1004",
    riderName: "Rosa Villanueva",
    riderPhone: "0900 000 0123",
    batteryId: "bat-031",
    batteryLabel: "CX-BAT-031",
    kioskName: "Kiosk A",
    startedAt: hoursFromNow(-2),
    dueAt: hoursFromNow(6),
    returnedAt: null,
    costMinorUnits: 20_000,
  },
  {
    id: "r-1005",
    riderName: "Jun Mendoza",
    riderPhone: "0900 000 0165",
    batteryId: "bat-046",
    batteryLabel: "CX-BAT-046",
    kioskName: "Kiosk E",
    startedAt: hoursFromNow(-4),
    dueAt: hoursFromNow(20),
    returnedAt: null,
    costMinorUnits: 60_000,
  },
  {
    id: "r-1006",
    riderName: "Alex Cruz",
    riderPhone: "0900 000 0101",
    batteryId: "bat-014",
    batteryLabel: "CX-BAT-014",
    kioskName: "Kiosk A",
    startedAt: hoursFromNow(-24),
    dueAt: hoursFromNow(48),
    returnedAt: null,
    costMinorUnits: 12_000,
  },
  {
    id: "r-0998",
    riderName: "Celia Ramos",
    riderPhone: "0900 000 0119",
    batteryId: "bat-019",
    batteryLabel: "CX-BAT-019",
    kioskName: "Kiosk A",
    startedAt: hoursFromNow(-29),
    dueAt: hoursFromNow(-5),
    returnedAt: hoursFromNow(-5.5),
    costMinorUnits: 60_000,
  },
  {
    id: "r-0991",
    riderName: "Ben Torres",
    riderPhone: "0900 000 0153",
    batteryId: "bat-071",
    batteryLabel: "CX-BAT-071",
    kioskName: "Kiosk E",
    startedAt: hoursFromNow(-54),
    dueAt: hoursFromNow(-30),
    returnedAt: hoursFromNow(-29),
    costMinorUnits: 62_500,
  },
  {
    id: "r-0984",
    riderName: "Ana Lim",
    riderPhone: "0900 000 0131",
    batteryId: "bat-021",
    batteryLabel: "CX-BAT-021",
    kioskName: "Kiosk B",
    startedAt: hoursFromNow(-120),
    dueAt: hoursFromNow(-96),
    returnedAt: hoursFromNow(-97),
    costMinorUnits: 60_000,
  },
];

export const mockFleet: FleetBattery[] = [
  { id: "bat-014", label: "CX-BAT-014", kioskName: "Kiosk A", chargePercent: 78, pricePerHourMinorUnits: 2_500, inRepair: false },
  { id: "bat-019", label: "CX-BAT-019", kioskName: "Kiosk A", chargePercent: 100, pricePerHourMinorUnits: 2_500, inRepair: false },
  { id: "bat-031", label: "CX-BAT-031", kioskName: "Kiosk A", chargePercent: 64, pricePerHourMinorUnits: 2_500, inRepair: false },
  { id: "bat-021", label: "CX-BAT-021", kioskName: "Kiosk B", chargePercent: 92, pricePerHourMinorUnits: 2_500, inRepair: false },
  { id: "bat-025", label: "CX-BAT-025", kioskName: "Kiosk B", chargePercent: 40, pricePerHourMinorUnits: 2_500, inRepair: false },
  { id: "bat-042", label: "CX-BAT-042", kioskName: "Kiosk B", chargePercent: 61, pricePerHourMinorUnits: 2_500, inRepair: true },
  { id: "bat-007", label: "CX-BAT-007", kioskName: "Kiosk C", chargePercent: 12, pricePerHourMinorUnits: 2_500, inRepair: false },
  { id: "bat-033", label: "CX-BAT-033", kioskName: "Kiosk C", chargePercent: 18, pricePerHourMinorUnits: 2_500, inRepair: false },
  { id: "bat-058", label: "CX-BAT-058", kioskName: "Kiosk C", chargePercent: 99, pricePerHourMinorUnits: 2_500, inRepair: false },
  { id: "bat-063", label: "CX-BAT-063", kioskName: "Kiosk D", chargePercent: 31, pricePerHourMinorUnits: 2_500, inRepair: false },
  { id: "bat-046", label: "CX-BAT-046", kioskName: "Kiosk E", chargePercent: 55, pricePerHourMinorUnits: 2_500, inRepair: false },
  { id: "bat-071", label: "CX-BAT-071", kioskName: "Kiosk E", chargePercent: 85, pricePerHourMinorUnits: 2_500, inRepair: false },
];

export const mockBranches: Branch[] = [
  { name: "Kiosk A", code: "A", address: "Ayala Triangle Gardens, Makati", lat: 14.5567, lng: 121.0244 },
  { name: "Kiosk B", code: "B", address: "BGC High Street, Taguig", lat: 14.5509, lng: 121.0503 },
  { name: "Kiosk C", code: "C", address: "Power Plant Mall, Rockwell", lat: 14.5649, lng: 121.0365 },
  { name: "Kiosk D", code: "D", address: "Ortigas Center, Pasig", lat: 14.5869, lng: 121.0614 },
  { name: "Kiosk E", code: "E", address: "Mall of Asia Arena, Pasay", lat: 14.5352, lng: 120.9822 },
];

export const mockRentDurations: RentDuration[] = [
  { id: "1h", label: "1 hour", hours: 1 },
  { id: "1d", label: "1 day", hours: 24 },
  { id: "1w", label: "1 week", hours: 168 },
];

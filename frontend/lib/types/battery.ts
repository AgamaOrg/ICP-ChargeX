/** What the battery is physically doing right now. */
export type BatteryStatus = "charging" | "in-use" | "idle" | "fault";

/** Whether the battery can be leased. Independent of `BatteryStatus`. */
export type BatteryAvailability = "available" | "leased" | "maintenance";

export type Battery = {
  id: string;
  label: string;
  status: BatteryStatus;
  availability: BatteryAvailability;
  chargePercent: number;
  healthPercent: number;
  location: { lat: number; lng: number; label: string };
  kioskName: string;
  distanceKm: number;
  estimatedRangeKm: number;
  pricePerHourMinorUnits: number;
  /** ISO string; format at render. */
  updatedAt: string;
};

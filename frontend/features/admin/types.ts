/** One battery handed out to a rider, as the rental admin sees it. */
export type Rental = {
  id: string;
  riderName: string;
  riderPhone: string;
  batteryId: string;
  batteryLabel: string;
  kioskName: string;
  /** ISO strings; format at render. */
  startedAt: string;
  dueAt: string;
  /** `null` while the battery is still out. */
  returnedAt: string | null;
  costMinorUnits: number;
};

/** Derived from the times, never stored: see status.ts. */
export type RentalStatus = "out" | "due-soon" | "late" | "returned";

/** A battery the rental owns. Whether it is out comes from the rentals. */
export type FleetBattery = {
  id: string;
  label: string;
  kioskName: string;
  chargePercent: number;
  pricePerHourMinorUnits: number;
  inRepair: boolean;
};

/** A kiosk where batteries are picked up and returned. */
export type Branch = {
  name: string;
  /** Short label for map pins, e.g. "A". */
  code: string;
  address: string;
  lat: number;
  lng: number;
};

export type RentDuration = { id: string; label: string; hours: number };

export type RentInput = {
  riderName: string;
  riderPhone: string;
  batteryId: string;
  durationId: string;
};

export type RentErrors = Partial<Record<keyof RentInput, string>>;

export type StockStatus = "ready" | "out" | "repair";

export type RentalTab = "out" | "returned";

/** Which admin tab is showing; held in `?view=`. */
export type AdminView = "home" | "rentals" | "batteries" | "map";

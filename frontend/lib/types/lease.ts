export type LeaseStatus = "active" | "ending-soon" | "overdue" | "completed";

export type Lease = {
  id: string;
  batteryId: string;
  batteryLabel: string;
  kioskName: string;
  /** ISO strings; format at render. */
  startedAt: string;
  endsAt: string;
  status: LeaseStatus;
  costMinorUnits: number;
  pricePerHourMinorUnits: number;
  currency: "PHP";
};

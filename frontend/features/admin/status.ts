import type { StatusTone } from "@/components/ui/status-pill";
import { formatRelative } from "@/lib/format";
import type { FleetBattery, Rental, RentalStatus, StockStatus } from "./types";

/** A rental this close to its due time counts as "due soon". */
const DUE_SOON_MS = 3 * 3_600_000;

export function rentalStatus(rental: Rental, nowMs: number): RentalStatus {
  if (rental.returnedAt) return "returned";
  const due = Date.parse(rental.dueAt);
  if (due < nowMs) return "late";
  return due - nowMs <= DUE_SOON_MS ? "due-soon" : "out";
}

export const RENTAL_PILL: Record<RentalStatus, { tone: StatusTone; label: string }> = {
  late: { tone: "danger", label: "Late" },
  "due-soon": { tone: "warning", label: "Due soon" },
  out: { tone: "success", label: "Out" },
  returned: { tone: "neutral", label: "Returned" },
};

/** "Was due 12 hours ago", "Due in 2 hours", "Returned 4 days ago". */
export function dueText(rental: Rental, nowMs: number): string {
  if (rental.returnedAt) return `Returned ${formatRelative(rental.returnedAt, nowMs)}`;
  const when = formatRelative(rental.dueAt, nowMs);
  return Date.parse(rental.dueAt) < nowMs ? `Was due ${when}` : `Due ${when}`;
}

const URGENCY: Record<RentalStatus, number> = { late: 0, "due-soon": 1, out: 2, returned: 3 };

/** Late first, then soonest due; returned ones newest first. */
export function byUrgency(nowMs: number) {
  return (a: Rental, b: Rental) =>
    URGENCY[rentalStatus(a, nowMs)] - URGENCY[rentalStatus(b, nowMs)] ||
    (a.returnedAt && b.returnedAt
      ? Date.parse(b.returnedAt) - Date.parse(a.returnedAt)
      : Date.parse(a.dueAt) - Date.parse(b.dueAt));
}

export function stockStatus(battery: FleetBattery, rentals: Rental[]): StockStatus {
  if (battery.inRepair) return "repair";
  return rentals.some((r) => r.batteryId === battery.id && !r.returnedAt) ? "out" : "ready";
}

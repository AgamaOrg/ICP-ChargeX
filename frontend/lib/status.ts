import type { StatusTone } from "@/components/ui/status-pill";
import type { BatteryAvailability, BatteryStatus } from "@/lib/types/battery";
import type { LeaseStatus } from "@/lib/types/lease";

type PillSpec = { tone: StatusTone; label: string };

export const BATTERY_STATUS_PILL: Record<BatteryStatus, PillSpec> = {
  charging: { tone: "info", label: "Charging" },
  "in-use": { tone: "success", label: "In use" },
  idle: { tone: "neutral", label: "Idle" },
  fault: { tone: "danger", label: "Fault" },
};

export const AVAILABILITY_PILL: Record<BatteryAvailability, PillSpec> = {
  available: { tone: "success", label: "Available" },
  leased: { tone: "neutral", label: "Leased" },
  maintenance: { tone: "danger", label: "In maintenance" },
};

export const LEASE_STATUS_PILL: Record<LeaseStatus, PillSpec> = {
  active: { tone: "success", label: "Active" },
  "ending-soon": { tone: "warning", label: "Due soon" },
  overdue: { tone: "danger", label: "Late" },
  completed: { tone: "neutral", label: "Returned" },
};

const LEASE_URGENCY: Record<LeaseStatus, number> = { overdue: 0, "ending-soon": 1, active: 2, completed: 3 };

/** Overdue first, then ending soon, then active; ties by end time. */
export function byLeaseUrgency(a: { status: LeaseStatus; endsAt: string }, b: { status: LeaseStatus; endsAt: string }) {
  return LEASE_URGENCY[a.status] - LEASE_URGENCY[b.status] || Date.parse(a.endsAt) - Date.parse(b.endsAt);
}

/**
 * Health as one plain word, for screens where a percentage is too technical.
 * Health stays a separate idea from charge; this only changes how it reads.
 */
export function batteryCondition(healthPercent: number): string {
  if (healthPercent >= 80) return "Good";
  if (healthPercent >= 60) return "Fair";
  return "Worn";
}

import type { DurationOption, PaymentMethod, SimulatedResult, StartOption } from "../types";

export { mockBatteries } from "@/lib/mock/fixtures";

export const DEFAULT_RADIUS_KM = 5;
export const WIDE_RADIUS_KM = 15;

/** Shown when location access is unavailable or denied. */
// Demo stand-in for the rider's position until location is shared.
export const mockFallbackLocationLabel = "Makati";

export const mockDurationOptions: DurationOption[] = [
  { id: "1h", label: "1 hour", hours: 1 },
  { id: "1d", label: "1 day", hours: 24 },
  { id: "1w", label: "1 week", hours: 168 },
];

export const mockStartOptions: StartOption[] = [
  { id: "now", label: "Now", offsetHours: 0 },
  { id: "in-1h", label: "In 1 hour", offsetHours: 1 },
  { id: "in-3h", label: "In 3 hours", offsetHours: 3 },
];

export const mockExtendOptions: DurationOption[] = [
  { id: "1h", label: "1 more hour", hours: 1 },
  { id: "1d", label: "1 more day", hours: 24 },
];

export const mockIssueTypes = [
  "Battery won't charge",
  "Battery is damaged",
  "Problem at the kiosk",
  "Something else",
] as const;

export const mockPaymentMethods: PaymentMethod[] = [
  { id: "demo-wallet", label: "Demo wallet", detail: "Balance ₱2,500.00 (demo)" },
  { id: "demo-card", label: "Demo card", detail: "Card ending 4242 (demo)" },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Holds the battery before payment. Fails only when the demo asks it to. */
export async function simulateReservation(shouldFail: boolean): Promise<SimulatedResult<null>> {
  await delay(500);
  return shouldFail
    ? { ok: false, message: "We couldn't hold this battery for you. Try again." }
    : { ok: true, value: null };
}

/** Demo payment: succeeds about 80% of the time. No money moves. */
export async function simulatePayment(): Promise<SimulatedResult<{ reference: string }>> {
  await delay(1_200);
  if (Math.random() < 0.8) {
    return { ok: true, value: { reference: `DEMO-${Math.floor(100_000 + Math.random() * 900_000)}` } };
  }
  return {
    ok: false,
    message: "The payment didn't go through and you weren't charged. Try again or choose another method.",
  };
}

/** Lease actions (extend, return, report) succeed about 90% of the time. */
export async function simulateLeaseAction(): Promise<SimulatedResult<null>> {
  await delay(700);
  return Math.random() < 0.9
    ? { ok: true, value: null }
    : { ok: false, message: "That didn't work. Check your connection and try again." };
}

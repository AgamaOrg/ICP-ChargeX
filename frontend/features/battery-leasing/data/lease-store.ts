import { mockLeases } from "@/lib/mock/fixtures";
import type { Lease } from "@/lib/types/lease";

// In-memory lease list shared by the wizard and the lease panel. It lives in
// this module, so it survives client-side navigation but a page reload resets
// it to the fixtures. Nothing is persisted.
let leases: Lease[] = mockLeases;
const listeners = new Set<() => void>();

const ENDING_SOON_HOURS = 3;

function setLeases(next: Lease[]) {
  leases = next;
  listeners.forEach((listener) => listener());
}

export const getLeases = () => leases;
export const getServerLeases = () => mockLeases;

export function subscribeLeases(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function statusForEnd(endsAtMs: number, nowMs: number): Lease["status"] {
  if (endsAtMs <= nowMs) return "overdue";
  return endsAtMs - nowMs <= ENDING_SOON_HOURS * 3_600_000 ? "ending-soon" : "active";
}

export function addLease(lease: Lease) {
  setLeases([lease, ...leases]);
}

export function extendLease(id: string, hours: number, nowMs: number) {
  setLeases(
    leases.map((lease) => {
      if (lease.id !== id) return lease;
      const endsAtMs = Date.parse(lease.endsAt) + hours * 3_600_000;
      return {
        ...lease,
        endsAt: new Date(endsAtMs).toISOString(),
        costMinorUnits: lease.costMinorUnits + hours * lease.pricePerHourMinorUnits,
        status: statusForEnd(endsAtMs, nowMs),
      };
    }),
  );
}

export function returnLease(id: string, nowMs: number) {
  setLeases(
    leases.map((lease) =>
      lease.id === id ? { ...lease, status: "completed", endsAt: new Date(nowMs).toISOString() } : lease,
    ),
  );
}

"use client";

import { useState } from "react";
import { extendLease, returnLease } from "../data/lease-store";
import { simulateLeaseAction } from "../data/mock";
import type { LeaseAction } from "../types";

export type LeaseActionState =
  | { status: "idle" }
  | { status: "working"; action: LeaseAction }
  | { status: "error"; action: LeaseAction; message: string }
  | { status: "done"; action: LeaseAction; message: string };

type RunOptions = { hours?: number; hoursLabel?: string };

export function useLeaseActions(nowMs: number) {
  const [state, setState] = useState<LeaseActionState>({ status: "idle" });

  async function run(action: LeaseAction, leaseId: string, options: RunOptions = {}): Promise<boolean> {
    if (state.status === "working") return false;
    setState({ status: "working", action });
    const result = await simulateLeaseAction();
    if (!result.ok) {
      setState({ status: "error", action, message: result.message });
      return false;
    }
    let message = "";
    if (action === "extend") {
      extendLease(leaseId, options.hours ?? 1, nowMs);
      message = `Lease extended by ${options.hoursLabel ?? "1 hour"}. Demo only — no real payment is processed.`;
    } else if (action === "return") {
      returnLease(leaseId, nowMs);
      message = "Lease ended. Bring the battery to any kiosk within 30 minutes.";
    } else {
      message = "Thanks, we've noted the issue. Demo only — nothing was sent.";
    }
    setState({ status: "done", action, message });
    return true;
  }

  return { state, run, clearError: () => setState({ status: "idle" }) };
}

"use client";

import { useRef, useState } from "react";
import { MOCK_NOW_MS } from "@/lib/mock/fixtures";
import { useDemoScenario } from "@/lib/mock/use-simulated-load";
import type { Battery } from "@/lib/types/battery";
import { addLease, statusForEnd } from "../data/lease-store";
import { simulatePayment, simulateReservation } from "../data/mock";
import type { DurationOption, PaymentMethod, PaymentState, StartOption } from "../types";

type ReservationState = { status: "idle" } | { status: "submitting" } | { status: "error"; message: string };

/** Holds the battery before payment. With ?demo=error the first try fails. */
export function useReservation() {
  const scenario = useDemoScenario();
  const attempts = useRef(0);
  const [state, setState] = useState<ReservationState>({ status: "idle" });

  async function reserve(): Promise<boolean> {
    if (state.status === "submitting") return false;
    setState({ status: "submitting" });
    const result = await simulateReservation(scenario === "error" && attempts.current === 0);
    attempts.current += 1;
    setState(result.ok ? { status: "idle" } : { status: "error", message: result.message });
    return result.ok;
  }

  return { state, reserve };
}

export type CheckoutOrder = {
  battery: Battery;
  duration: DurationOption;
  start: StartOption;
  totalMinorUnits: number;
};

/** Simulated payment. On success the lease is added to the in-memory store. */
export function usePayment() {
  const [state, setState] = useState<PaymentState>({ status: "idle" });
  // A ref, not state, so a fast double tap can't start two payments.
  const inFlight = useRef(false);

  async function pay(order: CheckoutOrder, method: PaymentMethod) {
    if (inFlight.current) return;
    inFlight.current = true;
    setState({ status: "processing" });
    const result = await simulatePayment();
    inFlight.current = false;

    if (!result.ok) {
      setState({ status: "failure", message: result.message });
      return;
    }
    const startMs = MOCK_NOW_MS + order.start.offsetHours * 3_600_000;
    const endMs = startMs + order.duration.hours * 3_600_000;
    const leaseId = `lease-${result.value.reference.replace("DEMO-", "")}`;
    addLease({
      id: leaseId,
      batteryId: order.battery.id,
      batteryLabel: order.battery.label,
      kioskName: order.battery.kioskName,
      startedAt: new Date(startMs).toISOString(),
      endsAt: new Date(endMs).toISOString(),
      status: statusForEnd(endMs, MOCK_NOW_MS),
      costMinorUnits: order.totalMinorUnits,
      pricePerHourMinorUnits: order.battery.pricePerHourMinorUnits,
      currency: "PHP",
    });
    setState({
      status: "success",
      receipt: {
        reference: result.value.reference,
        paidAt: new Date(MOCK_NOW_MS).toISOString(),
        leaseId,
        totalMinorUnits: order.totalMinorUnits,
        methodLabel: method.label,
      },
    });
  }

  return {
    state,
    pay,
    cancel: () => setState({ status: "cancelled" }),
    reset: () => setState({ status: "idle" }),
  };
}

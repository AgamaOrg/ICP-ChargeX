"use client";

import { useEffect, useState } from "react";
import { MOCK_NOW_MS } from "@/lib/mock/fixtures";
import type { BatteryTracking } from "../types";

/**
 * Simulated live telemetry and GPS drift. Real hardware data will replace
 * this hook's internals; the tracking screen keeps the same shape.
 */
export function useBatteryTracking(initial: BatteryTracking, intervalMs = 4_000) {
  const [tracking, setTracking] = useState(initial);
  const [updatedAtMs, setUpdatedAtMs] = useState(MOCK_NOW_MS);

  useEffect(() => {
    const startedAt = Date.now();
    const id = setInterval(() => {
      setTracking((current) => {
        const step = 0.1 + Math.random() * 0.2;
        const chargePercent =
          current.status === "charging"
            ? Math.min(100, current.chargePercent + step)
            : current.status === "in-use"
              ? Math.max(0, current.chargePercent - step)
              : current.chargePercent;
        const drift = (Math.random() - 0.5) * 0.00006;

        return {
          ...current,
          chargePercent,
          status: chargePercent >= 100 ? "idle" : current.status,
          lat: current.lat + drift,
          lng: current.lng + drift * 0.8,
          updatedAt: new Date().toISOString(),
        };
      });
      setUpdatedAtMs(MOCK_NOW_MS + Date.now() - startedAt);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return { tracking, updatedAtMs };
}

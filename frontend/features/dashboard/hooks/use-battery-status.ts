"use client";

import { useEffect, useState } from "react";
import { MOCK_NOW_MS } from "@/lib/mock/fixtures";
import type { Battery } from "@/lib/types/battery";
import { simulateTick } from "../data/mock";

/**
 * Simulated live telemetry. When real telemetry lands, replace this hook's
 * internals; the card that consumes it keeps the same shape.
 */
export function useBatteryStatus(initial: Battery, intervalMs = 5_000) {
  const [battery, setBattery] = useState(initial);
  const [updatedAtMs, setUpdatedAtMs] = useState(MOCK_NOW_MS);

  useEffect(() => {
    const startedAt = Date.now();
    const id = setInterval(() => {
      setBattery((current) => simulateTick(current, Math.random(), Math.random()));
      setUpdatedAtMs(MOCK_NOW_MS + Date.now() - startedAt);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return { battery, updatedAtMs };
}

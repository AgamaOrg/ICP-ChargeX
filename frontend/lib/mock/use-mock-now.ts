"use client";

import { useEffect, useState } from "react";
import { MOCK_NOW_MS } from "./fixtures";

/**
 * The demo clock: starts at MOCK_NOW (deterministic first paint) and then
 * advances with real elapsed time so relative labels update.
 */
export function useMockNow(tickMs = 30_000) {
  const [now, setNow] = useState(MOCK_NOW_MS);

  useEffect(() => {
    const startedAt = Date.now();
    const id = setInterval(() => setNow(MOCK_NOW_MS + Date.now() - startedAt), tickMs);
    return () => clearInterval(id);
  }, [tickMs]);

  return now;
}

"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export type DemoScenario = "loading" | "empty" | "error";

export type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; forceEmpty: boolean };

/**
 * Reads `?demo=loading|empty|error` so every UI state can be reached in the
 * demo. Callers must sit inside a <Suspense> boundary (useSearchParams).
 */
export function useDemoScenario(): DemoScenario | null {
  const value = useSearchParams().get("demo");
  return value === "loading" || value === "empty" || value === "error" ? value : null;
}

/**
 * Simulates fetching mock data: a short loading phase, then ready. With
 * `?demo=error` the first attempt fails so the retry path can be exercised.
 * Real adapters will replace this hook's internals, not its callers.
 */
export function useSimulatedLoad(errorMessage: string, delayMs = 500) {
  const scenario = useDemoScenario();
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    if (scenario === "loading") return;
    const id = setTimeout(() => {
      setState(
        scenario === "error" && attempt === 0
          ? { status: "error", message: errorMessage }
          : { status: "ready", forceEmpty: scenario === "empty" },
      );
    }, delayMs);
    return () => clearTimeout(id);
  }, [scenario, attempt, errorMessage, delayMs]);

  function retry() {
    setState({ status: "loading" });
    setAttempt((n) => n + 1);
  }

  return { state, retry };
}

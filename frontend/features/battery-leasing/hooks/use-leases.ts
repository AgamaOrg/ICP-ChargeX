"use client";

import { useSyncExternalStore } from "react";
import { getLeases, getServerLeases, subscribeLeases } from "../data/lease-store";

export function useLeases() {
  return useSyncExternalStore(subscribeLeases, getLeases, getServerLeases);
}

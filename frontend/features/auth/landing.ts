import type { AccountRole } from "./types";

/** Where each role lands after login. */
export const LANDING_BY_ROLE: Record<AccountRole, string> = {
  rider: "/dashboard",
  admin: "/admin",
};

import type { RentErrors, RentInput } from "./types";

// Philippine mobile numbers: 09XXXXXXXXX or +639XXXXXXXXX, spaces and dashes allowed.
const PH_MOBILE = /^(09|\+639)\d{9}$/;

export const normalizePhone = (value: string) => value.replace(/[\s-]/g, "");

export function validateRent(input: RentInput): RentErrors {
  const errors: RentErrors = {};
  if (!input.riderName.trim()) errors.riderName = "Enter the rider's name.";
  if (!PH_MOBILE.test(normalizePhone(input.riderPhone))) {
    errors.riderPhone = "Enter an 11-digit mobile number, like 0917 123 4567.";
  }
  if (!input.batteryId) errors.batteryId = "Choose a battery.";
  if (!input.durationId) errors.durationId = "Choose how long.";
  return errors;
}

/** Field order, so the first error gets focus. */
export const RENT_FIELDS: Array<keyof RentInput> = ["riderName", "riderPhone", "batteryId", "durationId"];

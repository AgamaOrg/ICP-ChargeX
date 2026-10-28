// All user-facing formatting goes through Intl (rules.md §4). The time zone
// is pinned so server and client render identical strings.
const LOCALE = "en-PH";
const TIME_ZONE = "Asia/Manila";

const currency = new Intl.NumberFormat(LOCALE, { style: "currency", currency: "PHP" });
const percent = new Intl.NumberFormat(LOCALE, { style: "percent", maximumFractionDigits: 0 });
const decimal = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 1 });
const kilometers = new Intl.NumberFormat(LOCALE, {
  style: "unit",
  unit: "kilometer",
  maximumFractionDigits: 1,
});
const kilowattHours = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 1 });
const dateTime = new Intl.DateTimeFormat(LOCALE, {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: TIME_ZONE,
});
const weekday = new Intl.DateTimeFormat(LOCALE, { weekday: "short", timeZone: TIME_ZONE });
const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export const clampPercent = (value: number) => Math.min(100, Math.max(0, value));

export const formatMoney = (minorUnits: number) => currency.format(minorUnits / 100);

/** Whole-number percent, e.g. 78 → "78%". */
export const formatPercent = (value: number) => percent.format(clampPercent(value) / 100);

export const formatNumber = (value: number) => decimal.format(value);

export const formatDistance = (km: number) => kilometers.format(km);

/** "2.4 kWh". */
export const formatEnergy = (kwh: number) => `${kilowattHours.format(kwh)} kWh`;

export const formatDateTime = (iso: string) => dateTime.format(new Date(iso));

export const formatWeekday = (iso: string) => weekday.format(new Date(iso));

/** "just now", "in 2 days", "12 hours ago". */
export function formatRelative(iso: string, nowMs: number): string {
  const seconds = Math.round((Date.parse(iso) - nowMs) / 1000);
  if (Math.abs(seconds) < 45) return "just now";
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["day", 86_400],
    ["hour", 3_600],
    ["minute", 60],
  ];
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit);
  }
  return relative.format(seconds, "second");
}

/** "45 min", "3 hours", "2 days". */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${Math.max(1, Math.round(minutes))} min`;
  const hours = minutes / 60;
  if (hours < 24) {
    const h = Math.round(hours);
    return `${h} ${h === 1 ? "hour" : "hours"}`;
  }
  const d = Math.round(hours / 24);
  return `${d} ${d === 1 ? "day" : "days"}`;
}

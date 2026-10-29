import { notFound } from "next/navigation";

// TRADING PAUSED (2026-10-29): the Trade screen is hidden at the product
// owner's request, not deleted. features/trading/ is untouched. To restore,
// remove notFound() below, uncomment the original page, and uncomment the
// Trade item in components/common/bottom-nav.tsx and the trading card in
// features/dashboard/dashboard.tsx (search for "TRADING PAUSED").
//
// A deliberate 404 has no UI to validate, so opt this segment out of instant
// navigation validation. Without this, dev logs an error every time the
// paused route is requested.
export const instant = false;

// import type { Metadata } from "next";
// import Trading from "@/features/trading/trading";
//
// export const metadata: Metadata = {
//   title: "Energy trading",
// };
//
// export default function TradingPage() {
//   return <Trading />;
// }

export default function TradingPage() {
  notFound();
}

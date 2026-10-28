import type { Metadata } from "next";
import Trading from "@/features/trading/trading";

export const metadata: Metadata = {
  title: "Energy trading",
};

export default function TradingPage() {
  return <Trading />;
}

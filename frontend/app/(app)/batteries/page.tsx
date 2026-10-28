import type { Metadata } from "next";
import BatteryLeasing from "@/features/battery-leasing/battery-leasing";

export const metadata: Metadata = {
  title: "Find a battery",
};

export default function BatteriesPage() {
  return <BatteryLeasing />;
}

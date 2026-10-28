import type { Metadata } from "next";
import { LeasesScreen } from "@/features/battery-leasing/battery-leasing";

export const metadata: Metadata = {
  title: "Your leases",
};

export default function LeasesPage() {
  return <LeasesScreen />;
}

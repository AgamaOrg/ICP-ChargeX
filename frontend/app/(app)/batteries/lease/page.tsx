import type { Metadata } from "next";
import { LeaseWizardScreen } from "@/features/battery-leasing/battery-leasing";

export const metadata: Metadata = {
  title: "Lease a battery",
};

export default function LeaseBatteryPage() {
  return <LeaseWizardScreen />;
}

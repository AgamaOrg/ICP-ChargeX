import { Suspense } from "react";
import { PageHeader } from "@/components/common/page-header";
import { LoadingRegion, Skeleton } from "@/components/ui/skeleton";
import { BatteryFinder, FinderSkeleton } from "./components/battery-finder";
import { LeasePanel, LeasePanelSkeleton } from "./components/lease-panel/lease-panel";
import { LeaseWizard } from "./components/lease-wizard/wizard";
import {
  DEFAULT_RADIUS_KM,
  mockBatteries,
  mockDurationOptions,
  mockExtendOptions,
  mockFallbackLocationLabel,
  mockIssueTypes,
  mockPaymentMethods,
  mockStartOptions,
  WIDE_RADIUS_KM,
} from "./data/mock";

// Client islands below read search params (?battery=, ?tab=, ?demo=), so each
// sits in a Suspense boundary whose fallback is its skeleton.

/** /batteries — find a battery (list + map preview) and open its details. */
export default function BatteryLeasing() {
  return (
    <>
      <PageHeader title="Find a battery" />
      <Suspense
        fallback={
          <div className="px-4">
            <FinderSkeleton />
          </div>
        }
      >
        <BatteryFinder
          batteries={mockBatteries}
          defaultRadiusKm={DEFAULT_RADIUS_KM}
          wideRadiusKm={WIDE_RADIUS_KM}
          fallbackLocationLabel={mockFallbackLocationLabel}
        />
      </Suspense>
    </>
  );
}

/** /batteries/lease — lease wizard followed by the simulated payment. */
export function LeaseWizardScreen() {
  return (
    <>
      <PageHeader title="Lease a battery" />
      <Suspense
        fallback={
          <div className="px-4">
            <LoadingRegion label="Loading lease">
              <div className="flex flex-col gap-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            </LoadingRegion>
          </div>
        }
      >
        <LeaseWizard
          batteries={mockBatteries}
          durationOptions={mockDurationOptions}
          startOptions={mockStartOptions}
          paymentMethods={mockPaymentMethods}
        />
      </Suspense>
    </>
  );
}

/** /leases — manage existing leases. */
export function LeasesScreen() {
  return (
    <>
      <PageHeader title="My leases" />
      <div className="px-4 pb-6">
        <Suspense fallback={<LeasePanelSkeleton />}>
          <LeasePanel extendOptions={mockExtendOptions} issueTypes={mockIssueTypes} />
        </Suspense>
      </div>
    </>
  );
}

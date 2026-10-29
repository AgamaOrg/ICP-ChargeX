"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingRegion, Skeleton } from "@/components/ui/skeleton";
import { formatDateTime } from "@/lib/format";
import { BrandHeader, LogoutLink } from "@/components/common/brand-header";
import { useMockNow } from "@/lib/mock/use-mock-now";
import { useSimulatedLoad } from "@/lib/mock/use-simulated-load";
import { byUrgency, rentalStatus, stockStatus } from "../status";
import type { AdminView, Branch, FleetBattery, Rental, RentalTab, RentDuration, RentInput } from "../types";
import { normalizePhone } from "../validation";
import { AdminHome } from "./admin-home";
import { AdminNav } from "./admin-nav";
import { AvailableBatteries } from "./available-batteries";
import type { BranchStock } from "./branch-card";
import { RentFormSheet } from "./rent-form-sheet";
import { RentalList } from "./rental-list";
import { RentalSheet } from "./rental-sheet";

type AdminWorkspaceProps = {
  adminName: string;
  initialRentals: Rental[];
  fleet: FleetBattery[];
  branches: Branch[];
  durations: RentDuration[];
};

const VIEWS: AdminView[] = ["home", "rentals", "batteries", "map"];
const VIEW_TITLE: Record<Exclude<AdminView, "home">, string> = {
  rentals: "Rentals",
  batteries: "Available batteries",
  map: "Branch map",
};
const TAB_LABEL: Record<RentalTab, string> = { out: "Out now", returned: "Returned" };

export function AdminWorkspace({ adminName, initialRentals, fleet, branches, durations }: AdminWorkspaceProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { state, retry } = useSimulatedLoad("We couldn't load the rentals. Check your connection and try again.");
  const now = useMockNow();
  // In-memory only: renting out and "Mark as returned" edit this copy, and a
  // reload resets it. No payment or kiosk is involved.
  const [rentals, setRentals] = useState(initialRentals);
  const [notice, setNotice] = useState("");
  const [rentForm, setRentForm] = useState<{ open: boolean; batteryId: string | null }>({
    open: false,
    batteryId: null,
  });

  // The notice is a toast: it hides itself after a few seconds.
  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(""), 5_000);
    return () => clearTimeout(id);
  }, [notice]);

  // URL holds the shareable state: view, list tab, branch, and the open rental.
  const viewParam = searchParams.get("view");
  const view: AdminView = VIEWS.find((v) => v === viewParam) ?? "home";
  const tab: RentalTab = searchParams.get("tab") === "returned" ? "returned" : "out";
  const selected = rentals.find((r) => r.id === searchParams.get("rental")) ?? null;

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null) params.delete(key);
      else params.set(key, value);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function markReturned(id: string) {
    const rental = rentals.find((r) => r.id === id);
    if (!rental) return;
    setRentals(rentals.map((r) => (r.id === id ? { ...r, returnedAt: new Date(now).toISOString() } : r)));
    setNotice(`${rental.batteryLabel} from ${rental.riderName} is back.`);
    updateParams({ rental: null });
  }

  function rentOut(input: RentInput) {
    const battery = fleet.find((b) => b.id === input.batteryId);
    const duration = durations.find((d) => d.id === input.durationId);
    if (!battery || !duration) return;
    const rental: Rental = {
      id: `r-new-${rentals.length + 1}`,
      riderName: input.riderName.trim(),
      riderPhone: normalizePhone(input.riderPhone),
      batteryId: battery.id,
      batteryLabel: battery.label,
      kioskName: battery.kioskName,
      startedAt: new Date(now).toISOString(),
      dueAt: new Date(now + duration.hours * 3_600_000).toISOString(),
      returnedAt: null,
      costMinorUnits: battery.pricePerHourMinorUnits * duration.hours,
    };
    setRentals([rental, ...rentals]);
    setNotice(`${battery.label} rented to ${rental.riderName}. Due back ${formatDateTime(rental.dueAt)}.`);
    setRentForm({ open: false, batteryId: null });
  }

  const openRentForm = (batteryId: string | null = null) => setRentForm({ open: true, batteryId });
  const header =
    view === "home" ? (
      <BrandHeader eyebrow="Good morning," title={adminName} tall actions={<LogoutLink />} />
    ) : (
      <BrandHeader title={VIEW_TITLE[view]} actions={<LogoutLink />} />
    );

  if (state.status === "loading") return <AdminWorkspaceSkeleton header={header} />;

  const visible = state.status === "ready" && !state.forceEmpty ? rentals : [];
  const out = visible.filter((r) => !r.returnedAt);
  const returned = visible.filter((r) => r.returnedAt);
  const lateCount = out.filter((r) => rentalStatus(r, now) === "late").length;
  const dueSoonCount = out.filter((r) => rentalStatus(r, now) === "due-soon").length;
  const readyBatteries = fleet.filter((b) => stockStatus(b, visible) === "ready");
  const stocks: BranchStock[] = branches.map((branch) => ({
    branch,
    batteries: fleet
      .filter((b) => b.kioskName === branch.name)
      .map((battery) => ({ battery, status: stockStatus(battery, visible) })),
  }));

  return (
    <>
      {header}
      <div className="flex flex-col gap-4 px-4 pt-4 pb-[calc(6rem+env(safe-area-inset-bottom))]">
        {state.status === "error" ? (
          <Card>
            <ErrorState message={state.message} onRetry={retry} />
          </Card>
        ) : view === "home" ? (
          <AdminHome
            outNow={out.length}
            late={lateCount}
            dueSoon={dueSoonCount}
            ready={readyBatteries.length}
            attention={out.filter((r) => rentalStatus(r, now) !== "out").sort(byUrgency(now))}
            stocks={stocks}
            nowMs={now}
            onOpenRental={(id) => updateParams({ rental: id })}
          />
        ) : view === "rentals" ? (
          <Card aria-label="Rentals" className="flex flex-col gap-3">
            <div role="group" aria-label="Show" className="grid grid-cols-2 gap-1 rounded-md bg-surface-muted p-1">
              {(["out", "returned"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={tab === option}
                  onClick={() => updateParams({ tab: option === "out" ? null : option })}
                  className={`min-h-12 rounded-sm px-2 text-base font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${tab === option ? "bg-surface text-ink shadow-card" : "text-ink-muted"}`}
                >
                  {TAB_LABEL[option]} ({(option === "out" ? out : returned).length})
                </button>
              ))}
            </div>
            {(tab === "out" ? out : returned).length === 0 ? (
              <EmptyState
                title={tab === "out" ? "No batteries out" : "Nothing returned yet"}
                description={
                  tab === "out" ? "Every battery is at a kiosk right now." : "Returned batteries will show here."
                }
              />
            ) : (
              <RentalList
                rentals={(tab === "out" ? out : returned).sort(byUrgency(now))}
                nowMs={now}
                onOpen={(id) => updateParams({ rental: id })}
              />
            )}
          </Card>
        ) : (
          <>
            <p className="text-base text-ink">{readyBatteries.length} ready across all branches</p>
            <AvailableBatteries
              stocks={stocks}
              view={view === "map" ? "map" : "list"}
              selectedCode={searchParams.get("branch")}
              onSelect={(code) => updateParams({ branch: code })}
              onShowList={() => updateParams({ view: "batteries", branch: null })}
              onRent={(batteryId) => openRentForm(batteryId)}
            />
          </>
        )}
      </div>

      {/* Live region stays mounted so screen readers hear each new notice. */}
      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-40 px-4">
        <p
          role="status"
          aria-live="polite"
          className="mx-auto max-w-md rounded-lg bg-ink px-4 py-3 text-base font-medium text-surface shadow-sheet empty:hidden"
        >
          {notice}
        </p>
      </div>

      <AdminNav view={view} onRentOut={() => openRentForm()} />

      <RentalSheet
        rental={selected}
        nowMs={now}
        onClose={() => updateParams({ rental: null })}
        onMarkReturned={markReturned}
      />

      <RentFormSheet
        open={rentForm.open}
        onClose={() => setRentForm({ open: false, batteryId: null })}
        readyBatteries={readyBatteries}
        durations={durations}
        initialBatteryId={rentForm.batteryId}
        onSubmit={rentOut}
      />
    </>
  );
}

export function AdminWorkspaceSkeleton({ header }: { header?: ReactNode }) {
  return (
    <>
      {header ?? <div className="h-32 rounded-b-xl bg-primary" />}
      <div className="px-4 pt-4">
        <LoadingRegion label="Loading rentals">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-24 w-full" />
            <Card className="flex flex-col gap-3">
              <Skeleton className="h-6 w-40" />
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="flex min-h-16 items-center gap-3">
                  <div className="flex flex-1 flex-col gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-7 w-20" />
                </div>
              ))}
            </Card>
          </div>
        </LoadingRegion>
      </div>
    </>
  );
}

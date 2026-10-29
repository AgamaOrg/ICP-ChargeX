import { Button } from "@/components/ui/button";
import { formatPercent } from "@/lib/format";
import type { Branch, FleetBattery, StockStatus } from "../types";

export type BranchStock = {
  branch: Branch;
  batteries: Array<{ battery: FleetBattery; status: StockStatus }>;
};

type BranchCardProps = {
  stock: BranchStock;
  onRent: (batteryId: string) => void;
};

const LOW_CHARGE = 20;

/** One branch (kiosk): where it is, its counts, and the batteries ready to rent out. */
export function BranchCard({ stock, onRent }: BranchCardProps) {
  const { branch, batteries } = stock;
  const ready = batteries.filter((b) => b.status === "ready");
  const out = batteries.filter((b) => b.status === "out").length;
  const repair = batteries.filter((b) => b.status === "repair").length;

  return (
    <section aria-label={branch.name} className="flex flex-col gap-3 rounded-lg border border-line p-4">
      <div>
        <h3 className="text-lg font-semibold text-ink">{branch.name}</h3>
        <p className="text-base text-ink-muted">{branch.address}</p>
        <p className="mt-1 text-base text-ink-muted">
          {/* None ready is the case an admin must act on, so it gets the warning colour. */}
          <span className={`font-semibold ${ready.length === 0 ? "text-warning" : "text-ink"}`}>{ready.length}</span>{" "}
          ready · <span className="font-semibold text-ink">{out}</span> out
          {repair > 0 && (
            <>
              {" · "}
              <span className="font-semibold text-danger">{repair}</span> in repair
            </>
          )}
        </p>
      </div>

      {ready.length > 0 && (
        <ul className="flex flex-col divide-y divide-line">
          {ready.map(({ battery }) => (
            <li key={battery.id} className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0">
              <p className="min-w-0">
                <span className="block text-base font-medium text-ink">{battery.label}</span>
                <span
                  className={`text-sm ${battery.chargePercent <= LOW_CHARGE ? "font-medium text-warning" : "text-ink-muted"}`}
                >
                  {formatPercent(battery.chargePercent)} charged{battery.chargePercent <= LOW_CHARGE ? " · Low" : ""}
                </span>
              </p>
              <Button variant="secondary" onClick={() => onRent(battery.id)} aria-label={`Rent out ${battery.label}`}>
                Rent out
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

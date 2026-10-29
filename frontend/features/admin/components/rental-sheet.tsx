import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { StatusPill } from "@/components/ui/status-pill";
import { formatDateTime, formatMoney } from "@/lib/format";
import { dueText, RENTAL_PILL, rentalStatus } from "../status";
import type { Rental } from "../types";

type RentalSheetProps = {
  rental: Rental | null;
  nowMs: number;
  onClose: () => void;
  onMarkReturned: (id: string) => void;
};

export function RentalSheet({ rental, nowMs, onClose, onMarkReturned }: RentalSheetProps) {
  const status = rental ? rentalStatus(rental, nowMs) : null;

  return (
    <Sheet
      open={rental !== null}
      onClose={onClose}
      title={rental?.riderName ?? "Rental"}
      footer={
        rental && !rental.returnedAt ? (
          <>
            {/* Demo: only updates in-memory state (data/mock.ts). */}
            <Button onClick={() => onMarkReturned(rental.id)}>Mark as returned</Button>
            <a
              href={`tel:${rental.riderPhone.replace(/\s/g, "")}`}
              className="inline-flex h-12 items-center justify-center rounded-md border border-line bg-surface px-4 text-base font-semibold text-ink hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              Call {rental.riderName.split(" ")[0]}
            </a>
          </>
        ) : undefined
      }
    >
      {rental && status && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col items-start gap-2">
            <StatusPill tone={RENTAL_PILL[status].tone} label={RENTAL_PILL[status].label} />
            <p className={`text-2xl font-semibold ${status === "late" ? "text-danger" : "text-ink"}`}>
              {dueText(rental, nowMs)}
            </p>
          </div>

          <dl className="flex flex-col divide-y divide-line rounded-lg border border-line text-base">
            {[
              ["Phone", rental.riderPhone],
              ["Battery", rental.batteryLabel],
              ["Kiosk", rental.kioskName],
              ["Took it", formatDateTime(rental.startedAt)],
              ["Due back", formatDateTime(rental.dueAt)],
              ...(rental.returnedAt ? [["Returned", formatDateTime(rental.returnedAt)]] : []),
              ["Cost", formatMoney(rental.costMinorUnits)],
            ].map(([term, value]) => (
              <div key={term} className="flex justify-between gap-4 px-4 py-3">
                <dt className="shrink-0 text-ink-muted">{term}</dt>
                <dd className="text-right font-medium text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </Sheet>
  );
}

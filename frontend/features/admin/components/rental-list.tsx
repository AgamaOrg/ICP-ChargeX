import { ListRow } from "@/components/ui/list-row";
import { StatusPill } from "@/components/ui/status-pill";
import { dueText, RENTAL_PILL, rentalStatus } from "../status";
import type { Rental } from "../types";

type RentalListProps = {
  rentals: Rental[];
  nowMs: number;
  onOpen: (id: string) => void;
};

export function RentalList({ rentals, nowMs, onOpen }: RentalListProps) {
  return (
    <ul className="flex flex-col divide-y divide-line">
      {rentals.map((rental) => {
        const status = rentalStatus(rental, nowMs);
        const pill = RENTAL_PILL[status];
        return (
          <li key={rental.id}>
            <ListRow
              onClick={() => onOpen(rental.id)}
              title={rental.riderName}
              subtitle={
                <>
                  <span className={`block truncate ${status === "late" ? "font-medium text-danger" : ""}`}>
                    {dueText(rental, nowMs)}
                  </span>
                  <span className="block truncate">
                    {rental.batteryLabel} · {rental.kioskName}
                  </span>
                </>
              }
              trailing={<StatusPill tone={pill.tone} label={pill.label} />}
            />
          </li>
        );
      })}
    </ul>
  );
}

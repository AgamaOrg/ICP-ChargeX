import Link from "next/link";
import { formatDateTime, formatMoney } from "@/lib/format";
import type { Receipt } from "../../types";

type PaymentResultProps = {
  receipt: Receipt;
  batteryLabel: string;
  kioskName: string;
  durationLabel: string;
};

export function PaymentResult({ receipt, batteryLabel, kioskName, durationLabel }: PaymentResultProps) {
  return (
    <div role="status" className="flex flex-col gap-4">
      <div className="flex gap-2 rounded-md bg-success-soft p-4 text-lg font-medium text-success">
        <span aria-hidden="true">✓</span>
        <p>Done. Go to {kioskName} to get your battery.</p>
      </div>

      <section aria-label="Receipt" className="rounded-lg border border-dashed border-line p-4">
        <p className="text-base text-ink-muted">Paid</p>
        <p className="text-4xl font-semibold tabular-nums text-ink">{formatMoney(receipt.totalMinorUnits)}</p>
        <dl className="mt-3 flex flex-col gap-2 text-base">
          {[
            ["Battery", batteryLabel],
            ["How long", durationLabel],
            ["Paid with", receipt.methodLabel],
            ["Paid on", formatDateTime(receipt.paidAt)],
          ].map(([term, value]) => (
            <div key={term} className="flex justify-between gap-4">
              <dt className="text-ink-muted">{term}</dt>
              <dd className="text-right text-ink">{value}</dd>
            </div>
          ))}
        </dl>
        {/* Required by rules.md §4: never imply a real payment. */}
        <p className="mt-3 text-sm text-ink-muted">Demo receipt. No money was taken.</p>
      </section>

      <Link
        href={`/leases?lease=${receipt.leaseId}`}
        className="inline-flex h-14 items-center justify-center rounded-md bg-primary px-4 text-base font-semibold text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        See my lease
      </Link>
      <Link
        href="/dashboard"
        className="inline-flex h-12 items-center justify-center rounded-md text-base font-semibold text-ink hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        Back to home
      </Link>
    </div>
  );
}

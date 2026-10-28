import { formatMoney } from "@/lib/format";

type PaymentSummaryProps = {
  totalMinorUnits: number;
  summary: string;
};

export function PaymentSummary({ totalMinorUnits, summary }: PaymentSummaryProps) {
  return (
    <div>
      <p className="text-sm text-ink-muted">Total due</p>
      <p className="text-3xl font-semibold tabular-nums text-ink">{formatMoney(totalMinorUnits)}</p>
      <p className="text-sm text-ink-muted">{summary}</p>
    </div>
  );
}

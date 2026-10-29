import { formatMoney } from "@/lib/format";

type PaymentSummaryProps = {
  totalMinorUnits: number;
  summary: string;
};

export function PaymentSummary({ totalMinorUnits, summary }: PaymentSummaryProps) {
  return (
    <div>
      <p className="text-base text-ink-muted">To pay</p>
      <p className="text-4xl font-semibold tabular-nums text-ink">{formatMoney(totalMinorUnits)}</p>
      <p className="text-base text-ink-muted">{summary}</p>
    </div>
  );
}

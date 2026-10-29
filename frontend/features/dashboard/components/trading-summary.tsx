"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { ChevronRightIcon } from "@/components/ui/icons";
import { LoadingRegion, Skeleton } from "@/components/ui/skeleton";
import { formatMoney, formatNumber, formatWeekday } from "@/lib/format";
import { useSimulatedLoad } from "@/lib/mock/use-simulated-load";
import type { TradingSummary as TradingSummaryData } from "../types";

type TradingSummaryProps = {
  summary: TradingSummaryData;
};

export function TradingSummary({ summary }: TradingSummaryProps) {
  const { state, retry } = useSimulatedLoad(
    "We couldn't load your trading summary. Check your connection and try again.",
  );

  if (state.status === "loading") return <TradingSummarySkeleton />;

  const hasActivity =
    state.status === "ready" &&
    !state.forceEmpty &&
    (summary.earnedMinorUnits > 0 || summary.openOffers > 0 || summary.kwhSold > 0);

  return (
    <Card aria-labelledby="trading-title">
      <div className="mb-3">
        <h2 id="trading-title" className="text-base font-semibold text-ink">
          Energy trading
        </h2>
      </div>
      {state.status === "error" ? (
        <ErrorState message={state.message} onRetry={retry} />
      ) : !hasActivity ? (
        <EmptyState
          title="No trading activity yet"
          description="When you sell spare energy from a leased battery, your earnings show up here."
        />
      ) : (
        <TradingDetails summary={summary} />
      )}
    </Card>
  );
}

function TradingDetails({ summary }: { summary: TradingSummaryData }) {
  const max = Math.max(...summary.last7Days.map((d) => d.earnedMinorUnits), 1);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm text-ink-muted">Earned this month</p>
        <p className="text-3xl font-semibold tabular-nums text-ink">{formatMoney(summary.earnedMinorUnits)}</p>
        <p className="text-sm text-ink-muted">
          {formatNumber(summary.kwhSold)} kWh sold · {summary.openOffers}{" "}
          {summary.openOffers === 1 ? "open offer" : "open offers"}
        </p>
      </div>

      <figure>
        <figcaption className="mb-2 text-xs text-ink-muted">Earnings, last 7 days</figcaption>
        <div aria-hidden="true" className="flex h-20 items-end gap-2">
          {summary.last7Days.map((day) => (
            <div key={day.dateIso} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              {/* Inline style: bar height is a runtime value. */}
              <div
                className="w-full rounded-sm bg-linear-to-t from-primary to-brand-green"
                style={{ height: `${Math.max(4, (day.earnedMinorUnits / max) * 100)}%` }}
              />
              <span className="text-[0.7rem] text-ink-muted">{formatWeekday(day.dateIso)}</span>
            </div>
          ))}
        </div>
        <table className="sr-only">
          <caption>Earnings per day, last 7 days</caption>
          <tbody>
            {summary.last7Days.map((day) => (
              <tr key={day.dateIso}>
                <th scope="row">{formatWeekday(day.dateIso)}</th>
                <td>{formatMoney(day.earnedMinorUnits)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>

      <Link
        href="/trading?tab=portfolio"
        className="flex min-h-11 items-center justify-between rounded-md bg-surface-muted px-3 text-sm font-medium text-ink hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        <span>View trading history</span>
        <ChevronRightIcon className="size-4 text-ink-muted" />
      </Link>
    </div>
  );
}

export function TradingSummarySkeleton() {
  return (
    <Card>
      <LoadingRegion label="Loading trading summary">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-4 w-48" />
          <div className="flex h-20 items-end gap-2">
            {[40, 70, 30, 90, 55, 65, 20].map((h, i) => (
              <Skeleton key={i} className={`flex-1 ${h > 60 ? "h-16" : h > 35 ? "h-10" : "h-5"}`} />
            ))}
          </div>
        </div>
      </LoadingRegion>
    </Card>
  );
}

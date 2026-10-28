"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { formatDateTime, formatMoney } from "@/lib/format";
import type { Lease } from "@/lib/types/lease";
import { useLeaseActions } from "../../hooks/use-lease-actions";
import type { DurationOption, LeaseAction } from "../../types";

type LeaseActionsProps = {
  lease: Lease;
  nowMs: number;
  extendOptions: DurationOption[];
  issueTypes: readonly string[];
};

// Which actions each lifecycle state allows (glossary: no button that silently fails).
const ALLOWED: Record<Lease["status"], LeaseAction[]> = {
  active: ["extend", "return", "report"],
  "ending-soon": ["extend", "return", "report"],
  overdue: ["return", "report"],
  completed: ["report"],
};

const LABELS: Record<LeaseAction, string> = {
  extend: "Extend lease",
  return: "Return battery",
  report: "Report an issue",
};

export function LeaseActions({ lease, nowMs, extendOptions, issueTypes }: LeaseActionsProps) {
  const { state, run, clearError } = useLeaseActions(nowMs);
  const [open, setOpen] = useState<LeaseAction | null>(null);
  const [extendId, setExtendId] = useState(extendOptions[0]?.id ?? "1h");
  const [issueType, setIssueType] = useState<string>(issueTypes[0] ?? "");
  const [issueDetails, setIssueDetails] = useState("");
  const allowed = ALLOWED[lease.status];
  const extend = extendOptions.find((o) => o.id === extendId);
  const working = state.status === "working";
  const sheetError = state.status === "error" && state.action === open ? state.message : null;

  function close() {
    if (working) return;
    clearError();
    setOpen(null);
  }

  async function confirm() {
    if (!open) return;
    const ok = await run(open, lease.id, extend ? { hours: extend.hours, hoursLabel: extend.label.replace(" more", "") } : {});
    if (ok) setOpen(null);
  }

  return (
    <section aria-labelledby="lease-actions-title" className="flex flex-col gap-2">
      <h3 id="lease-actions-title" className="sr-only">
        Lease actions
      </h3>
      {allowed.map((action, index) => (
        <Button key={action} variant={index === 0 ? "primary" : "secondary"} className={index === 0 ? "" : "h-12"} onClick={() => setOpen(action)}>
          {LABELS[action]}
        </Button>
      ))}
      <p aria-live="polite" className="min-h-5 text-sm text-success">
        {state.status === "done" && (
          <>
            <span aria-hidden="true">✓ </span>
            {state.message}
          </>
        )}
      </p>

      <Sheet
        open={open !== null}
        onClose={close}
        title={open ? LABELS[open] : ""}
        footer={
          <>
            <Button variant={open === "return" ? "danger" : "primary"} loading={working} onClick={confirm}>
              {open === "extend" && extend
                ? `Extend for ${formatMoney(extend.hours * lease.pricePerHourMinorUnits)}`
                : open === "return"
                  ? "End lease now"
                  : "Send report"}
            </Button>
            <Button variant="secondary" disabled={working} onClick={close}>
              Keep lease as is
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          {sheetError && (
            <p role="alert" className="flex gap-2 rounded-md bg-danger-soft p-3 text-sm text-danger">
              <span aria-hidden="true">⚠</span>
              {sheetError}
            </p>
          )}

          {open === "extend" && (
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-base text-ink">
                Your lease ends {formatDateTime(lease.endsAt)}. How much more time do you need?
              </legend>
              {extendOptions.map((option) => (
                <label
                  key={option.id}
                  className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-md border px-4 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus ${option.id === extendId ? "border-primary bg-primary-soft" : "border-line"}`}
                >
                  <input
                    type="radio"
                    name="extend"
                    checked={option.id === extendId}
                    onChange={() => setExtendId(option.id)}
                    className="size-5 accent-primary"
                  />
                  <span className="flex-1 text-ink">{option.label}</span>
                  <span className="tabular-nums text-sm text-ink-muted">
                    {formatMoney(option.hours * lease.pricePerHourMinorUnits)}
                  </span>
                </label>
              ))}
              <p className="text-xs text-ink-muted">Demo only — no real payment is processed.</p>
            </fieldset>
          )}

          {open === "return" && (
            <div className="flex flex-col gap-2 text-base text-ink">
              <p>This ends your lease for {lease.batteryLabel} right now.</p>
              <p className="text-sm text-ink-muted">
                Bring the battery to any ChargeX kiosk within 30 minutes. After that, extra time is charged at{" "}
                {formatMoney(lease.pricePerHourMinorUnits)} per hour. You can&apos;t undo this.
              </p>
            </div>
          )}

          {open === "report" && (
            <>
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-2 text-base text-ink">What&apos;s wrong?</legend>
                {issueTypes.map((type) => (
                  <label
                    key={type}
                    className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-1 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus"
                  >
                    <input
                      type="radio"
                      name="issue"
                      checked={type === issueType}
                      onChange={() => setIssueType(type)}
                      className="size-5 accent-primary"
                    />
                    <span className="text-ink">{type}</span>
                  </label>
                ))}
              </fieldset>
              <div className="flex flex-col gap-1">
                <label htmlFor="issue-details" className="text-sm font-medium text-ink">
                  Details (optional)
                </label>
                <textarea
                  id="issue-details"
                  rows={3}
                  value={issueDetails}
                  onChange={(event) => setIssueDetails(event.target.value)}
                  className="rounded-sm border border-line bg-surface p-3 text-base text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                />
              </div>
              <p className="text-xs text-ink-muted">Demo only — reports aren&apos;t sent anywhere yet.</p>
            </>
          )}
        </div>
      </Sheet>
    </section>
  );
}

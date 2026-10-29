"use client";

import Link from "next/link";
import { useState, type ComponentType, type SVGProps } from "react";
import { Button } from "@/components/ui/button";
import { BoltIcon, MapPinIcon, ReturnIcon, WalletIcon } from "@/components/ui/icons";
import { Sheet } from "@/components/ui/sheet";
import type { QuickActionsContext } from "../types";

type Action =
  | { kind: "link"; label: string; icon: ComponentType<SVGProps<SVGSVGElement>>; href: string }
  | { kind: "button"; label: string; icon: ComponentType<SVGProps<SVGSVGElement>>; onPress: () => void }
  | { kind: "disabled"; label: string; icon: ComponentType<SVGProps<SVGSVGElement>>; reason: string };

const TILE =
  "flex min-h-20 flex-col items-center justify-center gap-1 rounded-lg bg-surface p-2 text-xs font-medium shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

export function QuickActions({ trackedBatteryId, activeLease, overdueLeaseId }: QuickActionsContext) {
  const [returnOpen, setReturnOpen] = useState(false);
  const [reason, setReason] = useState("");

  const actions: Action[] = [
    { kind: "link", label: "Lease", icon: BoltIcon, href: "/batteries" },
    activeLease
      ? { kind: "button", label: "Return", icon: ReturnIcon, onPress: () => setReturnOpen(true) }
      : { kind: "disabled", label: "Return", icon: ReturnIcon, reason: "No active lease to return." },
    overdueLeaseId
      ? { kind: "link", label: "Pay", icon: WalletIcon, href: `/leases?lease=${overdueLeaseId}` }
      : {
          kind: "disabled",
          label: "Pay",
          icon: WalletIcon,
          reason: "Nothing to pay right now. Leases are paid when you start them.",
        },
    trackedBatteryId
      ? { kind: "link", label: "Track", icon: MapPinIcon, href: "/trading?tab=tracking" }
      : { kind: "disabled", label: "Track", icon: MapPinIcon, reason: "Lease a battery to track it." },
  ];

  return (
    <section aria-labelledby="quick-actions-title">
      <h2 id="quick-actions-title" className="mb-2 text-base font-semibold text-ink">
        Quick actions
      </h2>
      <ul className="grid grid-cols-4 gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          const content = (
            <>
              <Icon className="size-6" />
              {action.label}
            </>
          );
          return (
            <li key={action.label}>
              {action.kind === "link" ? (
                <Link href={action.href} className={`${TILE} text-ink`} onClick={() => setReason("")}>
                  {content}
                </Link>
              ) : action.kind === "button" ? (
                <button
                  type="button"
                  className={`${TILE} w-full text-ink`}
                  onClick={() => {
                    setReason("");
                    action.onPress();
                  }}
                >
                  {content}
                </button>
              ) : (
                <button
                  type="button"
                  aria-disabled="true"
                  aria-describedby="quick-actions-reason"
                  className={`${TILE} w-full cursor-not-allowed text-ink-muted opacity-70`}
                  onClick={() => setReason(action.reason)}
                >
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>
      <p id="quick-actions-reason" aria-live="polite" className="mt-2 min-h-5 text-sm text-ink-muted">
        {reason}
      </p>

      {activeLease && (
        <Sheet
          open={returnOpen}
          onClose={() => setReturnOpen(false)}
          title="Return a battery"
          footer={
            <>
              <Button onClick={() => setReturnOpen(false)}>Got it</Button>
              <Link
                href={`/leases?lease=${activeLease.id}`}
                className="inline-flex h-10 items-center justify-center rounded-md text-sm font-medium text-ink hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                Manage this lease
              </Link>
            </>
          }
        >
          <ol className="flex list-decimal flex-col gap-2 pl-5 text-base text-ink">
            <li>Bring {activeLease.batteryLabel} to {activeLease.kioskName} or any ChargeX kiosk.</li>
            <li>Slide it into an open slot until it clicks.</li>
            <li>Your lease ends when the kiosk confirms the return.</li>
          </ol>
        </Sheet>
      )}
    </section>
  );
}

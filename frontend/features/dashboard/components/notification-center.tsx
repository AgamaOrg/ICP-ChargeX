"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { BellIcon } from "@/components/ui/icons";
import { Sheet } from "@/components/ui/sheet";
import { LoadingRegion, Skeleton } from "@/components/ui/skeleton";
import { StatusPill, type StatusTone } from "@/components/ui/status-pill";
import { formatRelative } from "@/lib/format";
import { MOCK_NOW_MS } from "@/lib/mock/fixtures";
import { useMockNow } from "@/lib/mock/use-mock-now";
import { useSimulatedLoad } from "@/lib/mock/use-simulated-load";
import type { AppNotification, NotificationSeverity } from "../types";

const INCOMING_DELAY_MS = 20_000;

const SEVERITY: Record<NotificationSeverity, { tone: StatusTone; label: string }> = {
  info: { tone: "info", label: "Info" },
  success: { tone: "success", label: "Done" },
  warning: { tone: "warning", label: "Heads up" },
  danger: { tone: "danger", label: "Action needed" },
};

type NotificationCenterProps = {
  initial: AppNotification[];
  incoming: AppNotification;
};

export function NotificationCenter({ initial, incoming }: NotificationCenterProps) {
  const { state, retry } = useSimulatedLoad("We couldn't load your notifications. Try again.");
  const [items, setItems] = useState(initial);
  const [open, setOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const now = useMockNow();
  const ready = state.status === "ready";
  const visible = ready && !state.forceEmpty ? items : [];
  const unread = visible.filter((n) => !n.read).length;

  // Simulates a push arriving after the page opens.
  useEffect(() => {
    if (!ready) return;
    const startedAt = Date.now();
    const id = setTimeout(() => {
      const arrived = { ...incoming, createdAt: new Date(MOCK_NOW_MS + Date.now() - startedAt).toISOString() };
      setItems((current) => (current.some((n) => n.id === arrived.id) ? current : [arrived, ...current]));
      setAnnouncement(`New notification: ${arrived.title}`);
    }, INCOMING_DELAY_MS);
    return () => clearTimeout(id);
  }, [ready, incoming]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
        className="relative inline-flex size-11 items-center justify-center rounded-md text-primary-foreground hover:bg-primary-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground"
      >
        <BellIcon className="size-6" />
        {unread > 0 && (
          <span
            aria-hidden="true"
            className="absolute top-0.5 right-0.5 flex min-w-5 items-center justify-center rounded-full bg-danger px-1 text-xs font-semibold text-primary-foreground ring-2 ring-primary"
          >
            {unread}
          </span>
        )}
      </button>
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Notifications"
        footer={
          unread > 0 ? (
            <Button
              variant="secondary"
              onClick={() => setItems((current) => current.map((n) => ({ ...n, read: true })))}
            >
              Mark all as read
            </Button>
          ) : undefined
        }
      >
        {state.status === "loading" ? (
          <LoadingRegion label="Loading notifications">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex flex-col gap-2 py-3">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </LoadingRegion>
        ) : state.status === "error" ? (
          <ErrorState message={state.message} onRetry={retry} />
        ) : visible.length === 0 ? (
          <EmptyState title="You're all caught up" description="New alerts about your batteries and leases will appear here." />
        ) : (
          <ul className="flex flex-col divide-y divide-line">
            {visible.map((n) => {
              const severity = SEVERITY[n.severity];
              return (
                <li key={n.id} className="flex gap-3 py-3">
                  <span
                    aria-hidden="true"
                    className={`mt-2 size-2 shrink-0 rounded-full ${n.read ? "bg-transparent" : "bg-primary"}`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-ink">{n.title}</p>
                      <StatusPill tone={severity.tone} label={severity.label} />
                      {!n.read && <span className="sr-only">Unread</span>}
                    </div>
                    <p className="line-clamp-2 text-sm text-ink-muted">{n.body}</p>
                    <p className="text-xs text-ink-muted">{formatRelative(n.createdAt, now)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Sheet>
    </>
  );
}

export function NotificationBellPlaceholder() {
  // Sits on the teal header band, so a light placeholder instead of the grey skeleton.
  return <span aria-hidden="true" className="block size-11 rounded-md bg-primary-foreground/10" />;
}

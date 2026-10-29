import { ListRow } from "@/components/ui/list-row";
import { StatusPill } from "@/components/ui/status-pill";
import { formatRelative } from "@/lib/format";
import { LEASE_STATUS_PILL } from "@/lib/status";
import type { Lease } from "@/lib/types/lease";

type LeaseRowProps = {
  lease: Lease;
  nowMs: number;
  onOpen: (id: string) => void;
};

export function timeLabel(lease: Lease, nowMs: number) {
  const when = formatRelative(lease.endsAt, nowMs);
  switch (lease.status) {
    case "overdue":
      return `Was due ${when}`;
    case "completed":
      return `Returned ${when}`;
    default:
      return `Bring back ${when}`;
  }
}

export function LeaseRow({ lease, nowMs, onOpen }: LeaseRowProps) {
  const pill = LEASE_STATUS_PILL[lease.status];
  return (
    <ListRow
      onClick={() => onOpen(lease.id)}
      title={lease.batteryLabel}
      subtitle={timeLabel(lease, nowMs)}
      trailing={<StatusPill tone={pill.tone} label={pill.label} />}
    />
  );
}

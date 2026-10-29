export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";

type StatusPillProps = {
  tone: StatusTone;
  label: string;
};

const TONE_CLASSES: Record<StatusTone, string> = {
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
  neutral: "bg-surface-muted text-ink-muted",
};

// A glyph per tone so status never relies on color alone.
const TONE_GLYPH: Record<StatusTone, string> = {
  success: "●",
  warning: "▲",
  danger: "■",
  info: "◆",
  neutral: "○",
};

export function StatusPill({ tone, label }: StatusPillProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-medium ${TONE_CLASSES[tone]}`}
    >
      <span aria-hidden="true" className="text-[0.6rem]">
        {TONE_GLYPH[tone]}
      </span>
      {label}
    </span>
  );
}

import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
};

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-6 text-center">
      {icon && <div className="text-ink-muted">{icon}</div>}
      <p className="text-base font-semibold text-ink">{title}</p>
      <p className="max-w-xs text-sm text-ink-muted">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: "section" | "div" | "article";
  variant?: "default" | "muted";
};

export function Card({ as: Tag = "section", variant = "default", className = "", ...rest }: CardProps) {
  const surface = variant === "muted" ? "bg-surface-muted" : "bg-surface shadow-card";
  return <Tag className={`rounded-lg p-4 ${surface} ${className}`} {...rest} />;
}

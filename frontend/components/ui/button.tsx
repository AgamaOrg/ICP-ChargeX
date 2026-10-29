import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "h-14 bg-primary text-primary-foreground hover:opacity-90",
  secondary: "h-12 border border-line bg-surface text-ink hover:bg-surface-muted",
  ghost: "h-12 text-ink hover:bg-surface-muted",
  danger: "h-14 bg-danger text-primary-foreground hover:opacity-90",
};

export function Button({
  variant = "primary",
  loading = false,
  disabled,
  className = "",
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-base font-semibold transition-opacity duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-60 ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  );
}

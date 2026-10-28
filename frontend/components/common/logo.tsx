type LogoProps = {
  /** Hide the "ChargeX" text and show only the mark. */
  markOnly?: boolean;
  size?: "sm" | "md";
};

/**
 * Temporary ChargeX logo: a bolt in a rounded tile plus a wordmark. Uses
 * color tokens only, so it follows the palette once one is chosen.
 */
export function Logo({ markOnly = false, size = "md" }: LogoProps) {
  const markSize = size === "sm" ? "size-7" : "size-9";
  const textSize = size === "sm" ? "text-lg" : "text-xl";

  return (
    <span className="inline-flex items-center gap-2">
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" className={`${markSize} shrink-0`}>
        <rect width="32" height="32" rx="9" className="fill-primary" />
        <path d="M18.5 5 9.5 18H15l-1.5 9 9-13H17z" className="fill-primary-foreground" />
      </svg>
      {markOnly ? (
        <span className="sr-only">ChargeX</span>
      ) : (
        <span className={`${textSize} font-semibold tracking-tight text-ink`}>ChargeX</span>
      )}
    </span>
  );
}

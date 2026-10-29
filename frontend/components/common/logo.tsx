import Image from "next/image";
import markSrc from "@/public/brand/chargex-mark.png";
import tileSrc from "@/public/brand/chargex-tile-dark.png";

type LogoVariant =
  /** Colour mark + wordmark, the primary lockup. */
  | "full"
  /** Colour mark alone, for light surfaces with little room. */
  | "mark"
  /** Mark on the deep teal app tile; reads best at small sizes. */
  | "tile";

type LogoSize = "sm" | "md" | "lg";

type LogoProps = {
  variant?: LogoVariant;
  size?: LogoSize;
  /** Adds the brand tagline under the full lockup. */
  tagline?: boolean;
};

const MARK_PX: Record<LogoSize, number> = { sm: 32, md: 44, lg: 64 };
const WORDMARK_TEXT: Record<LogoSize, string> = { sm: "text-lg", md: "text-2xl", lg: "text-4xl" };

/**
 * ChargeX logo, from the brand sheet in Figma ("chargex"). The mark is a
 * raster export; the wordmark is live text so it stays sharp and readable.
 */
export function Logo({ variant = "full", size = "md", tagline = false }: LogoProps) {
  const px = MARK_PX[size];

  if (variant === "tile") {
    return <Image src={tileSrc} alt="ChargeX" width={px} height={px} className="shrink-0 rounded-[20%]" />;
  }

  if (variant === "mark") {
    return <Image src={markSrc} alt="ChargeX" width={px} height={px} className="shrink-0" />;
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <span className="inline-flex items-center gap-2">
        <Image src={markSrc} alt="" width={px} height={px} className="shrink-0" />
        <Wordmark className={WORDMARK_TEXT[size]} />
      </span>
      {tagline && (
        <span className="text-[0.6875rem] font-medium tracking-[0.18em] text-ink-muted uppercase">
          Decentralized power, distributed purpose
        </span>
      )}
    </span>
  );
}

// "CHARGE" in deep teal with the "X" in the green → blue teal brand gradient,
// as in the lockup. Text stays "ChargeX" for screen readers.
function Wordmark({ className }: { className: string }) {
  return (
    <span className={`leading-none font-extrabold tracking-tight text-primary uppercase ${className}`}>
      Charge
      <span className="bg-linear-to-br from-brand-green from-40% to-brand-blue bg-clip-text text-transparent">
        X
      </span>
    </span>
  );
}

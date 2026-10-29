/**
 * Joins class names, skipping falsy values. Exists for vendored shadcn-style
 * components (components/ui/map.tsx) that import `cn` from here. It does not
 * resolve conflicting Tailwind classes, so pass overrides on a wrapper instead.
 */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

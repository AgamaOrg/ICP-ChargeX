import type { ReactNode } from "react";
import { BottomNav } from "./bottom-nav";

/** Single centered column (max-w-md) with the bottom nav, per design.md §3. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col pb-[calc(5rem+env(safe-area-inset-bottom))]">
        {children}
      </div>
      <BottomNav />
    </>
  );
}

"use client";

import { useRef, type KeyboardEvent } from "react";
import type { LeaseTab } from "../../types";

type LeaseTabsProps = {
  tabs: Array<{ id: LeaseTab; label: string; count: number }>;
  value: LeaseTab;
  onChange: (tab: LeaseTab) => void;
};

export const tabId = (tab: LeaseTab) => `lease-tab-${tab}`;
export const panelId = (tab: LeaseTab) => `lease-panel-${tab}`;

/** WAI-ARIA tabs: arrow keys, Home and End move between tabs. */
export function LeaseTabs({ tabs, value, onChange }: LeaseTabsProps) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(event: KeyboardEvent, index: number) {
    const last = tabs.length - 1;
    const next =
      event.key === "ArrowRight"
        ? (index + 1) % tabs.length
        : event.key === "ArrowLeft"
          ? (index - 1 + tabs.length) % tabs.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    onChange(tabs[next].id);
    refs.current[next]?.focus();
  }

  return (
    <div role="tablist" aria-label="Leases" className="grid grid-cols-2 gap-1 rounded-md bg-surface-muted p-1">
      {tabs.map((tab, index) => {
        const selected = tab.id === value;
        return (
          <button
            key={tab.id}
            ref={(node) => {
              refs.current[index] = node;
            }}
            id={tabId(tab.id)}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={panelId(tab.id)}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={`min-h-12 rounded-sm px-2 text-base font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${selected ? "bg-surface text-ink shadow-card" : "text-ink-muted"}`}
          >
            {tab.label} ({tab.count})
          </button>
        );
      })}
    </div>
  );
}

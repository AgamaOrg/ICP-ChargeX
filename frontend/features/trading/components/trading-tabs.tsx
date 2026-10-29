"use client";

import { useRef, type KeyboardEvent } from "react";
import type { TradingTab } from "../types";

type TradingTabsProps = {
  value: TradingTab;
  onChange: (tab: TradingTab) => void;
};

const TABS: TradingTab[] = ["market", "tracking", "portfolio"];

const LABEL: Record<TradingTab, string> = {
  market: "Buy",
  tracking: "My battery",
  portfolio: "Earnings",
};

export const tradingTabId = (tab: TradingTab) => `trading-tab-${tab}`;
export const tradingPanelId = (tab: TradingTab) => `trading-panel-${tab}`;

/** WAI-ARIA tabs: arrow keys, Home and End move between tabs. */
export function TradingTabs({ value, onChange }: TradingTabsProps) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(event: KeyboardEvent, index: number) {
    const last = TABS.length - 1;
    const next =
      event.key === "ArrowRight"
        ? (index + 1) % TABS.length
        : event.key === "ArrowLeft"
          ? (index - 1 + TABS.length) % TABS.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    onChange(TABS[next]);
    refs.current[next]?.focus();
  }

  return (
    <div role="tablist" aria-label="Trading views" className="grid grid-cols-3 gap-1 rounded-md bg-surface-muted p-1">
      {TABS.map((tab, index) => {
        const selected = tab === value;
        return (
          <button
            key={tab}
            ref={(node) => {
              refs.current[index] = node;
            }}
            id={tradingTabId(tab)}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={tradingPanelId(tab)}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={`min-h-12 rounded-sm px-2 text-base font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${selected ? "bg-surface text-ink shadow-card" : "text-ink-muted"}`}
          >
            {LABEL[tab]}
          </button>
        );
      })}
    </div>
  );
}

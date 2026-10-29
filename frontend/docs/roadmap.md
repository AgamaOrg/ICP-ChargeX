# Frontend Roadmap

**Source:** the Dashboard Development / Battery Management Interface / Battery Tracking / Energy Trading UI checklist.
**Scope:** frontend only, mock data only. Nothing here integrates with a canister, a payment provider, or hardware yet.
**Read first:** [`rules.md`](./rules.md) · [`architecture.md`](./architecture.md) · [`design.md`](./design.md) for UI work.
**Last updated:** 2026-10-28

Status legend: `[ ]` not started · `[~]` in progress · `[x]` done

> This file is the single source of truth for task status. Update the checkbox in the same change that completes the work. Never tick an item that has not passed the definition of done in `rules.md` §6.

---

## Progress

| # | Item | Status |
| --- | --- | --- |
| 1.1 | Real-time battery status | `[~]` built; needs manual 360px + keyboard check |
| 1.2 | Active leases display | `[~]` built; needs manual 360px + keyboard check |
| 1.3 | Energy trading summary | `[~]` built; needs manual 360px + keyboard check |
| 1.4 | Quick actions panel | `[~]` built; needs manual 360px + keyboard check |
| 1.5 | Notification center | `[~]` built; needs manual 360px + keyboard check |
| 2.1 | Available batteries map | `[~]` built; needs manual 360px + keyboard check |
| 2.2 | Battery details modal | `[~]` built; needs manual 360px + keyboard check |
| 2.3 | Lease creation wizard | `[~]` built; needs manual 360px + keyboard check |
| 2.4 | Payment interface | `[~]` built; needs manual 360px + keyboard check |
| 2.5 | Lease management panel | `[~]` built; needs manual 360px + keyboard check |
| 3.1 | Battery tracking (GPS preview, health, usage, alerts) | `[~]` built; needs manual 360px + keyboard check |
| 3.2 | Marketplace browser | `[~]` built; needs manual 360px + keyboard check |
| 3.3 | Create offer interface | `[~]` built; needs manual 360px + keyboard check |
| 3.4 | Trade execution UI | `[~]` built; needs manual 360px + keyboard check |
| 3.5 | Portfolio management | `[~]` built; needs manual 360px + keyboard check |
| 3.6 | Trading history | `[~]` built; needs manual 360px + keyboard check |

---

## Feature mapping

| Epic | Feature folder | Root file | Routes |
| --- | --- | --- | --- |
| Dashboard | `features/dashboard/` | `dashboard.tsx` | `/dashboard` (login is `/`) |
| Battery leasing | `features/battery-leasing/` | `battery-leasing.tsx` | `/batteries`, `/batteries/[batteryId]`, `/batteries/lease`, `/leases` |
| Energy trading + tracking | `features/trading/` | `trading.tsx` | `/trading` (`?tab=market\|tracking\|portfolio`, `?sort=`, `?offer=`, `&sheet=new-offer`) |

Route choices are proposals until the first route is created; update `architecture.md` §6 and this table together.

---

## Enabling work (not in the task list)

These are prerequisites, not deliverables. Keep them minimal — build only what the next item needs.

- [x] App shell: root layout metadata, `components/common/page-header.tsx`, `components/common/bottom-nav.tsx`, `components/common/app-shell.tsx` (route group `app/(app)/`).
- [x] Token contract in `app/globals.css` with the approved brand palette (`design.md` §4.3), plus the logo component and assets (`components/common/logo.tsx`, `public/brand/`).
- [x] Mock login and sign-up (`features/auth/`, `/login`, `/signup`). Demo only: hardcoded credentials, no session.
- [x] Primitives as used: `Button`, `Card`, `StatusPill`, `BatteryMeter`, `ListRow`, `Sheet`, `Skeleton`, `EmptyState`, plus `ErrorState`, `Stepper`, `TextField`, inline SVG icons (`components/ui/icons.tsx`).
- [x] Shared mock fixtures for batteries and leases (`lib/mock/fixtures.ts`, with a fixed `MOCK_NOW` for deterministic first paint).

Do not build the whole primitive library up front. Add a primitive when the second usage appears.

---

# Epic 1 — Dashboard

Feature: `features/dashboard/`
Root: `dashboard.tsx`
Outcome: one screen that answers "what is my battery doing, what do I owe, and what should I do next?"

## 1.1 Real-time battery status `[~]`

**Files:** `features/dashboard/components/battery-status-card.tsx`, `features/dashboard/hooks/use-battery-status.ts`

**Goal:** show the current charge, status, and health of the battery the user cares about, updating without a reload.

**UI:**
- Large charge percentage with a horizontal meter.
- Status pill: Charging / In use / Idle / Fault.
- Health percentage, secondary weight.
- "Updated just now" relative timestamp.
- Estimated time to full (charging) or time remaining (in use).

**Mock data:** `mockBatteries[0]` plus a `simulateTick()` that moves charge by ±0.1–0.5% and flips to `fault` rarely.

**States:**
- Loading: skeleton matching the card's final height.
- Empty: no battery → "No battery yet" + "Find a battery".
- Error: simulated failure → message + retry.
- Ready: live values.

**Done when:**
- The interval is created and cleared correctly; no updates after unmount.
- Initial render is deterministic (no `Math.random()` in the first paint) so hydration stays clean.
- Charge is clamped to 0–100 and announced accessibly (`role="meter"` or an equivalent labelled element).
- Values are readable at 360px and do not reflow as they change.
- Simulated data is labelled in code comments. The on-screen "Simulated data" label was removed at the product owner's request (2026-10-29; see `architecture.md` §13).

**Depends on:** tokens, `Card`, `StatusPill`, `BatteryMeter`.

---

## 1.2 Active leases display `[~]`

**Files:** `features/dashboard/components/active-leases-list.tsx`

**Goal:** show what the user currently holds and how long is left.

**UI:**
- Section header "Active leases" with "See all".
- Up to 3 rows: battery label, status pill, time remaining, amount, chevron.
- Row links to the lease detail screen.

**Mock data:** `mockLeases` filtered to `active | ending-soon | overdue`.

**States:**
- Loading: three skeleton rows.
- Empty: "No active leases" + "Browse batteries".
- Error: message + retry.
- Ready: list, with `overdue` sorted first, then `ending-soon`, then `active`.

**Done when:**
- Dates are formatted with `Intl` (relative in the row, absolute in the detail view).
- Amounts come from minor units and render as `₱` currency.
- Overdue rows are visually and textually distinct, not just red.
- No layout shift between loading and ready.

**Depends on:** tokens, `ListRow`, `StatusPill`, `Skeleton`, `EmptyState`.

---

## 1.3 Energy trading summary `[~]`

**Files:** `features/dashboard/components/trading-summary.tsx`

**Goal:** show earning activity at a glance, without building the trading UI.

**UI:**
- "Earned this month" amount, large.
- Secondary stats: kWh sold, open offers.
- Seven-day mini bar chart drawn with CSS (no chart library by default).
- "View trading history" may be a disabled row with a "Coming soon" note.

**Mock data:** `mockTradingSummary` with `earnedMinorUnits`, `kwhSold`, `openOffers`, `last7Days: number[]`.

**States:** loading (bar skeleton), empty ("No trading activity yet"), error, ready.

**Done when:**
- Bar heights are proportional and the chart has an accessible text summary or table equivalent.
- Amounts and kWh use locale formatting; zero is shown as `₱0.00`, not blank.
- No chart dependency was added without approval.

**Depends on:** tokens, `Card`, `StatTile`.

---

## 1.4 Quick actions panel `[~]`

**Files:** `features/dashboard/components/quick-actions.tsx`

**Goal:** the three or four things a user most often does, one tap away.

**UI:** 4-up grid, icon + label, 44px+ targets: **Lease**, **Return**, **Pay**, **Track**.

**Behavior:**
- Lease → `/batteries`.
- Track → battery details/map.
- Pay → payment flow for the active lease.
- Return → instructions sheet (no real return yet).

**States:** actions that cannot run are visibly disabled with a reason on tap (e.g. "No active lease to return").

**Done when:**
- Every action either navigates, opens a sheet, or is disabled with an explanation. No dead links or silent no-ops.
- Keyboard reachable in a logical order; each item has an accessible name.
- Icons are inline SVG or an approved icon set — no dependency added silently.

**Depends on:** tokens, `Button`/`IconButton`, routing.

---

## 1.5 Notification center `[~]`

**Files:** `features/dashboard/components/notification-center.tsx`, optional `app/notifications/page.tsx`

**Goal:** one place for battery alerts, lease reminders, payment results, and maintenance notices.

**UI:**
- Header bell with unread count badge.
- Sheet or screen listing notifications: icon, title, one-line body, relative time, unread dot.
- "Mark all as read" (in-memory only).

**Mock data:** `mockNotifications` covering unread/read, all severities, and an empty case.

**States:** loading skeleton rows, empty ("You're all caught up"), error, ready.

**Done when:**
- Unread count matches the list and updates when marked read.
- New simulated notifications are announced with `aria-live="polite"` and do not steal focus.
- Severity is conveyed by icon and text, not color alone.
- Timestamps are relative and update sensibly ("just now" → "2h ago").

**Depends on:** tokens, `Sheet` or route, `ListRow`, `StatusPill`.

---

# Epic 2 — Battery Management Interface

Feature: `features/battery-leasing/`
Root: `battery-leasing.tsx`
Outcome: a user can find a battery, understand it, lease it, pay for it (simulated), and manage the lease afterwards.

## 2.1 Available batteries map `[~]`

**Files:** `features/battery-leasing/components/battery-map.tsx`, `battery-list.tsx`, `battery-pin.tsx`

**Goal:** find a nearby available battery and select it.

**UI:**
- Map/list toggle, list is the default on small screens or when maps are unavailable.
- Pins colored by status with a text label in the selected card.
- Selected battery card docked at the bottom: label, distance, kiosk, charge, "View details".

**Provider:** mapcn on MapLibre GL (approved 2026-10-29). Basemaps: Color (CARTO Voyager, default), Dark (CARTO Dark Matter), Satellite (Esri World Imagery + place labels), picked with a radio group on the map and kept in `?map=`. No API key. If MapLibre cannot start, the map area offers "Show list".

**Mock data:** `mockBatteries` with `location.lat/lng`, `distanceKm`, `kioskName`, `status`, `chargePercent`, `pricePerHourMinorUnits`.

**States:**
- Location permission: idle → requesting → granted → denied (list + manual location note).
- Map: loading, provider error (fall back to list), ready.
- Empty: "No batteries nearby" + widen-search action.

**Done when:**
- Every battery reachable without the map, with full keyboard support in list view.
- Selecting a pin updates the docked card and is announced.
- Denied permission never blocks the feature.
- No API key is required for the default experience; any key would be an approval item.
- Map container has a fixed height, no layout shift, and does not trap page scroll.

**Depends on:** mapcn (`components/ui/map.tsx`), tokens, `Card`, `Sheet`.

**Known gaps:** batteries at the same kiosk share a pin position and overlap (the list shows them all); the MapLibre worker loads from unpkg, so the map needs internet.

---

## 2.2 Battery details modal `[~]`

**Files:** `features/battery-leasing/components/battery-details-sheet.tsx`

**Goal:** everything needed to decide whether to lease this battery.

**UI (bottom sheet / dialog):**
- Label, status pill, kiosk and distance.
- Charge meter and health meter with percentages.
- Estimated range, price per hour, last updated.
- Primary: **Lease this battery**. Secondary: **Directions**.

**States:** loading (opened before data resolves), error (unavailable battery), ready, unavailable (disabled primary + reason).

**Done when:**
- Focus is trapped, `Escape` closes, focus returns to the pin/row that opened it.
- Background scroll is locked while open.
- Deep link (`/batteries/[batteryId]` or `?battery=`) opens the same content if implemented.
- Charge and health are clearly different numbers with different labels.
- Unavailable batteries cannot start the wizard.

**Depends on:** 2.1 selection, `Sheet`, `BatteryMeter`, `StatusPill`.

---

## 2.3 Lease creation wizard `[~]`

**Files:** `features/battery-leasing/components/lease-wizard/*` (`step-duration.tsx`, `step-details.tsx`, `step-review.tsx`, `wizard.tsx`), `features/battery-leasing/hooks/use-lease-draft.ts`

**Goal:** turn a selected battery into a reviewable lease draft.

**UI:**
- Step 1 — Duration only (1 hour / 1 day / 1 week). Leases start now; the start-time choice was removed for simplicity (2026-10-29).
- Step 2 — Confirmation details (kiosk, pickup instructions, user contact placeholder).
- Step 3 — Review: battery, duration, total, terms note.
- Persistent stepper, back navigation, one primary action per step.

**Mock data:** draft object in `useReducer`; total computed from `pricePerHourMinorUnits` × duration.

**States:** invalid step (inline errors), unavailable battery (block with reason), submitting (disabled + progress), error (retry).

**Done when:**
- Back never loses entered values; refresh behavior is documented (URL state is preferred).
- Continue is disabled until the step is valid; errors are announced and linked to fields.
- Leaving with unsaved input asks for confirmation.
- Totals are computed in minor units and formatted once at render.
- The flow is usable with keyboard only at 360px.

**Depends on:** 2.2, `Stepper`, `TextField`, `Button`, `Sheet`.

---

## 2.4 Payment interface `[~]`

**Files:** `features/battery-leasing/components/payment/*` (`payment-summary.tsx`, `payment-method.tsx`, `payment-result.tsx`)

**Goal:** simulate paying for a lease convincingly enough to validate the UX.

**UI:**
- Total due, large; lease summary line.
- Mock payment method row (no real provider).
- Primary: **Pay ₱X**.
- Processing state, success receipt, failure with retry and "change method".
- A permanent, unmissable label: "Demo only — no real payment is processed."

**Mock data:** `mockPaymentMethods`, `simulatePayment()` returning success ~80% of the time.

**States:** idle, processing, success, failure, cancelled.

**Done when:**
- Double submission is impossible; the button locks during processing.
- Failure offers a clear next step and preserves the draft.
- Success shows a receipt-style summary and a route back to the lease.
- No network request, key, or SDK is introduced.
- Amounts never render as floats or without currency.

**Depends on:** 2.3, `Button`, `Card`, `StatusPill`.

---

## 2.5 Lease management panel `[~]`

**Files:** `features/battery-leasing/components/lease-panel/*` (`lease-tabs.tsx`, `lease-row.tsx`, `lease-detail.tsx`, `lease-actions.tsx`)

**Goal:** manage existing leases: see status, extend, return, report an issue.

**UI:**
- Tabs: Now · Returned (counts in tab labels). Late leases are listed first under Now. Simplified from three tabs on 2026-10-29.
- Rows with battery, status, time remaining, amount.
- Detail view: timeline (start → now → end), actions, help.
- Actions open confirmation sheets: Extend, Return, Report issue.

**Mock data:** `mockLeases` plus in-memory mutations; reload resets.

**States:** loading per tab, empty per tab, error, ready, action-in-progress, action-success, action-failure.

**Done when:**
- Actions update the list immediately and consistently across tabs.
- Destructive actions require confirmation with the consequence spelled out.
- Empty states differ per tab ("No active leases" vs "No completed leases yet").
- Overdue copy explains what happens next without threatening language.
- Keyboard and screen-reader paths work for tabs and confirmations.

**Depends on:** 2.4, `ListRow`, `Sheet`, `StatusPill`, `EmptyState`.

---

# Epic 4 — Rental admin

Feature: `features/admin/`
Root: `admin.tsx`
Route: `/admin` (the admin demo login lands here)

## 4.1 Rental admin dashboard `[~]`

**Files:** `features/admin/components/{admin-workspace,admin-header,admin-home,admin-nav,rental-list,rental-sheet,rent-form-sheet,available-batteries,branch-card,branch-map}.tsx`, `features/admin/{status,validation}.ts`

**UI (phone-width, wallet-style layout — see `design.md` §8.8):** bottom nav Home · Rentals · raised **Rent out** · Batteries · Map; **Rent out a battery** form (rider name, PH mobile number, ready battery, 1 hour / 1 day / 1 week, cost); "Who has a battery" with Out now / Returned, late first; a rental sheet with phone, battery, kiosk, times, cost, **Mark as returned** and **Call**; "Available batteries" by branch as a list (each ready battery has **Rent out**, which pre-fills the form) or a mapcn map with one pin per branch showing its ready count (0 ready highlighted).

**States:** loading skeleton, empty per list, error + retry (`?demo=`), ready, returned notice.

**Done when:** late is shown in text and colour; renting out and marking returned update the tiles, list, and branch counts together; form errors are announced and focus the first invalid field; the map is never the only way to see a branch; keyboard + 360px checks pass.

---

# Epic 3 — Energy Trading + Battery Tracking

> **Paused 2026-10-29.** Hidden at the product owner's request: `/trading` returns 404, and the Trade nav item and dashboard trading card are commented out (search `TRADING PAUSED`). The code in `features/trading/` is kept as is. Items 3.1–3.6 stay `[~]` until the screen is restored.

Feature: `features/trading/`
Root: `trading.tsx`
Route: `/trading` (human-approved scope change; see `architecture.md` §13)
Outcome: a user can watch a battery's live state, browse peer offers, list spare energy, simulate a trade, and review their portfolio.

All values are mock data. Trades and offers live in memory and reset on reload. No canister, payment, map provider, or GPS service is involved.

## 3.1 Battery tracking `[~]`

**Files:** `features/trading/components/battery-tracking-panel.tsx`, `tracking-map.tsx`, `usage-chart.tsx`, `features/trading/hooks/use-battery-tracking.ts`

**UI:** live charge meter, "You can drive about", where it is (kiosk and distance), battery condition word, and battery care alerts with text + tone. The GPS preview, coordinates, and usage chart were removed on 2026-10-29 to keep the screen simple.

**States:** loading skeleton, empty ("No battery to track" + "Find a battery"), error + retry, ready.

**Done when:** the interval cleans up, health stays distinct from charge, the chart has an accessible table equivalent, and simulated data is labelled.

## 3.2 Marketplace browser `[~]`

**Files:** `features/trading/components/market-browser.tsx`

**UI:** open offers, cheapest first: kWh, price per kWh, seller, kiosk, distance, and an outlined Buy button. No sort control (removed 2026-10-29). "Sell my extra power" sits below the list.

**States:** loading, empty ("No open offers" + create action), error, ready.

**Done when:** every offer is reachable by keyboard, the sort control exposes its state, and prices use `Intl` currency formatting.

## 3.3 Create offer interface `[~]`

**Files:** `features/trading/components/create-offer-sheet.tsx`

**UI:** sheet with the tracked battery, spare energy (bounded by charge), price per kWh, and potential earnings. Per-field errors, one primary action.

**States:** no battery, invalid fields, ready, submitted (in-memory only).

**Done when:** validation is announced and linked to fields, the sheet traps focus, and the demo label is visible.

## 3.4 Trade execution UI `[~]`

**Files:** `features/trading/components/trade-sheet.tsx`, `features/trading/hooks/use-market.ts`

**UI:** quantity input with minimum and available limits, live total, confirmed receipt. Simulated success/failure; no real payment.

**States:** idle, processing (button locked), success, failure (retry), cancelled.

**Done when:** double submission is impossible, failure preserves the draft, and no network call is introduced.

## 3.5 Portfolio management `[~]`

**Files:** `features/trading/components/portfolio-panel.tsx`

**UI:** earned/spent this month, energy traded, live open-offer count, own offers with a confirmation sheet before cancelling.

**States:** loading, empty ("No trading activity yet"), error, ready, action success/failure.

**Done when:** cancelling requires confirmation with the consequence spelled out, and the open-offer count matches the list.

## 3.6 Trading history `[~]`

**Files:** `features/trading/components/portfolio-panel.tsx`

**UI:** newest-first buys and sells with counterparty, energy, amount, and timestamp. Amounts are signed and paired with "Bought"/"Sold" text.

**States:** loading, empty ("No trades yet"), error, ready.

**Done when:** dates use `Intl`, no raw minor units appear, and direction is not conveyed by color alone.

---

## Suggested build order

1. App shell + tokens + `Button`/`Card`/`StatusPill`.
2. 1.4 Quick actions (exercises routing and layout).
3. 1.2 Active leases (exercises lists, formatting, empty states).
4. 1.1 Battery status (first client island and simulated live data).
5. 1.5 Notification center (shared sheet/list patterns).
6. 2.1 Battery map (or list-only first, if the map provider is unresolved).
7. 2.2 Battery details sheet (first dialog + focus trap).
8. 2.3 Lease wizard (largest state surface).
9. 2.4 Payment (state machine + failure paths).
10. 2.5 Lease management (mutations + confirmations).
11. 3.1–3.6 Trading + tracking (reuses cards, sheets, meters, and mock-load patterns).

Rationale: each step reuses primitives built by the previous one, and the riskiest unknowns (map provider, wizard state) come after the patterns are proven.

---

## Out of scope (do not build yet)

- Real canister calls, Internet Identity login, or session handling.
- Real payments, ckBTC/ICRC transfers, or wallet connections.
- Real GPS tracking, live telemetry, or hardware integration.
- Order matching, settlement, withdrawals, and real ckBTC/ICRC transfers. The trading screens are mock-only; the dashboard summary is no longer the only trading surface.
- Push notifications, email, SMS.
- Backend persistence, database, or API routes.
- Authentication-gated layouts.
- Dark mode.
- Native mobile app or PWA install flow.

If an item seems to need any of these, stop and ask. Do not stub a fake integration that looks real.

---

## Definition of done (every item)

Inherit all of `rules.md` §6, plus:

- [ ] All four UI states exist and are reachable in the demo.
- [ ] Mock data covers the edge cases named in the item.
- [ ] Copy follows `design.md` §9; simulated behavior is labeled.
- [ ] Roadmap checkbox and progress table updated in the same change.
- [ ] Report includes files changed, checks run, and `Git commands run: none`.

See also: [`skills.md`](./skills.md) for the task → skill matrix · [`design.md`](./design.md) for screen blueprints · [`glossary.md`](./glossary.md) for vocabulary.

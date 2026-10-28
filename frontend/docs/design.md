# Design Direction

**Status:** direction approved, palette not chosen. No hex values are committed yet.
**Read first:** [`rules.md`](./rules.md) · [`architecture.md`](./architecture.md).
**Last updated:** 2026-10-28

---

## 1. The intent

ChargeX should feel like a wallet app: **plain, calm, and obvious**. The reference point is GCash's simplicity — one clear task per screen, big rounded cards, a short bottom nav, large readable amounts, minimal chrome.

We are borrowing the *approach*, not the brand:

- ✅ Card-based home, quick-action grid, bottom navigation, one primary action per screen.
- ❌ GCash's blue palette, logo, icon set, copy, or exact layouts.

A first-time user should be able to lease a battery without reading instructions. If a screen needs a paragraph to explain itself, the screen is wrong.

---

## 2. Principles

1. **One primary action per screen.** Everything else is secondary or tertiary.
2. **Show the number that matters.** Charge, price, time remaining — large and unambiguous.
3. **Calm surfaces.** Light canvas, white cards, one accent. No decorative gradients or illustrations.
4. **Progressive disclosure.** Summary first; details in a sheet or a dedicated screen.
5. **Touch first.** 44px minimum targets, thumb-reachable primary actions, bottom navigation.
6. **States are designed.** Loading, empty, error, and success are part of the screen, not an afterthought.
7. **Words beat icons.** Icon + label in navigation and actions. No mystery meat.
8. **Motion is feedback, not decoration.** 150–200ms, and disabled under `prefers-reduced-motion`.

---

## 3. App shell

Mobile-first, single column. The desktop layout is the same column, centered — not a stretched dashboard.

```
┌─────────────────────────────┐
│  Good morning, Alex    🔔 3 │  sticky header, 56px
├─────────────────────────────┤
│                             │
│   ┌─────────────────────┐   │
│   │  summary card       │   │  first card carries the
│   │  charge / spend     │   │  screen's main number
│   └─────────────────────┘   │
│                             │
│   Quick actions             │  4-up icon grid
│   ┌────┐ ┌────┐ ┌────┐ ┌──┐ │
│   │    │ │    │ │    │ │  │ │
│   └────┘ └────┘ └────┘ └──┘ │
│                             │
│   Active leases        See  │
│   ┌─────────────────────┐   │
│   │ row                 │   │
│   └─────────────────────┘   │
│                             │
├─────────────────────────────┤
│  Home  Batteries  Leases  Me│  bottom nav, 64px + safe area
└─────────────────────────────┘
```

Rules:

- Content width `max-w-md` (~448px) centered on larger screens; page background stays visible outside it.
- Header: 56px, title or greeting on the left, at most two icon actions on the right.
- Bottom nav: 3–5 items, icon + label, active item uses the accent color plus a filled icon. Never hide primary navigation behind a hamburger on mobile.
- Safe-area padding at the bottom (`pb-[env(safe-area-inset-bottom)]`).
- No nested scroll containers. The page scrolls; sheets scroll internally.
- Sheets/modals: slide up from the bottom on mobile, centered dialog on desktop.

---

## 4. Design tokens

Names are fixed now so components can be written before the palette exists. Values live in `app/globals.css` under `@theme inline` and are chosen later.

### Color roles

| Token | Tailwind usage | Role |
| --- | --- | --- |
| `--color-canvas` | `bg-canvas` | Page background |
| `--color-surface` | `bg-surface` | Cards, sheets, nav |
| `--color-surface-muted` | `bg-surface-muted` | Insets, disabled fields, skeletons |
| `--color-line` | `border-line` | Dividers, card borders, input borders |
| `--color-ink` | `text-ink` | Primary text |
| `--color-ink-muted` | `text-ink-muted` | Secondary text, captions, placeholders |
| `--color-primary` | `bg-primary` / `text-primary` | The one accent: primary action, active nav |
| `--color-primary-foreground` | `text-primary-foreground` | Text/icons on primary |
| `--color-primary-soft` | `bg-primary-soft` | Selected states, subtle accent fills |
| `--color-success` / `-soft` | `text-success` / `bg-success-soft` | Charged, active, paid |
| `--color-warning` / `-soft` | `text-warning` / `bg-warning-soft` | Low charge, ending soon |
| `--color-danger` / `-soft` | `text-danger` / `bg-danger-soft` | Fault, overdue, destructive |
| `--color-info` / `-soft` | `text-info` / `bg-info-soft` | Neutral system messages |
| `--color-focus` | `ring-focus` | Focus ring, always visible |
| `--color-overlay` | `bg-overlay` | Modal scrim |

### Shape, depth, type

| Token | Usage |
| --- | --- |
| `--radius-sm` | Inputs, small chips |
| `--radius-md` | Buttons, list rows |
| `--radius-lg` | Cards |
| `--radius-xl` | Sheets, hero cards |
| `--radius-full` | Pills, avatars |
| `--shadow-card` | Resting card elevation (subtle) |
| `--shadow-sheet` | Sheets, sticky bars |
| `--font-sans` | Geist Sans (already loaded) |

Rules:

- **No raw hex in components.** No `bg-[#...]`.
- Status colors are only for status. Never decorate with `success`/`danger`.
- Primary is for the single main action and the active nav item. Two primary buttons on one screen is a bug.
- Dark mode is deferred. Tokens make it possible later; do not add `dark:` variants now.

### Palette still to choose

Pick one direction, then fill the tokens in a single approved change. All candidates intentionally avoid GCash blue.

| Direction | Feel | Watch out for |
| --- | --- | --- |
| **A. Fresh green / deep teal** | Clean, energy, eco | Green must not read as "success" everywhere; keep status green distinct |
| **B. Warm amber / charcoal** | Friendly, warm, high contrast | Amber needs dark text, and danger red must stay distinguishable |
| **C. Deep violet / slate** | Modern, premium, fintech | Violet can drift toward blue; keep it clearly separate from GCash |

Selection criteria, non-negotiable:

- Primary passes 4.5:1 against its foreground for normal text.
- Status colors remain distinguishable in grayscale and for deuteranopia.
- The UI is readable at 360px in sunlight-level contrast.
- It looks calm at 90% white space.

---

## 5. Typography

Geist Sans only. No display font, no serif.

| Role | Size / line | Weight | Usage |
| --- | --- | --- | --- |
| Amount | 30 / 36 | 600 | Hero numbers (charge %, price) |
| Title | 22 / 28 | 600 | Screen titles |
| Section | 17 / 24 | 600 | Card and list section headers |
| Body | 15 / 22 | 400 | Default text |
| Label | 13 / 18 | 500 | Buttons, field labels, nav |
| Caption | 12 / 16 | 400 | Timestamps, helper text |

Rules:

- Sentence case everywhere. No ALL CAPS except 11px eyebrow labels, if ever needed.
- Body text never below 13px; primary content 15–16px.
- Numbers use tabular figures where alignment matters (lists, totals).
- Maximum line length ~65 characters; no justified text.
- Truncate with care: one line for list titles, two for descriptions.

---

## 6. Spacing, radius, and density

- Base unit: **4px**. Prefer even Tailwind steps: `2` (8px), `3` (12px), `4` (16px), `6` (24px), `8` (32px).
- Screen padding: 16px. Card padding: 16px. Gap between cards: 12–16px.
- List row height: 56–64px. Button height: 48px (primary), 40px (secondary), 36px (tertiary/chip).
- Card radius: `--radius-lg`; sheet top corners: `--radius-xl`.
- One idea per card. Avoid cards inside cards.
- Whitespace is the main design element — when in doubt, remove something.

---

## 7. Components to standardize

Build these in `components/ui/` as they are needed, not all upfront.

| Component | Variants / states |
| --- | --- |
| `Button` | primary, secondary, ghost, danger; sm/md/lg; loading, disabled |
| `IconButton` | with required `aria-label`; 44px hit area |
| `Card` | default, interactive (whole-card link), muted |
| `StatTile` | label, value, unit, trend, optional icon |
| `ListRow` | leading icon/avatar, title, subtitle, trailing value/chevron |
| `StatusPill` | success, warning, danger, info, neutral; always includes text |
| `BatteryMeter` | horizontal bar with charge %; accessible `role="meter"` |
| `BottomNav` | 3–5 items, active state, safe-area padding |
| `Sheet` | bottom sheet on mobile, dialog on desktop; focus trap; `Escape` |
| `Stepper` | step count, current step, back navigation |
| `TextField` | label, hint, error, prefix/suffix |
| `Skeleton` | text, card, row shapes |
| `EmptyState` | icon, title, one sentence, one action |
| `ErrorState` | plain message, retry |
| `Toast` | success/error, `aria-live="polite"`, auto-dismiss |

Component rules:

- Props describe meaning, not appearance: `variant="danger"` not `color="red"`.
- Every component works at 360px.
- Every interactive component has focus-visible styling from `--color-focus`.
- No component ships without its loading/disabled/error behavior where relevant.

---

## 8. Screen blueprints

### 8.1 Main dashboard

```
Header: greeting + notification bell (unread count)
┌───────────────────────────────┐
│ Battery status                │
│  78%  Charging                │  big number + status pill
│  ▓▓▓▓▓▓▓▓░░  Est. full 12:40  │
└───────────────────────────────┘
Quick actions
[Lease] [Return] [Pay] [Track]
Active leases             See all
┌───────────────────────────────┐
│ CX-BAT-014 · ends in 2 days   │
│ ₱120.00 · Active        →     │
└───────────────────────────────┘
Energy trading
┌───────────────────────────────┐
│ Earned this month   ₱1,240.00 │
│ 12 kWh sold · 3 open offers   │
└───────────────────────────────┘
```

### 8.2 Available batteries (map + list)

```
Header: "Find a battery"  [List|Map]
┌───────────────────────────────┐
│                               │
│          map / list           │
│      (pins + selected card)   │
│                               │
└───────────────────────────────┘
Bottom card (selected battery)
┌───────────────────────────────┐
│ CX-BAT-014        ● Available │
│ 1.2 km · Kiosk A · 92%        │
│ [ View details ]              │
└───────────────────────────────┘
```

Map rules: never the only way to find a battery. A list view must always exist. Permission denied or no map provider = list view, no dead end.

### 8.3 Battery details

Bottom sheet: label, status pill, charge meter, health meter, distance, kiosk, estimated range, price per hour. Primary action: **Lease this battery**. Secondary: **Directions**.

### 8.4 Lease creation wizard

```
[ 1 Details ] — 2 Payment — 3 Review
Choose duration
( ) 1 hour    ( ) 1 day    (•) 1 week
Start time
[ Now ▾ ]
[ Continue ]
```

Three steps max. Progress visible. Back never loses input. Review step repeats the total in large type. Simulated behavior is labeled.

### 8.5 Payment

```
Total due
₱1,250.00
Duration 1 week · CX-BAT-014

[ Pay ₱1,250.00 ]

Demo only — no real payment is processed.
```

States: idle → processing → success → failure (retry, change method). Never a spinner with no escape.

### 8.6 Lease management

Tabs: Active · Completed · Overdue. Each lease row: battery, status pill, time remaining, amount, chevron. Detail view: timeline, extend, report issue, return. Destructive actions use a confirmation sheet with the consequence spelled out.

---

## 9. Content style

- Sentence case, second person, no exclamation marks.
- Buttons are verbs: "Lease battery", "Continue", "Retry payment".
- Errors say what happened and what to do: "We couldn't load your leases. Check your connection and try again."
- Never blame the user. Never expose stack traces, IDs, or HTTP codes.
- Currency: `Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" })` → `₱1,250.00`.
- Dates: absolute in details ("Oct 28, 2026, 3:40 PM"), relative in lists ("in 2 days").
- Percent: whole numbers for charge and health (`78%`), one decimal only if precision matters.
- Label mock/simulated data plainly: "Demo data", "No real payment is processed."

---

## 10. Motion

- Duration 150–200ms, `ease-out` for entrances, `ease-in` for exits.
- Sheets slide up + fade scrim; buttons get a pressed state, not a bounce.
- Status changes (charge, lease state) cross-fade the value, not the whole card.
- Skeletons may shimmer slowly; disable under `prefers-reduced-motion`.
- No parallax, no auto-playing carousels, no attention-seeking loops.

---

## 11. Accessibility

- Contrast: 4.5:1 for body text, 3:1 for large text and UI boundaries.
- Never encode status in color alone — pill text + icon.
- Focus ring: 2px `--color-focus` with 2px offset, on every focusable element.
- Touch targets 44×44px minimum; adjacent targets separated by at least 8px.
- Dialogs: focus trap, `Escape` closes, focus returns to trigger, background inert.
- Live updates (charge, notifications, payment result) announced politely via `aria-live`.
- Forms: visible labels, `aria-describedby` for hints/errors, errors announced on submit.
- Respect `prefers-reduced-motion` and never disable pinch zoom.
- Test with 200% text zoom — no clipped labels, no overlapping controls.

---

## 12. Design acceptance checklist

Before marking a UI item done:

- [ ] One obvious primary action; no competing accents.
- [ ] Works at 360px with no horizontal scroll.
- [ ] All four states implemented and reachable.
- [ ] Long text, missing values, and 99%/0%/100% values look right.
- [ ] Keyboard-only path complete; focus visible.
- [ ] Contrast and status-not-by-color checks pass.
- [ ] No raw hex, no inline styles for static values.
- [ ] Copy follows section 9; simulated data is labeled.

See also: [`roadmap.md`](./roadmap.md) · [`skills.md`](./skills.md) · [`glossary.md`](./glossary.md)

# Design Direction

**Status:** direction approved. Brand palette and logo approved (Figma file "chargex", 2026-10-29) and applied in `app/globals.css`.
**Read first:** [`rules.md`](./rules.md) · [`architecture.md`](./architecture.md).
**Last updated:** 2026-10-29

---

## 1. The intent

ChargeX should feel like a wallet app: **plain, calm, and obvious**. The reference point is GCash's simplicity — one clear task per screen, big rounded cards, a short bottom nav, large readable amounts, minimal chrome.

We are borrowing the *approach*, not the brand:

- ✅ Card-based home, quick-action grid, bottom navigation, one primary action per screen.
- ❌ GCash's blue palette, logo, icon set, copy, or exact layouts.

A first-time user should be able to lease a battery without reading instructions. If a screen needs a paragraph to explain itself, the screen is wrong.

**Who we design for:** many riders are older adults and tricycle drivers. They use the app outdoors, often one-handed, sometimes with weaker eyesight and little patience for technical words. So:

- Text is 16px or larger for anything a rider must read; 14px only for small print. Never 12px for content.
- Primary buttons are 56px tall, secondary 48px, with 16px semibold labels.
- Show the place (kiosk) and the number that matters (charge, price, due time) first. Battery codes, coordinates, and percentages of health come second or not at all.
- Use everyday words: "Bring back in 2 days", "Late", "You can drive about 42 km", "Battery condition: Good". Avoid "lease lifecycle", "telemetry", "portfolio", "offer", "SoH".
- One question per step, two tabs rather than three, and no sort or filter controls unless riders ask for them.
- Hide what a rider cannot act on (for example, batteries that are already leased).

---

## 2. Principles

1. **One primary action per screen.** Everything else is secondary or tertiary.
2. **Show the number that matters.** Charge, price, time remaining — large and unambiguous.
3. **Calm surfaces.** Off-white canvas, white cards, one accent (deep teal). The brand gradient appears only where §4.4 allows it; no other decorative gradients or illustrations.
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
│ [▣] Good morning, Alex 🔔 3 │  sticky header, 56px, brand tile
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
│ Home Batteries Leases Trade │  bottom nav, 64px + safe area
└─────────────────────────────┘
```

Rules:

- Content width `max-w-md` (~448px) centered on larger screens; page background stays visible outside it.
- Header: 56px, title or greeting on the left, at most two icon actions on the right. The home screen puts the small brand tile (§4.5) before the greeting; inner screens show a back link instead.
- Bottom nav: 3–5 items, icon + label, active item uses the accent color plus a filled icon. Never hide primary navigation behind a hamburger on mobile.
- Safe-area padding at the bottom (`pb-[env(safe-area-inset-bottom)]`).
- No nested scroll containers. The page scrolls; sheets scroll internally.
- Sheets/modals: slide up from the bottom on mobile, centered dialog on desktop.

---

## 4. Design tokens

Components use the token names below, never raw values. Values live in `:root` in `app/globals.css` and are exposed to Tailwind through `@theme inline`. Change a value there and the whole app follows.

### 4.1 Color roles

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
| `--color-brand-green` | `from-brand-green`, `bg-brand-green` | Brand accent: logo, gradients, chart fills. Never text on light surfaces |
| `--color-brand-blue` | `to-brand-blue` | Brand accent: logo gradient end. Never text on light surfaces |
| `--color-success` / `-soft` | `text-success` / `bg-success-soft` | Charged, active, paid |
| `--color-warning` / `-soft` | `text-warning` / `bg-warning-soft` | Low charge, ending soon |
| `--color-danger` / `-soft` | `text-danger` / `bg-danger-soft` | Fault, overdue, destructive |
| `--color-info` / `-soft` | `text-info` / `bg-info-soft` | Neutral system messages |
| `--color-focus` | `ring-focus` | Focus ring, always visible |
| `--color-overlay` | `bg-overlay` | Modal scrim |

### 4.2 Shape, depth, type

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

### 4.3 Brand palette

Six colours from the brand sheet. Everything else is derived from them.

| Swatch | Hex | Meaning | Token(s) |
| --- | --- | --- | --- |
| Deep Teal | `#0F4C4C` | Trust, stability, technology | `primary`, wordmark |
| Green | `#2EAD7F` | Sustainability, growth, renewal | `brand-green` |
| Blue Teal | `#5DA9C8` | Innovation, connectivity, progress | `brand-blue` |
| Mint | `#D6EDE2` | Clean energy, balance, future | `primary-soft` |
| Charcoal | `#2B3640` | Clarity, professionalism, focus | `ink` |
| Off White | `#F7FAF7` | Simplicity, space, clean design | `canvas` |

Derived values (all in `app/globals.css`):

| Token | Value | Why |
| --- | --- | --- |
| `surface` | `#FFFFFF` | Cards sit one step above the off-white canvas |
| `surface-muted` | `#EEF4F1` | Mint-tinted inset: skeletons, meter tracks, hovers |
| `line` | `#D9E4DF` | Mint-tinted divider |
| `ink-muted` | `#56636D` | Lighter charcoal; 5.9:1 on canvas |
| `primary-foreground` | `#FFFFFF` | 9.7:1 on deep teal |
| `success` / `-soft` | `#1A7A57` / `#DDF2E8` | Darker brand green so status text passes AA |
| `warning` / `-soft` | `#9A5B0B` / `#FDF1DC` | Amber, warm enough to stand apart from the greens |
| `danger` / `-soft` | `#B42318` / `#FDE7E4` | Red, clearly apart from every brand hue |
| `info` / `-soft` | `#1E6A8A` / `#E2F0F6` | Darker blue teal so text passes AA |
| `focus` | `#2B7FA3` | Blue teal, 4.3:1 on canvas (3:1 needed) |
| `overlay` | `rgb(15 38 41 / 0.55)` | Deep-teal scrim |
| `shadow-card`, `shadow-sheet` | Teal-tinted, low opacity | Shadows pick up the brand instead of grey |

Contrast checks (WCAG 2.2):

| Pair | Ratio | Needed |
| --- | --- | --- |
| `ink` on `canvas` | 11.7:1 | 4.5:1 |
| `ink-muted` on `surface` | 6.2:1 | 4.5:1 |
| `primary-foreground` on `primary` | 9.7:1 | 4.5:1 |
| `primary` on `primary-soft` | 7.9:1 | 4.5:1 |
| `success` on `success-soft` | 4.5:1 | 4.5:1 |
| `info` on `info-soft` | 5.2:1 | 4.5:1 |
| `warning` on `warning-soft` | 4.9:1 | 4.5:1 |
| `danger` on `danger-soft` | 5.6:1 | 4.5:1 |
| `brand-green` on white | 2.8:1 | Fails for text: fills and logo only |
| `brand-blue` on white | 2.6:1 | Fails for text: fills and logo only |

Rules:

- **Brand green and blue teal are never text colours on light surfaces.** Use them for fills, gradients, and the logo.
- Success is a darker green than the brand green and always comes with a pill label and glyph. Never use `success` as decoration.
- Deep teal (`primary`) stays the single main action and the active nav item.

### 4.4 Brand gradient

Deep teal → green, echoing the swoosh in the logo. Use it only in these places:

| Where | Classes |
| --- | --- |
| Charge meter fill above 20% (`components/ui/battery-meter.tsx`) | `bg-linear-to-r from-primary to-brand-green` |
| Chart bars (`trading-summary.tsx`, `usage-chart.tsx`) | `bg-linear-to-t from-primary to-brand-green` |
| The "X" of the wordmark | `from-brand-green to-brand-blue`, clipped to the text |
| Auth screen background wash | `bg-linear-to-b from-primary-soft/70 via-canvas to-canvas` |

At 20% charge or less the meter switches to solid `warning`. Do not put the gradient on buttons, cards, or headers.

### 4.5 Logo

Source: the "Logo variations" and lockup sheets in the Figma file. Implemented in `components/common/logo.tsx`; files in `public/brand/`.

| Variation | Component | Asset | Use it for |
| --- | --- | --- | --- |
| Primary lockup: colour mark + "CHARGEX" wordmark | `<Logo />` with `size="sm"`, `"md"` or `"lg"` | `chargex-mark.png` + live text | Login, sign-up, brand moments on light surfaces |
| Lockup with tagline | `<Logo tagline />` | Same | Auth screens. Tagline: "Decentralized power, distributed purpose" |
| Colour mark | `<Logo variant="mark" />` | `chargex-mark.png` (512px, transparent) | Light surfaces with little room |
| Dark app tile: light mark on deep teal | `<Logo variant="tile" />` | `chargex-tile-dark.png` (256px, rounded corners built in) | Home header, small sizes, a future app icon or favicon |
| Light app tile: colour mark on an off-white tile | Not built yet | Colour mark on `bg-surface` | Add when a splash screen or store listing needs it |
| Single-colour deep teal mark | Not built yet | — | Add for print or one-colour contexts |

Wordmark: Geist Sans, extra-bold, uppercase, tight tracking, `text-primary`. The "X" uses the green → blue-teal gradient. The underlying text is "ChargeX", so screen readers say the name.

Rules:

- Do not recolour, stretch, rotate, or redraw the mark. Use the exported files.
- Keep clear space of at least half the mark's height around the lockup.
- Minimum sizes: mark 24px, tile 28px, lockup 120px wide.
- The colour mark has a transparent inside and is drawn for light surfaces. On deep teal or busy backgrounds, use the tile.
- Next to the visible word "ChargeX" the mark is decorative (`alt=""`). On its own it gets `alt="ChargeX"`.
- The mark is a raster export from Figma. Swap in an SVG when design supplies one; the component API stays the same.

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

Map rules: never the only way to find a battery. A list view must always exist. Permission denied or map failure = list view, no dead end.

Map styles (`features/battery-leasing/data/map-styles.ts`): **Color** (default, CARTO Voyager), **Dark** (CARTO Dark Matter), **Satellite** (Esri imagery with place labels). The picker sits top-left on the map, zoom buttons top-right (44px), attribution bottom-right. Pins are white discs with a status-coloured pin icon so they read on all three; the selected pin gets a deep teal ring and a text label. Panning needs two fingers or Ctrl so the page still scrolls.

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

Tabs: **Now** (active, due soon, and late, with late first) · **Returned**. Each row: battery, "Bring back in …" or "Was due …", one status pill (Active / Due soon / Late / Returned). Detail view: the due time as the big line, the date under it, cost, then **Add more time**, **Return battery**, **Report a problem**. Destructive actions use a confirmation sheet with the consequence spelled out.

### 8.7 Energy trading + tracking

```
Header: "Buy and sell power"
[ Buy ] [ My battery ] [ Earnings ]   view tabs, URL-held

Buy  (cheapest first, no sort control)
┌───────────────────────────────┐
│ 3.5 kWh        ₱18.50 per kWh │
│ Maria S. · Kiosk B · 2.4 km   │
│ [ Buy ]                       │  outlined
└───────────────────────────────┘
[ Sell my extra power ]

My battery: big charge, "You can drive about", where it is,
battery condition (Good / Fair / Worn), battery care alerts.
No GPS preview, coordinates, or usage chart.
Earnings: "You earned" this month (big), "You spent", what you
are selling now (Stop, with confirmation), past buys and sales.

Buy and sell actions open sheets. Money actions keep the
line "This is a demo. No money will be taken."

---

## 9. Content style

- Sentence case, second person, no exclamation marks.
- Buttons are verbs: "Lease battery", "Continue", "Retry payment".
- Errors say what happened and what to do: "We couldn't load your leases. Check your connection and try again."
- Never blame the user. Never expose stack traces, IDs, or HTTP codes.
- Currency: `Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" })` → `₱1,250.00`.
- Dates: absolute in details ("Oct 28, 2026, 3:40 PM"), relative in lists ("in 2 days").
- Percent: whole numbers for charge and health (`78%`), one decimal only if precision matters.
- Label mock/simulated data plainly: "Demo data", "No real payment is processed." Exception: the dashboard (`/`) shows no on-screen demo labels, by the product owner's decision (2026-10-29). Its mock data is labelled in code comments, and it must never show a payment, lease action, or transfer as completed.

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

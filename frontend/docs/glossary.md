# Glossary

**Purpose:** one shared vocabulary so UI copy, code names, and docs mean the same thing.
**Read first:** [`rules.md`](./rules.md).
**Last updated:** 2026-10-28

Two rules for this file:

1. If a term is user-facing, the **UI label** column matters more than the internal definition.
2. If code and docs disagree, fix the docs and rename the code — do not maintain two vocabularies.

---

## 1. Product and domain terms

### BaaS — Battery-as-a-Service
A model where users lease charged batteries instead of buying them. ChargeX is a decentralized BaaS platform.
**Frontend relevance:** the app's core nouns are batteries and leases, not "products" or "orders".

### Battery
A physical, tokenized pack with a charge level, health, status, and location.
**UI label:** "Battery"
**Frontend relevance:** identified by `batteryId`; always show a human label (e.g. `CX-BAT-014`) next to it.
**Avoid:** "unit", "device", "item".

### Battery status
The current operational state of a battery: `charging`, `in-use`, `idle`, or `fault`.
**Frontend relevance:** status is a closed union in `types.ts`, not a free string. Style it with a status pill that includes text, not color alone.

### Lease
A time-bound right to use a specific battery. Has a start, an end, a cost, and a lifecycle status.
**UI label:** "Lease"
**Frontend relevance:** money and dates are formatted with `Intl`; never show raw ISO strings or unformatted minor units.

### Lease lifecycle
The states a lease moves through:

```
reserved → paid → active → ending-soon → completed
                     ↘ overdue
```

**Frontend relevance:** every lifecycle state needs copy, color, and an allowed action set. A lease in `overdue` must not show a "Return" button that silently fails.

### Lease creation wizard
The multi-step flow that reserves a battery, collects details, simulates payment, and confirms the lease.
**Frontend relevance:** one state object, per-step validation, back/forward without losing input.

### Telemetry
Time-series data reported by hardware: voltage, current, temperature, GPS, state of charge, state of health.
**Frontend relevance:** today it is mocked. Charts and live values must state that data is simulated.

### SoC — State of Charge
Remaining energy in a battery as a percentage.
**UI label:** "Charge"
**Frontend relevance:** clamp to 0–100 and render as percent + a bar.

### SoH — State of Health
Remaining capacity relative to a new battery, as a percentage.
**UI label:** "Health"
**Frontend relevance:** distinct from charge. Never merge the two into one number.

### BMS — Battery Management System
The hardware/firmware that monitors and protects the battery cells.
**Frontend relevance:** BMS alerts appear as notification-center items and battery warnings; the UI never claims to control the BMS.

### Kiosk
The Raspberry Pi station where a user picks up or returns a battery.
**Frontend relevance:** shown as a location type on the map and in lease pickup instructions.

### Energy trading
Peer-to-peer exchange of excess battery energy between users.
**Frontend relevance:** the dashboard summary is read-only for now; trading screens are out of the current roadmap scope.

### Predictive maintenance
AI-driven estimates of battery degradation or failure, produced by a canister.
**Frontend relevance:** surfaces as insights and alerts, always with a confidence or "estimate" label.

---

## 2. ICP terms

### ICP — Internet Computer Protocol
The blockchain platform hosting ChargeX's canisters and frontend assets.

### Canister
A smart contract plus its storage, running on ICP. ChargeX plans several: leasing/trading, telemetry, AI inference, user profile, notifications.
**Frontend relevance:** canisters are the future data source. Components never call them directly — adapters do.

### Principal
The cryptographic identifier of a user or canister on ICP.
**Frontend relevance:** display truncated with a copy action; never expose it as the primary user label when a name exists.

### Internet Identity (II)
ICP's authentication mechanism.
**Frontend relevance:** not implemented yet. Login screens must remain mock-only until approved, and must not fake a session that looks real.

### ICRC-7
The ICP NFT standard. Each battery is intended to be an ICRC-7 token.
**Frontend relevance:** "ownership" in the UI maps to NFT ownership later. Today it is mock state.

### ckBTC
A Bitcoin-backed token on ICP, intended for lease payments.
**Frontend relevance:** currency formatting and "demo payment" labeling matter. No real transfers.

### ICRC-1 / ICRC-2
Fungible token standards on ICP. ICRC-2 adds approvals/allowances, used for payment flows.
**Frontend relevance:** amounts are integers in minor units; format them at the edge, never store floats.

### Cycles
The compute unit canisters burn. Not user-facing.
**Frontend relevance:** none. Do not surface cycles in customer UI.

### Asset canister
The canister that serves the frontend build on ICP.
**Frontend relevance:** deployment concern, out of scope for UI work.

---

## 3. Frontend terms

### Feature
A self-contained product capability under `features/<name>/`, owning its components, types, mock data, and hooks.

### Feature root
The main file of a feature, named after its folder (`dashboard/dashboard.tsx`). It composes local components and selects data. It is the only file a route should import.

### Local component
A component used by exactly one feature, living in `features/<feature>/components/`.

### Primitive
A generic, style-focused component in `components/ui/` (Button, Card, Modal). Knows nothing about batteries or leases.

### Shared / common component
App chrome in `components/common/` (Header, BottomNav). May use primitives, never features.

### RSC — React Server Component
A component rendered on the server by default in the App Router. Cannot use state, effects, or browser APIs.

### Client component
A component marked `"use client"` that can use state, effects, and events. Keep these small and at the leaves of the tree.

### Hydration
React attaching interactivity to server-rendered HTML. Mismatches happen when markup depends on `Date.now()`, `Math.random()`, or `window` during the first render. Avoid those in initial markup.

### Design token
A named style value (color, radius, spacing, shadow) exposed as a CSS variable and used through Tailwind classes. Prevents raw hex and makes theming possible.

### Mock data
Typed fixtures in `features/<feature>/data/mock.ts` that stand in for backend data. Deterministic, varied, and labeled as mock in the UI where relevant.

### Adapter
The module that will translate canister/API responses into the feature's domain types. Components depend on the type, not the transport.

### Skeleton
A placeholder shaped like the final content, shown while loading. Preferred over a centered spinner.

### Empty state
The designed screen shown when there is genuinely no data, with one sentence and one next action.

### Optimistic UI
Updating the interface before the server confirms. Not used yet; requires a real backend and a rollback strategy.

### Wizard / stepper
A multi-step flow with progress, per-step validation, and back/forward navigation.

### Focus trap
Keeping keyboard focus inside a modal while it is open. Required for every dialog.

### Minor units
Integer amounts in the smallest currency unit (e.g. centavos). Prevents floating-point money bugs. Format only at render time.

### Search params
URL query values (`?tab=active`) read from `searchParams` in server components. Used for shareable UI state such as filters and wizard steps.

---

## 4. Naming rules that follow from this glossary

| Use | Not |
| --- | --- |
| `Battery`, `batteryId` | `device`, `unit`, `item` |
| `Lease`, `leaseId` | `rental`, `order`, `booking` |
| `chargePercent`, `healthPercent` | `soc`, `soh` in UI code (fine in comments) |
| `Kiosk` | `station` (unless it is a charging station entity) |
| `mockBatteries`, `mockLeases` | `batteries`, `leases` for fixtures |
| `status: "in-use"` | `status: "In Use"` |

See also: [`architecture.md`](./architecture.md) · [`design.md`](./design.md) · [`roadmap.md`](./roadmap.md)

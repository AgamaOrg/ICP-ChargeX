# Frontend Skills

**Purpose:** the capabilities required to build ChargeX's frontend well, and which ones each roadmap item demands.
**Read first:** [`rules.md`](./rules.md) · [`architecture.md`](./architecture.md).
**Last updated:** 2026-10-28

This is a capability checklist, not a course list. If you cannot honestly claim a skill marked **required now**, say so before starting the task instead of improvising.

---

## 1. Core skills (required now)

| Skill | What "good" looks like here | Verified by |
| --- | --- | --- |
| **Next.js 16 App Router** | Thin routes, server components by default, typed `PageProps` / `LayoutProps`, `Suspense` where async, no outdated caching habits | Routes contain no logic; build passes |
| **React 19 + Compiler** | Client islands, clean effect cleanup, no speculative memoization, no state duplication | No warnings; effects clean up |
| **TypeScript (strict)** | Discriminated unions for UI state, no `any`, no `!`, props typed at boundaries | `npx tsc --noEmit` |
| **Tailwind CSS v4** | Utility-first, token-driven, mobile-first, no raw hex, no CSS modules | Grep for `#` in `.tsx`; visual check |
| **Accessible UI (WCAG AA)** | Real controls, labels, focus rings, 44px targets, color never the only signal, modal focus trap | Keyboard-only run |
| **Responsive layout** | Works at 360px first, then widens; no horizontal scroll; touch-friendly | DevTools at 360 / 768 / desktop |
| **UI state design** | Loading skeleton, empty, error with retry, ready — all designed | Checklist per surface |
| **Mock data modeling** | Typed fixtures with realistic edge cases; deterministic; clearly labeled as mock | `data/mock.ts` review |
| **Content and formatting** | Plain language, `Intl` for currency/date/percent, no raw ISO strings | Visual check |
| **Docs discipline** | Roadmap checkbox updated, rules followed, honest report | Final report |
| **Git-free workflow** | Never changes repository state; read-only inspection at most | `Git commands run: none` |

---

## 2. Framework-specific knowledge

**This is Next.js 16.4 with `cacheComponents` and `partialPrefetching` enabled.** Training data for older versions is unreliable. Before using an API you are not certain about:

1. Look it up in `node_modules/next/dist/docs/` (bundled, version-matched).
2. Prefer the App Router guides over Pages Router examples.
3. If the bundled docs do not answer it, stop and ask — do not guess from memory.

Specific things this version does differently that matter to this project:

- `params` and `searchParams` are async.
- `PageProps<'/route'>` and `LayoutProps<'/route'>` are generated globals.
- Caching is component-level and opt-in via `use cache` + `cacheLife`; do not copy old `fetch` cache patterns.
- React Compiler is on: manual `useMemo` / `useCallback` is usually noise.
- The managed block in `frontend/AGENTS.md` is rewritten by `next dev`; leave it alone.

---

## 3. Domain skills (as features land)

| Skill | Needed for | Notes |
| --- | --- | --- |
| Map rendering | Available batteries map | mapcn on MapLibre GL (`components/ui/map.tsx`), CARTO and Esri basemaps without API keys. Must degrade to a list when unavailable |
| Geolocation | Map, battery details | Permission prompts, denied state, fallback location |
| Dialog / focus management | Battery details modal, confirmations | Prefer native `<dialog>` before adding a library |
| Multi-step form / wizard | Lease creation wizard | Single state object, per-step validation, back/forward, review step |
| Payment UX (simulated) | Payment interface | Amount in minor units, pending/success/failure/retry, explicit "demo only" copy |
| Data visualization | Energy trading summary | CSS bars first; chart library only with approval |
| Live data simulation | Battery status card | Interval + cleanup; clearly labeled mock |
| Notification feeds | Notification center | Unread state, relative time, `aria-live` for new items |
| Destructive action safety | Lease management panel | Confirmation dialog, clear consequence copy |
| Empty/edge state writing | Everything | Short, actionable, no blame |

---

## 4. Task → skill matrix

Maps every roadmap item to the skills it needs. Use it to spot missing capabilities before starting.

| Roadmap item | Core | Domain | Libraries (needs approval) |
| --- | --- | --- | --- |
| 1.1 Real-time battery status | Client island, effects, state design | Live data simulation | None |
| 1.2 Active leases display | Lists, formatting, empty states | Lease lifecycle copy | None |
| 1.3 Energy trading summary | Layout, formatting | Data visualization | Chart lib **TBD** |
| 1.4 Quick actions panel | Button hierarchy, routing, a11y | — | None (icons TBD) |
| 1.5 Notification center | Lists, relative time, a11y live region | Notification feeds | None |
| 2.1 Available batteries map | Responsive layout, loading/error | Map + geolocation | mapcn + `maplibre-gl` (approved) |
| 2.2 Battery details modal | Dialog, focus trap, scroll lock | Status semantics | None preferred |
| 2.3 Lease creation wizard | Complex state, validation | Multi-step form | None preferred |
| 2.4 Payment interface | State machine, error handling | Simulated payments | None (mock only) |
| 2.5 Lease management panel | Lists/cards, filters, confirmations | Destructive actions, lifecycle | None |

"TBD" means unresolved on purpose. Resolve it with the human before writing the feature; do not silently install a library.

---

## 5. If a skill is missing

Say it plainly, then pick the safest path:

1. **Name the gap:** "I have not used MapLibre clustering; I can do a list view first."
2. **Propose a fallback** that ships value without the missing skill or dependency.
3. **Ask for the decision** if the fallback changes the roadmap item's scope.
4. **Never fake competence** by shipping unverified code. A smaller honest feature beats a large broken one.

---

## 6. Pre-code checklist

Answer these before the first edit:

- [ ] Docs read: `rules.md`, `architecture.md`, roadmap item, `design.md` if UI.
- [ ] Which feature folder does this belong to? Does it already exist?
- [ ] Which components are local, which (if any) belong in `components/ui`?
- [ ] Server or client? Where exactly does the client boundary sit?
- [ ] What mock data shape is needed, and which edge cases must exist?
- [ ] What are the loading, empty, error, and ready states?
- [ ] Does this need a dependency or token change that requires approval?

---

## 7. Post-code checklist

- [ ] Lint, typecheck, and build pass.
- [ ] States covered; keyboard and 360px checked.
- [ ] No cross-feature imports, no raw hex, no `any`.
- [ ] Mock data clearly labeled; no implied real payment or canister call.
- [ ] Roadmap checkbox updated.
- [ ] Report written in the format from `rules.md` §7.
- [ ] No git commands run.

---

## 8. Learning resources that match this stack

- Bundled Next.js docs: `frontend/node_modules/next/dist/docs/` (authoritative for this version).
- Tailwind v4 theme docs: `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md` and the Tailwind v4 reference.
- WCAG 2.2 quick reference for contrast, focus, and target size.
- MDN for `dialog`, `Intl`, `prefers-reduced-motion`, and geolocation behavior.

Do not follow blog posts for APIs that the bundled docs contradict.

Next: [`glossary.md`](./glossary.md) · [`design.md`](./design.md) · [`roadmap.md`](./roadmap.md)

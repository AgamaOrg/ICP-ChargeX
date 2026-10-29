# Frontend Documentation

Documentation for the ChargeX web app in `frontend/`. Everything here is frontend-scoped: no canister, hardware, or deployment docs.

> **Read [`rules.md`](./rules.md) before writing any code.** Then [`architecture.md`](./architecture.md), and the relevant item in [`roadmap.md`](./roadmap.md).
>
> Git is read-only: never push, pull, commit, branch, or merge. Frontend only. Mock data only.

---

## Read order

1. [`rules.md`](./rules.md) — binding policy. Mandatory, in full.
2. [`architecture.md`](./architecture.md) — structure, dependency rules, conventions.
3. [`roadmap.md`](./roadmap.md) — the task list and acceptance criteria.
4. [`design.md`](./design.md) — required before any UI work.
5. [`skills.md`](./skills.md) and [`glossary.md`](./glossary.md) — as needed for the task.

---

## Docs

| File | What it covers |
| --- | --- |
| [`rules.md`](./rules.md) | Read-first policy, frontend-only scope, read-only git, ask-before list, code rules, definition of done |
| [`architecture.md`](./architecture.md) | Stack, folder layout, feature anatomy, dependency rules, server/client boundaries, routing, mock data layer |
| [`skills.md`](./skills.md) | Required capabilities, per-task skill matrix, pre/post-code checklists |
| [`glossary.md`](./glossary.md) | Product, ICP, and frontend terms, plus naming rules |
| [`design.md`](./design.md) | GCash-simple direction, brand palette, tokens and logo, components, screen blueprints, copy and a11y |
| [`roadmap.md`](./roadmap.md) | Dashboard and Battery Leasing epics, item specs, build order, out-of-scope list |

---

## Frontend layout

```
frontend/
├── app/                  # Routes only (thin files)
├── components/
│   ├── ui/               # Global primitives
│   └── common/           # Header, bottom nav, app chrome
├── docs/                 # This documentation set
├── features/             # Product code (feature folders only)
├── public/               # Static assets
├── AGENTS.md             # Agent entry point
└── README.md             # Project overview
```

---

## Feature convention

One capability = one folder, with local components kept beside it:

```
features/<feature>/
├── <feature>.tsx         # Feature root, default export
├── components/           # Used only by this feature
├── data/mock.ts          # Typed fixtures
├── hooks/                # Optional
└── types.ts              # Domain types
```

A route imports only the feature root (`@/features/dashboard/dashboard`). Features never import other features. Full rules: [`architecture.md`](./architecture.md) §3–§5.

---

## Current status

| Feature | Roadmap items | Status |
| --- | --- | --- |
| `dashboard` | 1.1 – 1.5 | Not started |
| `battery-leasing` | 2.1 – 2.5 | Not started |

The frontend is still the scaffold — no feature code exists yet. Status is owned by [`roadmap.md`](./roadmap.md); update the checkbox there in the same change that completes the work.

---

## Constraints

- **Brand palette and logo are set.** See `design.md` §4; use token classes, never raw colours.
- **No UI, map, chart, or state library.** Each requires approval before install.
- **Mock data only.** No canister, API, auth, or payment integration.
- **Read-only git.** The human owns commits, branches, and remotes.

# ChargeX Frontend

The web app for ChargeX, a decentralized Battery-as-a-Service platform on the Internet Computer. This app covers the user-facing side: the dashboard and the battery leasing flow.

Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4. Backend canister integration is not wired up yet — features use typed mock data.

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16.4 (App Router, Turbopack) |
| UI | React 19.3 + React Compiler |
| Language | TypeScript 5, `strict` |
| Styling | Tailwind CSS 4 (CSS-first tokens) |
| Lint | ESLint 9 (flat config, `eslint-config-next`) |

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

Type checking is part of the build; use `npx tsc --noEmit` for a quick check.

---

## Structure

```
frontend/
├── app/                  # Routes only (thin composition)
├── components/
│   ├── ui/               # Global primitives (Button, Card, Sheet, ...)
│   └── common/           # Header, bottom nav, app chrome
├── docs/                 # Architecture, rules, design, roadmap
├── features/             # Feature-based product code
│   └── <feature>/        # <feature>.tsx + local components/
├── public/               # Static assets
└── AGENTS.md             # Agent rules for this folder
```

One feature owns its components, types, and mock data. Features never import each other — shared code moves to `components/ui` or `lib/`.

---

## Documentation

Start here: [`docs/README.md`](./docs/README.md).

| Doc | Purpose |
| --- | --- |
| [`docs/rules.md`](./docs/rules.md) | **Read before coding.** Git policy, scope, code rules, definition of done |
| [`docs/architecture.md`](./docs/architecture.md) | Structure, dependency rules, conventions |
| [`docs/roadmap.md`](./docs/roadmap.md) | Task list and status |
| [`docs/design.md`](./docs/design.md) | Design direction and token contract |
| [`docs/skills.md`](./docs/skills.md) | Required capabilities per task |
| [`docs/glossary.md`](./docs/glossary.md) | Shared vocabulary |

---

## Ground rules

- **Read [`docs/rules.md`](./docs/rules.md) first.** It overrides habits and other notes.
- **Git is read-only.** Never push, pull, commit, branch, checkout, merge, rebase, or otherwise change repository state. Only `git status`, `git diff`, `git log`, and `git show` are allowed. The human owns all git operations.
- **Frontend only.** Do not touch canister, hardware, deployment, or shared code.
- **Mock data only.** No API, auth, or payment integration yet.
- **Ask before** installing packages or changing config, routes, or global design tokens.
- **Use the brand tokens.** Palette and logo are in `docs/design.md` §4. Do not hardcode colors.

---

## Status

| Feature | Items | Status |
| --- | --- | --- |
| Dashboard | Real-time battery status, active leases, trading summary, quick actions, notifications | Not started |
| Battery leasing | Battery map, details modal, lease wizard, payment, lease management | Not started |

See [`docs/roadmap.md`](./docs/roadmap.md) for item-level specs and acceptance criteria.

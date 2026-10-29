# ChargeX Frontend Rules

**Audience:** anyone (human or AI agent) writing code under `frontend/`.
**Status:** binding. This file overrides habits, defaults, and any conflicting note elsewhere in the repo.
**Last updated:** 2026-10-28

---

## 0. Read before you code

This is not a suggestion. Before the first edit of any session:

1. **Read this file in full.**
2. Read [`architecture.md`](./architecture.md).
3. Read the relevant item in [`roadmap.md`](./roadmap.md).
4. If the work touches UI, read [`design.md`](./design.md).
5. Skim [`glossary.md`](./glossary.md) if any domain term is unfamiliar.

If you already started coding: stop, read the docs, then check whether your approach violates them. Fix or revert your own work before continuing. Do not "finish first and read later".

Rules win over convenience. If a rule blocks the task, say so and ask — do not quietly work around it.

---

## 1. Scope: frontend only

- All work happens inside `frontend/`.
- Do **not** modify `application/`, `hardware/`, `deployment/`, `shared/`, `scripts/`, `main-website/`, or root files unless the human explicitly asks.
- **Mock data only.** No canister calls, no HTTP endpoints, no payment providers, no auth providers yet.
  - Mock data lives next to its feature: `features/<feature>/data/`.
  - Future real integrations go behind `features/<feature>/data/adapters/` or a shared `lib/` adapter — never directly inside components.
- Never invent backend contracts. If a screen needs data that has no defined shape, document a mock shape and flag it as an assumption.

---

## 2. Git is read-only

The human owns all repository state. AI agents must never change it.

### Forbidden — never run these

| Category | Commands |
| --- | --- |
| Remote sync | `git push`, `git pull`, `git fetch`, `git remote`, `git clone` |
| History writes | `git commit`, `git add`, `git commit --amend`, `git revert`, `git cherry-pick` |
| Branch / working tree | `git branch`, `git checkout`, `git switch`, `git merge`, `git rebase`, `git reset`, `git restore`, `git stash`, `git clean` |
| Release / metadata | `git tag`, `git notes`, `git config`, `git gc`, `git submodule`, `git lfs` |
| Platform | `gh` CLI, opening pull requests, issues, releases, or reviews |

Also forbidden:

- Editing anything inside `.git/`.
- Running the same commands through scripts, wrappers, aliases, or `npx`.
- "Just checking" with a command that writes (`--force`, `--hard`, `-f`, `--output`, `--set-upstream`).
- Asking the human to run one of these on your behalf to save time. Only describe the command if they asked for it.

### Allowed — read-only inspection only

`git status`, `git diff`, `git log`, `git show`.

These may use read-only flags (`--stat`, `--oneline`, `--name-only`, `-p`, `-- path`). They may not use flags that write files or change state.

### If a task seems to need git

Stop and ask the human. Examples: "should I commit this?", "the branch is behind". The answer is theirs to act on, not yours.

---

## 3. Ask before doing these

Get explicit approval before:

- Installing, removing, or upgrading any package, or editing `package.json` / `package-lock.json`.
- Editing `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, or `.gitignore`.
- Adding, renaming, or deleting routes in `app/`.
- Changing global design tokens in `app/globals.css` (the brand palette is approved and documented in `design.md` §4.3; values change only with approval).
- Deleting or renaming existing files, or moving code between features.
- Touching the Next.js managed block in `frontend/AGENTS.md`.
- Introducing a third-party UI, map, chart, animation, or form library.
- Adding environment variables, secrets, or external URLs.

When asking, state: what you need, why, the alternatives, and the cost of each.

---

## 4. Code rules

### Placement

- One feature = one folder: `features/<feature>/<feature>.tsx` plus `features/<feature>/components/`.
- Components used by exactly one feature live in that feature's `components/`.
- Promote to `components/ui/` only when a second feature genuinely needs it.
- `app/` files are thin composition layers. No business logic, no large markup.
- Never import across features. See the dependency rules in `architecture.md`.

### TypeScript

- `strict` is on: no `any`, no `@ts-ignore`, no non-null `!` to silence errors.
- Model data in `types.ts` inside the feature. Name props `<Component>Props`.
- Prefer discriminated unions for state (`{ status: "loading" } | { status: "ready"; data: X }`) over many booleans.
- Do not export types or helpers "for later". Add them when used.

### React and Next.js

- Server Components are the default. Add `"use client"` at the **smallest leaf** that needs state, effects, events, or browser APIs.
- Never put `"use client"` on a route page or on a feature root unless the entire feature is genuinely interactive.
- Do not pass functions, class instances, or `Date` objects across the server/client boundary — pass serializable data.
- React Compiler is enabled. Do not hand-write `useMemo` / `useCallback` for performance unless a measured problem is documented.
- Every `useEffect` that subscribes or starts a timer must clean up.
- No `dangerouslySetInnerHTML` without approval.
- This is Next.js **16.4**: check `node_modules/next/dist/docs/` before using any API you are not certain about. Old App Router advice may be wrong (`cacheComponents` and `partialPrefetching` are on).

### Styling

- Tailwind utilities plus design tokens. No CSS modules, no styled-components, no inline `style` except for dynamic values CSS cannot express.
- No raw hex, `rgb()`, or arbitrary brand colors in components. Use token classes (`bg-primary`, `text-ink-muted`, `border-line`, ...) defined in `app/globals.css`.
- No component-specific CSS files. If a style repeats, make a primitive in `components/ui/`.
- Mobile-first: write base styles for 360px, then `sm:`, `md:` upward.
- Use the spacing scale; avoid odd one-off paddings.

### Accessibility (not optional)

- Every interactive element is a real `button`, `a`, `input`, or `label`-associated control.
- Visible focus state on everything focusable. Never `outline: none` without a replacement ring.
- Touch targets at least 44×44px.
- Icon-only buttons need an accessible name.
- Status must never rely on color alone — pair color with text and/or icon.
- Modals trap focus, close on `Escape`, and restore focus to the trigger.
- Respect `prefers-reduced-motion`.
- Images need meaningful `alt` (or `alt=""` when decorative).

### UI states

Every data-driven surface ships with all four states:

1. **Loading** — skeleton that matches the final layout.
2. **Empty** — explains why it is empty and what to do next.
3. **Error** — plain-language message plus a retry action where possible.
4. **Ready** — the real content.

No spinner-only screens. No "undefined", "NaN", or raw ISO dates in the UI.

### Content and data

- Plain language. No internal jargon in user-facing copy.
- Format currency, dates, percentages, and distances with `Intl` APIs.
- Mock data must be clearly named (`mockBatteries`, `mockLeases`) and contain enough variety to exercise empty, full, and edge cases.
- Simulated behavior must be labeled in the UI or in code comments — never imply a real payment, lease, or canister call happened.

### Comments

Comment **why**, not **what**. Delete commented-out code. No TODO without an owner and a roadmap link.

---

## 5. Stop and ask when

- Lint, type check, or build fails and the fix requires touching config or installing something.
- The design is ambiguous (unclear flow, a new basemap or tile provider, a colour or logo use not covered by `design.md` §4).
- A feature needs data or behavior that does not exist in the mock layer.
- Two docs disagree, or a rule blocks the obvious implementation.
- You are about to do anything in section 3.

Guessing is worse than asking.

---

## 6. Definition of done

A task is done only when all of these are true:

- [ ] `npm run lint` passes in `frontend/`.
- [ ] `npx tsc --noEmit` passes in `frontend/`.
- [ ] `npm run build` succeeds in `frontend/`.
- [ ] All four UI states exist where data is shown.
- [ ] Keyboard-only use works; focus is visible; modal focus is trapped.
- [ ] Checked at 360px width and at desktop width.
- [ ] No raw hex colors, no `any`, no cross-feature imports.
- [ ] The matching checkbox in `roadmap.md` is updated, or the item is left unchecked with a note.
- [ ] You reported the files changed and the checks you ran.

Never "verify" by committing. Git is read-only (section 2).

---

## 7. Reporting format

**Before coding**, reply with:

```
Docs read: rules.md, architecture.md, roadmap.md, design.md
Plan: <feature folder> → <files you will add/change>
Open questions: <none, or the exact decision you need>
```

**After coding**, reply with:

```
Changed: <file list>
Checks: lint <pass/fail>, tsc <pass/fail>, build <pass/fail>
States covered: loading / empty / error / ready
Notes: <assumptions, follow-ups, anything skipped>
Git commands run: none
```

Honesty about a failing check is required. A hidden failure is a worse outcome than a slow fix.

---

## 8. Enforcement

- Humans review every change. Rules are checked in review, not trusted to memory.
- An agent that cannot follow these rules must stop and hand the task back.
- If a rule needs to change, change **this file first** with the human's approval, then the code.

See also: [`README.md`](./README.md) · [`architecture.md`](./architecture.md) · [`skills.md`](./skills.md) · [`glossary.md`](./glossary.md) · [`design.md`](./design.md) · [`roadmap.md`](./roadmap.md)

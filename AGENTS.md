# ChargeX Agent Instructions

These instructions apply to work in this repository, with extra rules for anything under `frontend/`.

## Read before coding (frontend)

Before writing or changing any file under `frontend/`, read these in order:

1. `frontend/docs/rules.md` — **mandatory, in full**
2. `frontend/docs/architecture.md`
3. `frontend/docs/roadmap.md` — the item you are working on
4. `frontend/docs/design.md` — for any UI work
5. `frontend/docs/glossary.md` — when naming or writing copy

If a request conflicts with `rules.md`, stop and ask the human. Do not work around the rules.

## Non-negotiables

- **Git is read-only.** Never run `push`, `pull`, `fetch`, `remote`, `clone`, `add`, `commit`, `branch`, `checkout`, `switch`, `merge`, `rebase`, `reset`, `restore`, `revert`, `cherry-pick`, `stash`, `tag`, `clean`, or any other state-changing git command. Only `git status`, `git diff`, `git log`, and `git show` are allowed. Never use the `gh` CLI, open pull requests, or touch `.git/`.
- **Frontend-only scope.** Work inside `frontend/`. Do not modify `application/`, `hardware/`, `deployment/`, `shared/`, `scripts/`, `main-website/`, or root docs unless explicitly asked.
- **Mock data only.** No canister calls, API routes, auth, payments, or hardware integration. Real integrations come later behind approved adapters.
- **Feature-based architecture.** `features/<feature>/<feature>.tsx` plus local `components/`; no cross-feature imports; thin routes in `app/`.
- **Ask before** installing packages or editing `package.json`, `package-lock.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `.gitignore`, global design tokens, or routes.
- **The palette is not chosen.** Do not invent brand colors or hardcode hex values. Follow `frontend/docs/design.md`.
- **This is Next.js 16.4.** Read `frontend/node_modules/next/dist/docs/` before using an API you are not certain about; older App Router guidance may be wrong.

## Verify

From `frontend/`, run:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Report results honestly, including failures. Update the matching checkbox in `frontend/docs/roadmap.md` when an item is actually complete.

## Other areas

`application/`, `hardware/`, `deployment/`, `shared/`, and `scripts/` have their own READMEs. This file does not grant permission to change them. Git remains read-only everywhere in this repository.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## ChargeX frontend rules (read first)

Before writing any code in this folder, read `docs/rules.md` in full, then `docs/architecture.md` and the relevant item in `docs/roadmap.md`. Read `docs/design.md` before any UI work.

- **Git is read-only.** Never push, pull, fetch, commit, branch, checkout, merge, rebase, stash, tag, or otherwise change repository state. Only `git status`, `git diff`, `git log`, and `git show` are allowed. Never use `gh`.
- **Frontend only. Mock data only.** No canister, API, auth, or payment integration.
- **Ask before** installing packages or editing config, routes, or global design tokens.
- **Use the brand tokens.** The palette and logo are set in `docs/design.md` §4. Do not hardcode colors.

Full policy: `docs/rules.md`. Repository-wide summary: `../AGENTS.md`.

Keep this section outside the Next.js managed block so `next dev` preserves it.


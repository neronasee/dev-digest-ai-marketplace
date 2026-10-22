# Enforcement — the dependency-cruiser gate

`dependency-cruiser` is one dev-dependency like any other — the gate installs a
package and touches no application code. Think of it as a test runner for your
import graph: you declare `forbidden` rules over `from → to` path patterns.

Regexes are RE2 — no look-ahead. Use `pathNot` for exclusions and `$1` to
back-reference the capture group from `from.path` inside `to.path`.

## Config: `.dependency-cruiser.cjs`

CommonJS on purpose: if `package.json` has `"type": "module"`, a plain `.js`
config would parse as ESM and fail. A starter rule set over a
`src/{domain,ports,modules,adapters,db}` layout — remap the patterns to your
repo's [layer-map.md](layer-map.md) before adopting:

| Rule | Severity | `from` | `to` |
|---|---|---|---|
| `no-circular` | warn | anything | `circular: true` |
| `core-is-pure` | error | `src/domain` | resolved npm paths for your framework, ORM, DB driver, and SDK packages; `src/adapters/`; `src/db/`; forbidden Node I/O builtins |
| `services-depend-on-ports` | error | `src/modules/[^/]+/service[^/]*\.ts$` | `src/adapters/` |
| `routes-are-thin` | error | `src/modules/[^/]+/routes\.ts$` | `src/adapters/` |
| `db-confined-to-repositories` | error | `src/modules/` (pathNot `src/modules/[^/]+/repository`) | `src/db/schema`, `^drizzle-orm` (or your ORM's package) |
| `no-cross-module-internals` | error | `^src/modules/([^/]+)/` | `^src/modules/([^/]+)/` (pathNot `^src/modules/$1/`, `^src/modules/_shared/`) |
| `adapters-dont-know-modules` | error | `^src/adapters/` | `^src/modules/` |

`options`: `doNotFollow: node_modules` (npm packages appear as edges but are
not crawled into); `exclude: /dist/`, `\.test\.ts$` — but `node_modules` is
deliberately **not** excluded: `exclude` removes modules *and their incoming
edges*, which blinds `core-is-pure` to every npm dependency (an anchored
`^<pkg>` ban could never fire). `tsPreCompilationDeps: true` (type-only
imports count); `tsConfig: { fileName: 'tsconfig.json' }` (resolves your path
aliases).

Two path-pattern gotchas, both easy to lose an afternoon to: resolved npm deps
render as `…/node_modules/<pkg>/…`, so anchored `^<pkg>` never matches them; and
Node builtins render WITHOUT the `node:` prefix (`node:os` arrives as `os`), so
bare `^node:<name>` never matches either. Hence the `node_modules/<pkg>/` and
`(node:)?<builtin>(/|$)` pattern forms.

## Scripts (`package.json`)

```json
"depcruise": "depcruise src --config .dependency-cruiser.cjs",
"depcruise:all": "depcruise src ../<core-package>/src --config .dependency-cruiser.cjs"
```

If the domain core is its own package, cruise it as a first-class root
(`depcruise:all`) so `core-is-pure` gates it too — no extra dev-dependency
inside the core package, no lockfile churn there.

## Commands

```bash
pnpm depcruise          # gate: fails (exit ≠ 0) only on error-severity rules
pnpm depcruise:all      # same, plus the core package as a root
pnpm exec depcruise src --config .dependency-cruiser.cjs --output-type err-long   # verbose
pnpm exec depcruise src --config .dependency-cruiser.cjs --output-type dot | dot -Tsvg > graph.svg
```

## Baseline

Record the gate's counts (errors / warnings / modules / dependencies) the day
you adopt it, dated. That number is the burn-down baseline every later change
is measured against — never permission to add violations. Never grow the
warning count; shrink it, then promote the rule to `error`. Log each re-baseline
in the same entry so the trend is readable at a glance.

## What the gate cannot see

dep-cruiser governs **file-level imports**. Rules beyond that live outside its
reach and stay reviewer-enforced (the skill's text is the authority):

- **Global I/O builtins** — a bare `fetch(...)`/`WebSocket` leaves NO import
  edge, so `core-is-pure` cannot see it. Reviewers should reject any NEW
  global-network call anywhere in the domain core.
- **Table ownership** — a repository importing the schema looks identical
  whether it reads its own tables or another feature's. Two-tier rule:
  adjacent lookup rows OK, other features' domain data via the owning
  repository through the container.
- **Port placement** — a port interface colocated with its adapter imports
  cleanly but couples the contract to one impl and tempts services to import
  the adapter file for the type. Vendor-boundary ports belong in the shared
  contracts module.

## Ratchet strategy

**error (clean, blocking)**: every layer rule above, once its backlog is zero.
A new violation of any of these fails the gate — move the code to the right
layer or extend the exception ledger below with a reason and a retirement
plan.

**warn (burn down, then promote)**: rules with a live backlog, plus
`no-circular` — composition-root facade cycles (a service importing the
`Container` type while the container imports the service) are usually accepted
at the root rather than chased to zero; if so, encode the acceptance as a
scoped `pathNot` plus a documented decision, not an untracked exception.

When code removes an exception or clears a warn backlog, tighten the config in
the same change — a lenient setting that outlives its cause silently re-opens
the boundary. That tightening IS the ratchet. Wire `depcruise` into CI
alongside typecheck/tests.

## Exception ledger

Every `pathNot`/exclusion the config carries gets a row — an exception without
a stated reason and a retirement plan is permission, not a policy:

| Exception | Encoded as | Reason | Retirement plan |
|---|---|---|---|
| `<example>` a subsystem's service may import its own indexer adapters | `pathNot` on `services-depend-on-ports` | it IS that subsystem; the rest of the app sees only its container facade | none — keep the facade boundary |
| `<fill in>` | `<rule + pathNot>` | `<why this is a policy, not an accident>` | `<what deletes the exception>` |

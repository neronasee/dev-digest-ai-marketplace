---
name: onion-architecture
description: Onion / ports-and-adapters layering for a backend codebase (domain core + ports + application services + adapters + composition root). Use when adding or reviewing a backend module — placing routes/services/repositories/adapters, deciding where a DB query or an external SDK call (LLM, GitHub, git, any vendor API) may live, wiring DI in the composition root, defining a new port in the shared contracts module, or keeping the domain core pure. Enforces the dependency rule (imports point inward) and ships a dependency-cruiser gate. NOT for React/frontend code (use frontend-architecture).
---

# Onion Architecture (backend)

Onion / ports-and-adapters layering for a backend of any shape. One rule governs
it: **all imports point inward**. Files may depend on more central layers, never
on outer ones. Inner layers declare interfaces (ports); outer layers implement
them; a composition root wires the two together.

- Where every ring lives on disk → [`layer-map.md`](layer-map.md)
- The dependency-cruiser gate, severities, and the exception ledger →
  [`enforcement.md`](enforcement.md)
- Provenance and the reading list behind this skill → [`README.md`](README.md)

The adopting repo's own module READMEs and architecture docs own the request & DI
flows and the API map — this skill owns only the dependency rule and its
enforcement.

## The rings

Innermost → outermost. Each ring lives wherever the adopting repo maps it —
record this repo's actual mapping in [`layer-map.md`](layer-map.md) before
relying on these names, and keep that file current:

| Ring | Where | Contract |
|---|---|---|
| Domain core | wherever the repo maps it (document in layer-map.md) | Pure logic, no I/O. Functions over data; effects only through injected ports. |
| Ports | the shared contracts module | Interfaces only — one per external need. No implementations, no SDK imports. |
| Application services | the per-module service layer | Orchestration. Reaches adapters only via the container. |
| Adapters | the adapters + persistence layer | DB drivers, HTTP clients, external SDKs live here; never feature modules. |
| Composition root | the one wiring file (e.g. a `container.ts`) | The only place binding ports to concrete adapters. Tests swap implementations via an overrides seam. |
| Transport | the per-module route layer | Request validation, call the service, map the reply. No logic. |

## Decision framework (apply in order)

1. External SDK / LLM / DB / CLI call? → behind a **port** with an **adapter**
   (`container.llm(id)`, `container.git`, …).
2. DB query? → a **repository** file.
3. Orchestration / business rule spanning steps? → the **service**.
4. HTTP wiring, status codes, DTO mapping? → the **route**.
5. Pure domain logic over data? → the **domain core**.
6. Another feature's data? → the **container** (the owning module's
   repository), never a direct cross-module import. Their tables are theirs:
   extend the owning module's repository read surface (or add a container
   getter) — read another feature's rows through the owning repository via the
   container, never by querying their tables from your own repository.

## Adding a dependency

1. Define a vendor-agnostic **port** in the shared contracts module. Ports
   describe needs, never vendors — a port with a vendor's name in its shape is
   a leak.
2. Implement the **adapter** in the adapters directory, importing only the
   port and the SDK.
3. Add a **mock** alongside the adapters.
4. Wire a lazy **getter** + overrides slot in the composition root (secrets via
   a secrets port).
5. Services consume it as `container.<port>` — nothing else news up adapters.
6. Cover it hermetically by injecting the mock in a test.

## Enforcement

`dependency-cruiser` (config: `.dependency-cruiser.cjs` at the package root —
see [`enforcement.md`](enforcement.md)) fails the build on `error`-severity
violations. Warnings are a tracked burn-down baseline, never permission to add
violations: never grow the warning count; shrink it, then promote the rule to
`error`. If the domain core is its own package, cruise it as a root too so its
purity rule gates it.

## Local rules that sharpen the onion

- Routes are transport only — no container DB access, no ORM imports; branching
  limited to choosing a status code. Validate via route schemas (a
  schema-type-provider when the framework has one), never by parsing the
  request body inside a handler.
- The repository is the ONLY file touching its tables; every query is scoped by
  the request context. Repositories return domain rows, not query builders.
- Throw a shared error taxonomy (e.g. an `AppError` hierarchy); routes and
  services never shape the error envelope themselves.
- Every file opens with a doc-comment stating its layer contract
  ("Transport layer only", "No HTTP and no raw SQL live here", …).
- **Where a new port's interface goes.** Wraps an external vendor or network
  boundary (LLM, git, any SaaS)? → the Ports ring: the shared contracts module,
  one shared home for everything the container wires, so services import the
  type without touching adapter files. Internal computation adapters with no
  vendor SDK may keep the interface colocated with the adapter — consumed via
  the container either way.
- **Repository table ownership is two-tier.** A repository may read adjacent
  lookup rows that anchor its own rows, but another feature's domain data is
  read through the owning module's repository via the container — never by
  touching schema tables your module doesn't own.
- Don't refactor already-clean modules into "stricter" onion — the
  repository-class seam and the container getters ARE the house pattern.

## Out of scope

- React / frontend code → `frontend-architecture` / `react-best-practices`.
- Migration mechanics → `drizzle-orm-patterns`; endpoint/API design →
  `fastify-best-practices`.

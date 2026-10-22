# Layer map — every ring on disk

Fill this in for the adopting repo, then treat it as authoritative: the skill's
rules name rings; this file names files. Keep it current — a stale layer map is
worse than none, because people route code by it.

For each ring, record where it lives and the imports it may (never) make.

## Fill-in template

| Ring | Where it lives (this repo) | May import | Must not import |
|---|---|---|---|
| Domain core | `<fill in>` | itself, ports, pure libs (zod, types) | anything else — no I/O, no framework, no drivers |
| Ports | `<fill in>` | pure libs only | any adapter, SDK, driver, or I/O |
| Application services | `<fill in>` | ports (via the container), domain core, shared module code | adapter files, ORM, schema |
| Adapters | `<fill in>` | ports + their own SDK | feature modules |
| Composition root | `<fill in>` | everything — it is the wiring | — |
| Transport | `<fill in>` | services, request/response schemas | adapters, schema, container internals |

Then, per ring: which checks gate it (see [enforcement.md](enforcement.md)), and
where its test doubles live.

## Example mapping

One worked example, for a repo laid out as
`src/{domain,ports,modules,adapters,db,composition}` — illustrative, not
prescriptive:

| Ring | Where | Notes |
|---|---|---|
| Domain core | `src/domain/**` | pure functions; the only effect is an injected `LLMProvider` port |
| Ports | `src/ports/**` (`adapters.ts` for port interfaces, `contracts/` for Zod request/response schemas) | interfaces and schemas only — nothing else |
| Application services | `src/modules/<name>/service.ts` | orchestration; adapters only via `container.<port>` |
| Adapters | `src/adapters/**`, `src/db/**` + module repositories | SDK wrappers; the repository is the only module code touching the schema |
| Composition root | `src/composition/container.ts` | lazy getters + an overrides seam for injecting test doubles |
| Transport | `src/modules/<name>/routes.ts` | schema-validated; calls the service, maps the reply |

## "Where does it go?" cheatsheet

| The thing you're adding | Goes in |
|---|---|
| A vendor SDK / HTTP call | an adapter behind a port; consume via `container.<port>` |
| SQL / an ORM query | the module's repository file |
| Orchestration / business rule | the module's service |
| Request parsing, status codes, DTOs | the module's routes |
| Pure domain logic | the domain core |
| Something two features need | the shared module or a container getter — never a direct `../<other-module>/` import |
| Another feature's table rows | the owning module's repository via the container — never your own schema import of their tables |
| A mock for tests | the mocks home + an overrides slot in the composition root |

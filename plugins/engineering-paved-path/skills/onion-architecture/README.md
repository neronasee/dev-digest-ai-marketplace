# onion-architecture — provenance & sources

A hand-authored skill (not pulled from a registry). It encodes onion /
ports-and-adapters layering for a backend of any shape and ships a
`dependency-cruiser` gate to enforce it.

- **Scope:** backend code — domain core, ports, application services,
  adapters, composition root, transport.
- **Out of scope:** React/frontend code → `frontend-architecture` /
  `react-best-practices`.
- **Grounded in:** the reading list below. Map the rings onto the adopting
  repo with [layer-map.md](layer-map.md) before enforcing anything.

## Reading list (the practices this skill distills)

### Onion / Clean architecture (canon)

- Jeffrey Palermo — The Onion Architecture: part 1 —
  https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/
- Jeffrey Palermo — onion-architecture tag (parts 2–4) —
  https://jeffreypalermo.com/tag/onion-architecture/
- Herberto Graça — Onion Architecture (Software Architecture Chronicles) —
  https://medium.com/the-software-architecture-chronicles/onion-architecture-79529d127f85
- Robert C. Martin (Uncle Bob) — The Clean Architecture —
  https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
- Original Palermo example (repo) —
  https://github.com/Jordiag/Jeffrey-Palermo-Onion-Architecture

### Ports & Adapters in Node.js / TypeScript

- Sairyss — Domain-Driven Hexagon —
  https://dev.to/sairyss/domain-driven-hexagon-18g5
- Khalil Stemmler — Clean Node.js Architecture —
  https://khalilstemmler.com/articles/enterprise-typescript-nodejs/clean-nodejs-architecture/
- Dyarlen Iber — Hexagonal & Clean Architecture with examples —
  https://dev.to/dyarleniber/hexagonal-architecture-and-clean-architecture-with-examples-48oi
- Md Nasimul Hasan — Ports and Adapters explained with two real codebases —
  https://saadh393.github.io/blog/adapter-port-architecture-two-cases
- Alex Rusin — Future-Proof Your Code: Ports & Adapters —
  https://blog.alexrusin.com/future-proof-your-code-a-guide-to-ports-adapters-hexagonal-architecture/
- The Software House (tsh.io) — Hexagonal architecture overview —
  https://tsh.io/blog/hexagonal-architecture

### Anti-patterns (why the rings exist)

- Martin Fowler — Anemic Domain Model —
  https://martinfowler.com/bliki/AnemicDomainModel.html
- Milan Jovanović — Clean Architecture Anti-Patterns and Common Mistakes —
  https://milanjovanovic.tech/blog/clean-architecture-anti-patterns

### dependency-cruiser (forcing the boundaries)

- dependency-cruiser — npm —
  https://www.npmjs.com/package/dependency-cruiser
- Ken Miyashita — Validate Dependencies According to Clean Architecture —
  https://betterprogramming.pub/validate-dependencies-according-to-clean-architecture-743077ea084c
- Jakub Andrzejewski — Avoid Cross Module Dependencies with Dependency Cruiser —
  https://dev.to/jacobandrewsky/avoid-cross-module-dependencies-with-dependency-cruiser-3b0b
- Atomic Object — Dependency Cruiser: Restrict Imports in JavaScript —
  https://spin.atomicobject.com/dependency-cruiser-imports/
- cubic — Maintain clean architecture with dependency rules —
  https://www.cubic.dev/blog/how-to-maintain-clean-architecture-with-dependency-rules-in-your-codebase

### Fastify (layering / encapsulation)

- Fastify — Plugins Guide —
  https://fastify.dev/docs/latest/Guides/Plugins-Guide/
- Fastify — Encapsulation —
  https://fastify.dev/docs/latest/Reference/Encapsulation/
- Strapi — Build Production-Ready APIs with Fastify —
  https://strapi.io/blog/build-production-ready-apis-with-fastify
- node-fastify-architecture (modular structure example) —
  https://github.com/sujeet-agrahari/node-fastify-architecture

### Drizzle ORM / Repository pattern

- Repository Pattern in Nest.js with Drizzle ORM —
  https://medium.com/@vimulatus/repository-pattern-in-nest-js-with-drizzle-orm-e848aa75ecae
- Lazar Nikolov (Sentry) — Atomic Repositories in Clean Architecture and TypeScript —
  https://blog.sentry.io/atomic-repositories-in-clean-architecture-and-typescript/
- cosmic python — Repository Pattern (chapter 2) —
  https://www.cosmicpython.com/book/chapter_02_repository
- Microsoft Learn — Infrastructure persistence layer design —
  https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/infrastructure-persistence-layer-design

## Files

- `SKILL.md` — the one rule, the rings, the decision framework, the
  "adding a dependency" recipe.
- `layer-map.md` — a fill-in template mapping every ring to the adopting
  repo's real files, one worked example, and a "where does it go?" cheatsheet.
- `enforcement.md` — a starter `.dependency-cruiser.cjs` rule set, scripts,
  severity rationale, the baseline discipline, and the exception ledger.

# engineering-paved-path

Paved-path engineering skills for Claude Code: curated best-practice catalogs that keep TypeScript web repositories on the happy path. Twelve skills, each invocable directly or named by a Development Plan task.

## Install

```bash
claude plugin marketplace add neronasee/dev-digest-ai-marketplace
claude plugin install engineering-paved-path@dev-digest-ai-marketplace
```

This plugin is also pulled in automatically as a dependency of `sdd-engineering` and `architecture-review`.

## Skills

| Skill | Covers |
|---|---|
| `react-best-practices` | Modern React (2025–26) component, hook, and state patterns; anti-pattern catalog. |
| `frontend-architecture` | React + Next.js App Router code organization: where components/hooks/utils live, import boundaries, folder structure. |
| `next-best-practices` | Next.js file conventions, RSC boundaries, data patterns, async APIs, metadata, bundling. |
| `fastify-best-practices` | Fastify servers and REST APIs: lifecycle, hooks, plugins, schemas, error handling, testing. |
| `drizzle-orm-patterns` | Drizzle ORM schema definition, CRUD, relations, transactions, migrations. |
| `postgresql-table-design` | PostgreSQL schema design: types, indexing, constraints, performance patterns. |
| `zod` | Zod schema validation: parsing, type inference, error handling. |
| `react-testing-library` | RTL with Vitest: query priority, userEvent, async patterns, mocking. |
| `security` | OWASP Top 10:2025 web application security review and implementation practices. |
| `typescript-expert` | TypeScript: type-level programming, performance, monorepos, migration. |
| `onion-architecture` | Onion / ports-and-adapters layering: ring model, layer-map template, dependency-cruiser enforcement. |
| `mermaid-diagram` | Mermaid diagrams: flowcharts, sequence, ER, state machines. |

## Usage

Skills activate on relevant work automatically, or explicitly:

> Use the zod skill to design this parser's schema.

The `onion-architecture` and `frontend-architecture` skills double as boundary authorities for the `architecture-reviewer` agent (see the `architecture-review` plugin).

## Versioning

See [CHANGELOG.md](CHANGELOG.md). The `version` in `.claude-plugin/plugin.json` is authoritative for installs; releases are immutable git tags (`engineering-paved-path--v<version>`).

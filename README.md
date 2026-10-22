# DevDigest AI Marketplace

A [Claude Code](https://code.claude.com/) plugin marketplace distributing the **Spec-Driven Development (SDD) engineering fleet** — agents, orchestration skills, and paved-path engineering best practices — to any repository, with no local files required.

## Install

```bash
claude plugin marketplace add neronasee/dev-digest-ai-marketplace
claude plugin install sdd-engineering@dev-digest-ai-marketplace
```

Dependencies (`research-tools`, `architecture-review`, `engineering-paved-path`) are installed automatically.

To follow the verified **stable** channel instead of the default `main`:

```bash
claude plugin marketplace add neronasee/dev-digest-ai-marketplace#stable
```

## Catalog

| Plugin | Version | Contents |
|---|---|---|
| [`sdd-engineering`](plugins/sdd-engineering/) | 1.0.0 | `spec-creator`, `implementation-planner`, `implementer`, `plan-verifier` agents; `implement-plan` (run) and `workflow-retro` skills |
| [`research-tools`](plugins/research-tools/) | 1.0.0 | `researcher` agent (read-only repo/web investigation) |
| [`architecture-review`](plugins/architecture-review/) | 1.0.0 | `architecture-reviewer` (+ `-lite`) agents |
| [`engineering-paved-path`](plugins/engineering-paved-path/) | 1.0.0 | 12 best-practice skills: React, Next.js, Fastify, Drizzle, PostgreSQL, Zod, RTL, security, TypeScript, onion architecture, Mermaid |

Dependency graph (`→` = depends on):

```
sdd-engineering → research-tools
sdd-engineering → architecture-review → engineering-paved-path
sdd-engineering → engineering-paved-path
```

## Catalog UI

Browse and search every plugin, skill, and agent on GitHub Pages:
**https://neronasee.github.io/dev-digest-ai-marketplace/**

## Repository layout

```
.claude-plugin/marketplace.json   # marketplace manifest
plugins/                          # the four distributable plugins
docs/                             # release policy, plugin guidelines, security
scripts/                          # release / promote-stable / rollback tooling
site/                             # catalog UI (React + Vite, GitHub Pages)
.github/workflows/                # validate-marketplace + catalog-site deploy
```

## Releases & channels

See [docs/releases.md](docs/releases.md) for the channel model (`main` = latest, `stable` branch = verified), version policy, and the rollback runbook. Every release is an immutable git tag (`<plugin>--v<version>`) plus a GitHub Release.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). All content in this repository is English-only; plugins must be project-agnostic (no host-repo paths or hardcoded module names).

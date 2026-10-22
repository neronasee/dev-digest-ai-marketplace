# architecture-review

Read-only architecture review agents for Claude Code: they check the structural boundaries a repository declares and return evidence-backed findings with a deterministic verdict.

## Install

```bash
claude plugin marketplace add neronasee/dev-digest-ai-marketplace
claude plugin install architecture-review@dev-digest-ai-marketplace
```

Depends on `engineering-paved-path` (auto-installed) for the architecture skills that define the boundary vocabulary.

## Agents

| Agent | Role |
|---|---|
| `architecture-reviewer` | Full review of structural boundaries the target repo declares — layering/import rules (from architecture skills such as `onion-architecture` / `frontend-architecture`), placement and naming rules from the repo's CLAUDE.md/README, and boundaries enforced by repo tooling (dependency-cruiser, eslint-boundaries) when present. Severity-ranked findings with file:line evidence; verdict REJECT / REVISE / ACCEPT. Default changeset: working tree vs `origin/main`. |
| `architecture-reviewer-lite` | Same charter, lighter pass: checks structural boundaries against a stated changeset without the full report ceremony. |

The `architecture-reviewer` agent is dispatched by the `implement-plan` skill in `sdd-engineering` as the final review gate; both agents can also be invoked directly.

## Usage notes

- Read-only: reviews report, they never fix.
- Findings always cite file:line evidence; a non-zero mechanical gate exit is CRITICAL.
- If the repo defines no boundary gate, the reviewer inspects the import graph and says so in the report.

## Versioning

See [CHANGELOG.md](CHANGELOG.md). The `version` in `.claude-plugin/plugin.json` is authoritative for installs; releases are immutable git tags (`architecture-review--v<version>`).

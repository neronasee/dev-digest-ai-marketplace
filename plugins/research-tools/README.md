# research-tools

Read-only research agent for Claude Code: evidence-backed fact-finding across the repository and the external web.

## Install

```bash
claude plugin marketplace add neronasee/dev-digest-ai-marketplace
claude plugin install research-tools@dev-digest-ai-marketplace
```

## Agent

| Agent | Role |
|---|---|
| `researcher` | Two modes — **repo investigation** (how does X work, where is Y decided) and **external research** (docs, web). Returns a structured report: conclusions, evidence with file/line references, source list, and an explicit not-found list. Never edits files. |

The `researcher` agent is dispatched by other plugins (for example `spec-creator` in `sdd-engineering`) and can also be invoked directly:

> Ask the researcher agent to find every place this repository decides feature flags.

## Usage notes

- Read-only by design — it reports, it does not modify.
- Answers must cite evidence; an honest `not found` section is part of the contract.

## Versioning

See [CHANGELOG.md](CHANGELOG.md). The `version` in `.claude-plugin/plugin.json` is authoritative for installs; releases are immutable git tags (`research-tools--v<version>`).

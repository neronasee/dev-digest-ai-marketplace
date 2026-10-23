# sdd-engineering

Spec-Driven Development (SDD) pipeline for Claude Code: four cooperating agents plus two orchestration skills that carry a feature from idea to verified implementation — in any repository, with no local files required beyond the plugin itself.

## Install

```bash
claude plugin marketplace add neronasee/dev-digest-ai-marketplace
claude plugin install sdd-engineering@dev-digest-ai-marketplace
```

Dependencies — `research-tools`, `architecture-review`, `engineering-paved-path` — install automatically.

## How the fleet works together

```
            (idea)
              │
              ▼
        spec-creator  ──dispatches──▶  researcher (research-tools plugin)
              │ feature-spec (specs/YYYY-MM-DD-<slug>.md)
              ▼
   implementation-planner
              │ Development Plan (docs/plans/YYYY-MM-DD-<slug>.md)
              ▼
        implement-plan skill
              │ dispatches, in order:
              ├──▶ implementer            (sdd-engineering)
              ├──▶ plan-verifier   gate   (sdd-engineering)
              └──▶ architecture-reviewer  (architecture-review plugin, bounded fix loop)
              │
              ▼
        workflow-retro skill  — retrospective ledger entry (docs/retro/ledger/)
```

## Agents

| Agent | Role |
|---|---|
| `spec-creator` | Turns a feature idea into an English feature-spec: problem, goals/non-goals, user stories, EARS-format acceptance criteria with story→AC traceability, edge cases, provenance. Clarifies before writing; answers *what and why*, never *how*. May dispatch `researcher` for lookups. |
| `implementation-planner` | Turns an approved spec (or clear request) into a Development Plan grounded in the repo's docs and skill catalog; decides single- vs multi-agent execution. |
| `implementer` | Executes an approved Development Plan task by task, invoking the exact skills each task names, running the plan's checks, and reporting with evidence. |
| `plan-verifier` | Read-only per-item verification of finished work against every plan item — VERIFIED / PARTIAL / MISSING / UNVERIFIABLE — running the plan's hermetic checks itself. |

## Skills

| Skill | Invocation | Role |
|---|---|---|
| `implement-plan` | `/sdd-engineering:implement-plan <plan-path> [mode:single\|multi] [max-fix:<n>] [--auto]` | One command over the post-approval pipeline: implementer → plan-verifier (gate) → architecture-reviewer with a bounded fix loop. Since v1.1.0 the wrap-up also writes a structured run summary (fixed headings + machine-readable JSON block) to `docs/retro/runs/YYYY-MM-DD-<slug>.md`. Never pushes or opens PRs. |
| `workflow-retro` | `/sdd-engineering:workflow-retro` | Retrospective over an agent-orchestrated session: token totals, dispatch order, per-phase breakdown, recommendations — written to `docs/retro/ledger/`. |

## Conventions this plugin introduces

- Feature specs: `specs/YYYY-MM-DD-<slug>.md` (or `<module>/specs/…` for single-module features)
- Development Plans: `docs/plans/YYYY-MM-DD-<slug>.md`
- Retro ledger: `docs/retro/ledger/YYYY-MM-DD-<slug>.md`

These are the plugin's defaults — when the target repo already keeps such documents elsewhere, the repo's convention wins.

## Versioning

See [CHANGELOG.md](CHANGELOG.md). The `version` in `.claude-plugin/plugin.json` is authoritative for installs; the release process keeps it and the marketplace entry in lockstep. Releases are immutable git tags (`sdd-engineering--v<version>`).

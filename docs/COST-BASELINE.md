# Cost Baseline

> **Scope note.** The dedicated cost experiment for this lab was **skipped by
> decision** — no additional paid runs were made. Every number below is
> transcribed from the acceptance eval runs that the release process already
> requires (`docs/eval-reports/*.json`). Nothing here was measured separately.

## Baseline: cost per successful smoke workflow (sdd-engineering 1.0.0)

The `smoke-pipeline-order` case is the release gate for `sdd-engineering`: it
runs the documented pipeline question against the plugin's own files. Cost per
**successful** run (cases passed 1/1, exit 0):

| Run | Occasion | Cost (USD) | Duration | Turns | Result |
|---|---|---|---|---|---|
| 1 | pre-release check, 1.0.0 content | $0.0661 | 15 s | 3 | PASS |
| 2 | post-rollback check, tag `sdd-engineering--v1.0.0` content | $0.0653 | 15 s | 3 | PASS |

**Baseline: ≈ $0.066 per successful smoke workflow** (2/2 successful; no failed
runs counted — a failed run is not a delivered workflow).

## Optimization introduced in 1.1.0

**Structured run summary emitted in-band.** Before 1.1.0, getting a
machine-readable record of a finished `implement-plan` run meant a separate
retrospective pass (`workflow-retro`) over the whole session, or hand-parsing
the chat report — an extra agent-scale dispatch per workflow when tooling needs
the verdicts. Since 1.1.0, Phase 4 writes `docs/retro/runs/*.md` (fixed
headings + a JSON block with per-agent verdicts) as part of the wrap-up it
already performs: **zero additional dispatches** for machine consumption.

Measured cost of the new emission path itself (acceptance eval
`summary-emission`, includes loading the skill documentation and writing the
file): **$0.139, 5 turns, 1/1 PASS** — bounded, one-shot, and it replaces a
separate pass rather than adding one.

## Quality gate

Cost numbers are only recorded for runs that pass the gate; the gate is part of
the release policy ([docs/releases.md](releases.md)):

1. `claude plugin validate .` + per-plugin validate — exit 0.
2. Eval suite green (`smoke` for 1.0.0; `smoke` + `summary-emission` for
   1.1.0) — exit 0, **before any tag is cut** (tags are immutable).
3. Deterministic graders only (`regex`, `file_exists`) — no paid LLM judges,
   `runs: 1`, evals never run in per-push CI.

A cost drop that fails the gate is not an optimization — it is a regression.

## Raw reports

- `docs/eval-reports/smoke-1.0.0.json` — baseline run 1
- `docs/eval-reports/summary-emission-1.1.0.json` — 1.1.0 acceptance
- `docs/eval-reports/smoke-1.0.0-post-rollback.json` — baseline run 2 (tag content)

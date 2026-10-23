---
type: regex
target:
  source: file
  path: docs/retro/runs/2026-10-23-fixture-run.md
pattern: '```json\s*\{[^`]*?"plan"[^`]*?"phases"[^`]*?\}\s*```'
match: contains
---

The run summary file must contain one machine-readable fenced `json` block
including at least the `"plan"` and `"phases"` keys, per the skill's v1.1.0
format. Graded against the produced file itself.

---
name: summary-emission
description: Verifies the v1.1.0 behavior — Phase 4 of implement-plan writes the structured run summary (fixed headings + machine-readable JSON block) to docs/retro/runs/.
tags: [summary, v1.1.0]
max_turns: 8
runs: 1
allowed_tools: ["Read", "Write"]
plugins: ["../.."]
---

The `implement-plan` skill (v1.1.0+) requires its Phase 4 wrap-up to write a
structured run summary file. Read `implement-plan-SKILL.md` (the live skill
documentation, copied into this directory) — see the "Run summary file" section.

A pipeline run has just finished. Its inputs and outcomes are in `plan.md` (the
Development Plan that was executed) and `run-transcript.md` (what each agent
reported). Produce **exactly the run summary file this skill defines** for that
run, written to `docs/retro/runs/2026-10-23-fixture-run.md` (create the
directories). Take every verdict from the transcript — never invent one.

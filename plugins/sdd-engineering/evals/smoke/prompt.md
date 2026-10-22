---
name: smoke-pipeline-order
description: Verifies the implement-plan skill's documented dispatch order (implementer -> plan-verifier -> architecture-reviewer) is discoverable from this plugin's own files.
tags: [smoke, pipeline]
max_turns: 6
runs: 1
allowed_tools: ["Read", "Glob", "Grep", "Skill"]
plugins: ["../.."]
---

Consult this plugin's own documentation — the plugin root sits at `../..` relative to
this case directory (see `README.md` and `skills/implement-plan/SKILL.md`) — and answer
in 2-3 sentences:

Which agents does the `implement-plan` skill dispatch, in what order, and what does
each agent contribute to the pipeline?

#!/usr/bin/env bash
# Copies the live implement-plan skill doc and this case's fixtures into the
# case workspace. Invoked by `claude plugin eval --scaffold`.
set -euo pipefail
CASE_DIR="$(cd "$(dirname "$0")" && pwd)"
PLUGIN_ROOT="$(cd "$CASE_DIR/../.." && pwd)"
cp "$PLUGIN_ROOT/skills/implement-plan/SKILL.md" ./implement-plan-SKILL.md
cp "$CASE_DIR/fixtures/plan.md" ./plan.md
cp "$CASE_DIR/fixtures/run-transcript.md" ./run-transcript.md

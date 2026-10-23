#!/usr/bin/env bash
# Copies the plugin's live docs into the case workspace (docs-drift smoke test).
# Invoked by `claude plugin eval --scaffold` from a sandbox cwd, so resolve
# paths relative to this script's location, not the caller's cwd.
set -euo pipefail
CASE_DIR="$(cd "$(dirname "$0")" && pwd)"
PLUGIN_ROOT="$(cd "$CASE_DIR/../.." && pwd)"
cp "$PLUGIN_ROOT/README.md" ./PLUGIN-README.md
cp "$PLUGIN_ROOT/skills/implement-plan/SKILL.md" ./implement-plan-SKILL.md

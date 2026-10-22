#!/usr/bin/env bash
# Rollback rehearsal: point a CONSUMER repository back at the stable channel
# (last verified release) and confirm the rollback target is active and healthy.
# Automates the runbook in docs/releases.md.
#
# Usage: scripts/rollback.sh <consumer-repo-path> [evidence-dir]
# Example: scripts/rollback.sh ~/playground/neoversity/sdd-consumer-demo
set -euo pipefail

CONSUMER="${1:?usage: rollback.sh <consumer-repo-path> [evidence-dir]}"
EVIDENCE="${2:-$CONSUMER/docs/evidence}"
MARKETPLACE_NAME="dev-digest-ai-marketplace"
MARKETPLACE_REPO="neronasee/dev-digest-ai-marketplace"
PLUGIN="sdd-engineering"

die() { echo "rollback: $*" >&2; exit 1; }

CONSUMER="$(cd "$CONSUMER" && pwd)"
[[ -d "$CONSUMER/.git" ]] || die "$CONSUMER is not a git repository"
mkdir -p "$EVIDENCE"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"

echo "==> [1/5] snapshotting current state"
(cd "$CONSUMER" && claude plugin list --json) > "$EVIDENCE/rollback-${STAMP}-before.json"

echo "==> [2/5] removing marketplace (uninstalls its plugins)"
(cd "$CONSUMER" && claude plugin marketplace remove "$MARKETPLACE_NAME")

echo "==> [3/5] re-adding marketplace from the stable channel"
(cd "$CONSUMER" && claude plugin marketplace add "$MARKETPLACE_REPO#stable")

echo "==> [4/5] reinstalling $PLUGIN (project scope)"
(cd "$CONSUMER" && claude plugin install "$PLUGIN@$MARKETPLACE_NAME" --scope project)

echo "==> [5/5] verifying"
(cd "$CONSUMER" && claude plugin list --json) > "$EVIDENCE/rollback-${STAMP}-after.json"

node -e "
  const fs = require('fs');
  const list = JSON.parse(fs.readFileSync('$EVIDENCE/rollback-${STAMP}-after.json', 'utf8'));
  const arr = Array.isArray(list) ? list : list.installed || [];
  const entry = arr.find(p => (p.id || '').startsWith('$PLUGIN@'));
  if (!entry) { console.error('rollback: $PLUGIN not found after rollback'); process.exit(1); }
  if (entry.errors && entry.errors.length) { console.error('rollback: plugin reports errors: ' + JSON.stringify(entry.errors)); process.exit(1); }
  if (!entry.enabled) { console.error('rollback: plugin is not enabled'); process.exit(1); }
  const deps = ['research-tools', 'architecture-review', 'engineering-paved-path'];
  for (const d of deps) {
    const dep = arr.find(p => (p.id || '').startsWith(d + '@'));
    if (!dep) { console.error('rollback: dependency ' + d + ' missing'); process.exit(1); }
    if (dep.errors && dep.errors.length) { console.error('rollback: dependency ' + d + ' reports errors'); process.exit(1); }
  }
  console.log('rollback OK: $PLUGIN active at version ' + entry.version + ', all dependencies healthy');
  console.log('Verify this is the intended stable version, then run the smoke eval against the tag content (docs/releases.md step 6).');
"

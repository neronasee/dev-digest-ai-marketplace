#!/usr/bin/env bash
# Promote a released plugin tag to the stable channel.
# stable only ever moves FORWARD, and only after the release has been verified
# in a consumer repository (smoke check green). See docs/releases.md.
#
# Usage: scripts/promote-stable.sh <tag>
# Example: scripts/promote-stable.sh sdd-engineering--v1.0.0
set -euo pipefail

TAG="${1:?usage: promote-stable.sh <plugin>--v<version>}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

die() { echo "promote-stable: $*" >&2; exit 1; }

git rev-parse -q --verify "refs/tags/$TAG" >/dev/null || die "tag '$TAG' does not exist"
git fetch origin main stable --quiet || true

# stable must never move backwards: refuse if stable already contains the tag.
if git rev-parse -q --verify refs/remotes/origin/stable >/dev/null; then
  if git merge-base --is-ancestor "origin/stable" "$TAG" 2>/dev/null; then
    echo "promote-stable: moving stable forward to $TAG"
  else
    die "refusing to move stable backwards (origin/stable is not an ancestor of $TAG)"
  fi
fi

git branch -f stable "$TAG"
if git rev-parse -q --verify refs/remotes/origin/stable >/dev/null; then
  git push -f origin stable
else
  git push origin stable
fi

echo "==> stable channel now at $TAG"
echo "    consumers on stable: claude plugin marketplace add neronasee/dev-digest-ai-marketplace#stable"

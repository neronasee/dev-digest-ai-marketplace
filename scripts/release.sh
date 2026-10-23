#!/usr/bin/env bash
# Release a plugin: bump versions (manifest + marketplace entry, in lockstep),
# validate, commit, tag (<plugin>--v<version>), and create a GitHub Release.
#
# Usage: scripts/release.sh <plugin-name> <version>
# Example: scripts/release.sh sdd-engineering 1.1.0
set -euo pipefail

PLUGIN="${1:?usage: release.sh <plugin-name> <version>}"
VERSION="${2:?usage: release.sh <plugin-name> <version>}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PLUGIN_DIR="$ROOT/plugins/$PLUGIN"
MANIFEST="$PLUGIN_DIR/.claude-plugin/plugin.json"
MARKETPLACE="$ROOT/.claude-plugin/marketplace.json"

die() { echo "release: $*" >&2; exit 1; }

[[ -d "$PLUGIN_DIR" ]] || die "unknown plugin '$PLUGIN' (no $PLUGIN_DIR)"

# --- version format ---------------------------------------------------------
[[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || die "version '$VERSION' is not strict SemVer (X.Y.Z)"

# --- guards -------------------------------------------------------------------
cd "$ROOT"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
[[ "$BRANCH" == "main" ]] || die "must run on main (currently on $BRANCH)"
[[ -z "$(git status --porcelain)" ]] || die "working tree is not clean"
git fetch origin main --quiet
[[ "$(git rev-parse HEAD)" == "$(git rev-parse origin/main)" ]] || die "main is not up to date with origin/main"

CURRENT="$(node -e "console.log(require('$MANIFEST').version || '0.0.0')")"
TAG="${PLUGIN}--v${VERSION}"
if [ "$VERSION" = "$CURRENT" ]; then
  # Initial release of an already-declared version: allowed once, tag must not exist.
  git rev-parse -q --verify "refs/tags/$TAG" >/dev/null && die "tag '$TAG' already exists (version already released)"
  echo "==> initial release: manifest already declares $VERSION"
else
  node -e "
    const a = '$CURRENT'.split('.').map(Number), b = '$VERSION'.split('.').map(Number);
    for (let i = 0; i < 3; i++) { if (b[i] !== a[i]) { process.exit(b[i] > a[i] ? 0 : 1); } }
    process.exit(1);
  " || die "version '$VERSION' must be greater than current '$CURRENT'"
fi

grep -q "^## \[$VERSION\]" "$PLUGIN_DIR/CHANGELOG.md" || die "CHANGELOG.md has no '## [$VERSION]' section"

# --- validate -----------------------------------------------------------------
echo "==> validating marketplace + plugin"
claude plugin validate "$ROOT" >/dev/null
claude plugin validate "$PLUGIN_DIR" >/dev/null

# --- bump (manifest + marketplace entry, lockstep) ----------------------------
if [ "$VERSION" != "$CURRENT" ]; then
  echo "==> bumping $PLUGIN: $CURRENT -> $VERSION"
  node -e "
    const fs = require('fs');
    const bump = (file, mutate) => { const j = JSON.parse(fs.readFileSync(file, 'utf8')); mutate(j); fs.writeFileSync(file, JSON.stringify(j, null, 2) + '\n'); };
    bump('$MANIFEST', j => { j.version = '$VERSION'; });
    bump('$MARKETPLACE', j => {
      const e = (j.plugins || []).find(p => p.name === '$PLUGIN');
      if (!e) { console.error('no marketplace entry for $PLUGIN'); process.exit(1); }
      e.version = '$VERSION';
    });
  "
  git add "$MANIFEST" "$MARKETPLACE"
  git commit -q -m "chore(release): $PLUGIN v$VERSION

Co-Authored-By: Claude Code <noreply@anthropic.com>"
  git push origin main
else
  echo "==> no version bump needed (manifest already at $VERSION)"
fi

# --- immutable tag --------------------------------------------------------------
echo "==> tagging"
claude plugin tag "$PLUGIN_DIR" --push

# --- github release --------------------------------------------------------------
echo "==> creating GitHub release"
NOTES="$(awk -v ver="$VERSION" '
  $0 == "## [" ver "]" { flag = 1; next }
  /^## \[/ && flag { exit }
  flag { print }
' "$PLUGIN_DIR/CHANGELOG.md" | sed '/./,$!d')"
TAG="${PLUGIN}--v${VERSION}"
gh release create "$TAG" --title "$PLUGIN v$VERSION" --notes "${NOTES:-Release $VERSION of $PLUGIN. See CHANGELOG.md.}"

echo "==> released $PLUGIN v$VERSION (tag: $TAG)"
echo "    promote to stable after consumer verification: scripts/promote-stable.sh $TAG"

# Releases & Channels

How versions are cut, distributed, and — when needed — rolled back.

## Version authority

For every plugin, the `version` field in `plugins/<name>/.claude-plugin/plugin.json` is **authoritative**: Claude Code resolves a plugin's installed version from the manifest first, the marketplace entry second. Pinning a version therefore means setting the manifest — this is what makes both updates and rollbacks work without any `--version` flag (none exists).

The release script bumps the manifest and the `.claude-plugin/marketplace.json` entry **in lockstep**, because a stale entry makes the catalog site lie about what users get.

## Channels

| Channel | Ref | Meaning |
|---|---|---|
| `latest` (default) | `main` branch | Newest validated state. `claude plugin marketplace add neronasee/dev-digest-ai-marketplace` |
| `stable` | `stable` branch | Last release verified in a consumer repository. `claude plugin marketplace add neronasee/dev-digest-ai-marketplace#stable` |

The `stable` branch only moves **forward**, via `scripts/promote-stable.sh`, and only after the promoted release has passed a consumer smoke check. `main` is always ahead of (or equal to) `stable`.

## Release process

`scripts/release.sh <plugin> <version>`:

1. Guards: on `main`, clean tree, up to date with origin, version strictly greater than current, `CHANGELOG.md` has a `## [<version>]` section.
2. `claude plugin validate .` and `claude plugin validate plugins/<plugin>` must pass.
3. Bump `plugins/<plugin>/.claude-plugin/plugin.json` and the marketplace entry (lockstep).
4. Commit `chore(release): <plugin> v<version>` and push `main`.
5. `claude plugin tag plugins/<plugin> --push` — creates the immutable `<plugin>--v<version>` git tag.
6. `gh release create` from the tag, notes extracted from the CHANGELOG section.

**Never tag before validate (and, for plugins with evals, a green eval) passes.** Tags embed the version; releases are immutable. A bad release is fixed by shipping a new version — never by retagging.

## Immutability

- Tags `<plugin>--v<version>` and their GitHub Releases are never deleted or rewritten.
- `forceRemoveDeletedPlugins` stays unset: delisting does not silently uninstall users' plugins.
- Plugin names are stable identifiers: renames would orphan every consumer.

## Update drill (consumer side)

Auto-update is **off by default** for non-official marketplaces, so updates are explicit:

```bash
claude plugin marketplace update dev-digest-ai-marketplace
claude plugin update sdd-engineering@dev-digest-ai-marketplace
claude plugin list --json   # verify the new active version, no errors
```

Users who prefer automatic updates can enable **Enable auto-update** for this marketplace under `/plugin` → Marketplaces.

## Rollback runbook (stable channel)

When a release regresses, consumers return to the last verified version via the `stable` channel — `scripts/rollback.sh` automates these steps against a consumer repository:

1. Snapshot the current state: `claude plugin list --json`.
2. Remove the marketplace (uninstalls its plugins):
   `claude plugin marketplace remove dev-digest-ai-marketplace`
3. Re-add from the stable channel:
   `claude plugin marketplace add neronasee/dev-digest-ai-marketplace#stable`
4. Reinstall: `claude plugin install sdd-engineering@dev-digest-ai-marketplace --scope project`.
   The marketplace resolves at the `stable` ref; the manifest there pins the verified version.
5. Verify: `claude plugin list --json` shows the rollback target version, all dependencies present and enabled, `errors` empty.
6. Re-run the smoke eval **against the tag's content** (a `git worktree` at `<plugin>--v<version>`), never against a dirty working tree.
7. Restore forward when the fixed release lands: repeat the update drill.

Evidence of the drill (before/after `list --json` snapshots, eval report) is committed to the consumer repository.

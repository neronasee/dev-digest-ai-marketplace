# Contributing

Thanks for improving the marketplace. Changes land through pull requests to `main`.

## Ground rules

1. **English only** — every description, doc, comment, and commit message. No exceptions, including code comments.
2. **Project-agnostic plugins** — no host-repo module names, paths, or tooling assumptions. CI rejects host-repo identifiers in `plugins/`.
3. **Follow [docs/plugin-guidelines.md](docs/plugin-guidelines.md)** for structure, manifests, and evals.
4. **Never rename a shipped agent, skill, or plugin** — names are the dispatch contract between plugins and users' muscle memory. Deprecate and add instead.

## Adding or changing a plugin

1. Branch from `main`.
2. Make your change; update the plugin's `README.md` and add a `CHANGELOG.md` entry (under `Unreleased` if the change ships later).
3. Validate locally:
   ```bash
   claude plugin validate .
   for p in plugins/*/; do claude plugin validate "$p"; done
   ```
4. Open a pull request using the template.

## Releasing

Releases are cut by the maintainer via `scripts/release.sh` — see [docs/releases.md](docs/releases.md). Do not bump released versions in feature PRs; keep changes under `Unreleased` in the CHANGELOG.

## Checks on every PR

- `validate-marketplace` CI job: manifest + per-plugin validation, entry/manifest consistency, generalization sweep.
- New catalog content is picked up automatically by the catalog site build (verify locally with `node site/scripts/generate-index.mjs`).

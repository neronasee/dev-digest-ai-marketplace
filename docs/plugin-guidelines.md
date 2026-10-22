# Plugin Guidelines

Rules every plugin in this marketplace follows. CI enforces the mechanical ones; review enforces the rest.

## Structure

```
plugins/<name>/
  .claude-plugin/plugin.json     # manifest — name, version (authoritative), description, deps
  README.md                      # what it contains, how to install and use it
  CHANGELOG.md                   # Keep a Changelog; one section per released version
  agents/<agent>.md              # subagents (flat .md files)
  skills/<skill>/SKILL.md        # skills (+ optional reference files)
  evals/<case>/prompt.md         # eval cases (prompt + graders), where applicable
```

## Manifest rules

- `name`: kebab-case, matches the directory name and the marketplace entry.
- `version`: SemVer. Bumped in lockstep with the marketplace entry by `scripts/release.sh`.
- `dependencies`: bare names only (same-marketplace resolution); every dependency must exist in `.claude-plugin/marketplace.json`.

## Content rules

- **English only.** All descriptions, docs, comments, and commit messages.
- **Project-agnostic.** No host-repo module names, absolute paths, `.mcp.json` tool ids, or hardcoded check commands. Anything repo-specific must be phrased as "as declared by the target repo" and fail soft when absent.
- **No data assumption.** Plugins must work with zero local files from any source repository — the plugin ships everything it needs.
- Agent/skill **names are a dispatch contract** (e.g. `implement-plan` dispatches `architecture-reviewer` across plugin boundaries). Never rename a shipped agent or skill; ship a new one and deprecate instead.
- A plugin must not ship a root `CLAUDE.md` (it is not loaded); guidance belongs in skills and READMEs.

## Eval rules

- Every behavioral plugin ships at least one eval case per documented behavior.
- Deterministic graders (`regex`, `file_exists`, `tool_used`) are preferred; LLM graders need a reason.
- Eval runs cost money: default `runs: 1`, keep prompts small, never run evals in per-push CI.

## Checks before merge

- `claude plugin validate .` and `claude plugin validate plugins/<name>` exit 0.
- Generalization sweep is clean:
  `grep -rniE 'devdigest|dev-digest($|[^-])|dev digest|reviewer-core|pr-self-review|mcp__devdigest|scripts/dev\.sh|@devdigest' plugins/` → zero hits (`dev-digest($|[^-])` permits the marketplace's own name, `dev-digest-ai-marketplace`).
- README renders, CHANGELOG has an Unreleased or version section, catalog site index picks the plugin up (run `node site/scripts/generate-index.mjs` locally).

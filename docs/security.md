# Security Policy

## Trust model

Plugins run as part of Claude Code sessions **as you**. This marketplace distributes prompt content only (agents, skills, docs) — no bundled hooks, no MCP servers, no install scripts. Even so, review what you install; `claude plugin details <name>` shows a plugin's full component inventory.

## What CI checks

- `claude plugin validate` on the marketplace root and every plugin.
- Structural checks: plugin names match directories; every dependency resolves inside this marketplace.
- Generalization sweep (no host-repo paths or private identifiers smuggled into plugin content).

## Rules for contributions

- No hooks, MCP servers, or executable scripts inside `plugins/`.
- No secrets, tokens, credentials, or internal URLs in any plugin content.
- No prompt content that instructs Claude to exfiltrate data, bypass permissions, or mutate files outside the working tree.
- Skills/agents are read-mostly by design; write access is limited to their documented output artifacts (specs, plans, retro ledgers, run summaries).

## Reporting

Open a private security advisory on GitHub (Security → Report a vulnerability) or contact the owner via the repository's contact details. Do not open a public issue for vulnerabilities.

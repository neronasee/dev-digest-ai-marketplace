# Changelog

All notable changes to the `sdd-engineering` plugin. Format: [Keep a Changelog](https://keepachangelog.com/); versions: [SemVer](https://semver.org/).

## [1.0.0] - 2026-10-22

### Added
- Initial release of the SDD engineering fleet.
- Agents: `spec-creator`, `implementation-planner`, `implementer`, `plan-verifier` — generalized from the source engineering harness to work in any repository (no host-repo paths, modules, or MCP tools assumed).
- Skills: `implement-plan` (post-approval implement → verify → review pipeline with bounded fix loop) and `workflow-retro` (agent-orchestration retrospective).
- Eval suite: `smoke` case verifying the documented pipeline order (implementer → plan-verifier → architecture-reviewer).
- Dependencies on `research-tools`, `architecture-review`, and `engineering-paved-path` (auto-installed from the same marketplace).

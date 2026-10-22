---
type: regex
pattern: 'implementer[\s\S]{0,400}?plan-verifier[\s\S]{0,400}?architecture-reviewer'
flags: 'i'
match: contains
---

The answer must name the three dispatched agents in pipeline order: `implementer`
first, then `plan-verifier` (the gate), then `architecture-reviewer` (the bounded
fix-loop review). Any other order, or a missing agent, fails.

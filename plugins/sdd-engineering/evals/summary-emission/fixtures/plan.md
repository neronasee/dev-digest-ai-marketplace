# Development Plan — calculator divide-by-zero error message

- **Spec:** `specs/2026-10-20-calculator-error-messages.md`
- **Execution mode:** single-agent

## Tasks

1. **Task 1 — domain:** In `src/calculator.ts`, change the `divide` branch's
   zero-divisor error message from `divide by zero` to `Division by zero is not
   defined`. Verification: `npm test -- src/calculator.test.ts`.

## Constraints

- No new dependencies; error type stays `RangeError`.

## Verification

- `npm test -- src/calculator.test.ts` exits 0.

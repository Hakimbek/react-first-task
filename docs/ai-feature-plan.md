# AI Feature Plan — Gemini Explanation for Star Wars Characters

## 1. Initial Plan-Mode Prompt

> "I have a Next.js 16 App Router project (Star Wars People Browser) with a `/details/[id]` page that shows character stats. I want to add an 'Explain this item with AI' button that calls the Gemini API securely. The API key must stay server-side, the call must go through a Server Action, and the UI must handle pending/success/error/retry states with i18n support. Propose a file-by-file implementation plan."

---

## 2. Final Implementation Plan

### Architecture Overview

```
User click
  → AiExplanation.tsx (client component)
    → explainPersonAction (src/app/actions/explain.ts — 'use server')
      → explainPerson (src/services/gemini.ts — import 'server-only')
        → @google/genai SDK → Gemini API
```

### Files Created / Modified

| File                                              | Role                                                                |
| ------------------------------------------------- | ------------------------------------------------------------------- |
| `src/services/buildPrompt.ts`                     | Pure function: allowlists 8 fields, builds grounded prompt          |
| `src/services/gemini.ts`                          | Server-only: reads `GEMINI_API_KEY`, calls SDK                      |
| `src/app/actions/explain.ts`                      | `'use server'` boundary: validates input, maps errors to safe codes |
| `src/components/ai-explanation/AiExplanation.tsx` | Client UI: button, pending, success, error, retry states            |
| `src/layouts/details/Details.tsx`                 | Mounts `<AiExplanation>` after character data loads                 |
| `messages/en.json`, `messages/ru.json`            | Added `ai` namespace with all UI strings                            |
| `.env.example`                                    | Placeholder entries for `GEMINI_API_KEY` and `GEMINI_MODEL`         |
| `__mocks__/server-only.ts`                        | Jest no-op so `import 'server-only'` doesn't throw in tests         |

### Security Decisions

- `GEMINI_API_KEY` is read only inside `gemini.ts` which has `import 'server-only'` — bundler prevents client import.
- The server action returns only `{ explanation }` or `{ errorCode }` — never SDK internals, stack traces, or the key itself.
- Only 8 public SWAPI fields are sent to the model; `url` and any other properties are stripped before the action call.
- Output is rendered as `{explanation}` JSX text — no `dangerouslySetInnerHTML`.

---

## 3. Meaningful Step Delegated to Agent Mode

**Step**: Implementing the `AiExplanation` client component and its test suite.

**Prompt given to Agent**:

> "Implement `src/components/ai-explanation/AiExplanation.tsx`. It is a client component that: accepts a `PersonType` prop, calls `explainPersonAction` from `src/app/actions/explain.ts` on button click, shows pending/success/error states, caches the result per `person.name + locale` using `useRef` so re-renders don't trigger extra API calls, and renders the explanation as plain text with an AI disclaimer. Also write the full Jest test file covering all states."

**Files it changed**:

- Created `src/components/ai-explanation/AiExplanation.tsx`
- Created `src/components/ai-explanation/AiExplanation.test.tsx`

**Summary of behavior changed**: Added the interactive AI panel to the character details page, covering all UI states and test cases.

---

## 4. AI Suggestions Changed or Rejected

### Rejected: Using `useEffect` to trigger the AI call

The initial Agent suggestion used `useEffect` to auto-fetch an explanation whenever the component mounted:

```tsx
// Agent suggestion (rejected)
useEffect(() => {
  explainPersonAction(person, locale).then(...)
}, [person.name, locale])
```

**Why rejected**: This violates the requirement that "a request starts only after an explicit user action." Auto-fetching on mount would silently consume quota whenever a user opens any details page, even if they never want an explanation. The correct design is click-initiated only.

**What was done instead**: The call is gated behind a button click handler. `useTransition` wraps the async call to track pending state without blocking navigation.

### Changed: Error handling granularity

Agent initially returned raw error message strings from the server action:

```ts
// Agent suggestion (changed)
return { error: err.message } // Could expose SDK internals
```

**Why changed**: Raw error messages can leak internal details (SDK error codes, rate-limit headers, etc.). The requirement is explicit that the action must never expose SDK internals. The final design maps all errors to safe `ErrorCode` string literals (`'not_configured' | 'quota_exceeded' | 'empty_response' | 'unknown'`) and the UI localizes them via translation keys.

---

## 5. Manual Verification Commands

```bash
# Lint
npm run lint

# Type check
npx tsc --noEmit

# Tests + coverage
npm test

# Build (verifies server-only boundary is not broken)
npm run build
```

All commands passed after implementation.

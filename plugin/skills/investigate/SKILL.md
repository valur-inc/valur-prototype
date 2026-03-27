---
name: valur-prototype:investigate
description: Debug a Valur prototype by finding the root cause before applying fixes. Traces code paths, matches against common prototype bugs, and verifies the fix works. Use when something is broken or behaving unexpectedly.
user_invocable: true
---

# Debug Valur Prototype

Find the root cause of a bug, then fix it. Do not guess or apply speculative fixes.

## Process

### Step 1: Understand the problem

Read the error messages, stack traces, or unexpected behavior the user described. If the description is unclear, ask ONE question to clarify.

Trace the code path from the symptom back to potential causes:
- `server/routes/` — API endpoint logic
- `server/db/schema.ts` — table definitions and initialization
- `calcs/` — financial calculation logic
- `src/pages/` — page components
- `src/stores/` — Pinia state stores
- `src/composables/useApi.ts` — API client

Check what changed recently:
```bash
git log --oneline -20 -- <affected-files>
```

### Step 2: Reproduce the bug

Confirm the bug is real and repeatable before trying to fix anything.

For API bugs, hit the endpoint directly:
```bash
curl -s http://localhost:3000/api/<endpoint> | head -20
```

For calculation bugs, run the function:
```bash
bun run -e "import { fn } from './calcs/<file>'; console.log(fn({...}))"
```

For frontend bugs, check the browser console and network tab.

If the dev server isn't running, start it with `bun run dev`.

### Step 3: Match against common prototype bugs

Before forming a hypothesis, check if this is a known pattern:

| Bug | What you see | Fix |
|-----|-------------|-----|
| Missing column | `no such column` error | Add the column to `CREATE TABLE` in `server/db/schema.ts`, delete `prototype.db`, restart |
| Stale schema | Table has old columns after you changed the schema | Delete `prototype.db` and restart — SQLite won't alter existing tables with `CREATE TABLE IF NOT EXISTS` |
| Route not registered | 404 on API call | Add `app.route("/api", yourRoutes)` in `server/index.ts` |
| Soft-delete leak | Deleted items still appear in lists | Add `WHERE is_deleted = 0` to the query |
| Decimal misuse | Financial math is slightly off | Replace native `number` with `new Decimal()` from decimal.js |
| Vite proxy miss | Frontend can't reach API, network error in browser | Check `/api` proxy target in `vite.config.ts` points to `http://localhost:3000` |
| CORS error | Fetch fails in browser with CORS message | Check CORS middleware in `server/index.ts` |
| Pinia not reactive | UI doesn't update after data changes | Use `.value` on refs, or call store actions instead of mutating directly |
| Page not found | Blank page or 404 in app | Add the route to `src/router.ts` |
| Type mismatch | Data looks wrong silently | Check TEXT vs INTEGER in schema, and string vs number in API responses |
| Missing .gitignore | `prototype.db` or `node_modules` committed, git is slow | Create `.gitignore` with: `node_modules/`, `dist/`, `prototype.db`, `.vercel/`, `.env` |
| Validation error | 500 error when submitting empty form | Add input validation in the route handler (check required fields, return 400) |

### Step 4: Form and test a hypothesis

State your hypothesis clearly: "The bug is caused by [X] because [evidence]."

Verify it before writing any fix. Add a temporary `console.log` at the suspected location and check:
- Server-side: terminal running `bun run dev`
- Client-side: browser console

If the hypothesis is wrong, go back to Step 1 with the new information. Do not guess.

If 3 hypotheses fail, stop and tell the user what you tried, what you ruled out, and ask them to describe what they see when the bug happens. Sometimes the user has context you don't.

### Step 5: Fix and verify

Apply the smallest change that fixes the root cause. Do not refactor adjacent code.

Before finishing, check that Valur patterns are still intact:
- Soft-delete: no hard-deletes introduced
- Financial math: still using `Decimal`, not native `number`
- Tables: still have `id`, `is_deleted`, `created_at`, `updated_at`
- API responses: consistent shapes
- Input validation: required fields checked, 400 returned for bad input

Verify the fix:
1. Reproduce the original bug scenario — confirm it no longer occurs
2. Run `bun run build` — confirm no type errors were introduced

### Step 6: Report

```
What was wrong:  [root cause, with file:line]
What was fixed:  [change summary]
Verified:        [how — curl output, build result, etc.]
```

If the fix didn't fully resolve the issue or something else looks fragile, say so.

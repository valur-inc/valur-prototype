---
name: valur-prototype:review
description: Review a Valur prototype for production-readiness. Checks code against Valur's standards (soft-delete, timestamps, Decimal math, API patterns) and generates an integration report for engineers.
user_invocable: true
---

# Review Valur Prototype

Review prototype code to assess how ready it is for engineering integration into Valur's production stack.

## Process

1. Read the prototype's key files:
   - `server/db/schema.ts` — database tables
   - `server/routes/` — all API route files
   - `calcs/` — all calculation files
   - `src/pages/` — all page components
   - `src/stores/` — all Pinia stores
   - `src/router.ts` — route definitions

2. Check each area against these standards:

### Database (`server/db/schema.ts`)
- Every table has: `id`, `is_deleted`, `created_at`, `updated_at`
- Field types make sense (TEXT for strings, INTEGER for numbers, TEXT for monetary values)

### API Routes (`server/routes/`)
- List queries filter `WHERE is_deleted = 0`
- Delete endpoints soft-delete (`SET is_deleted = 1`), never hard-delete
- Proper HTTP status codes (200 list/update, 201 create, 404 not found)
- Consistent response shapes

### Calculations (`calcs/`)
- Uses `Decimal` from decimal.js for all financial math (no native `number` for money)
- Values passed as strings to preserve precision
- Returns `{ years: [...], totals: {...} }` for projections
- Rounding only at output, not intermediate steps

### Frontend (`src/pages/`, `src/stores/`)
- Uses `useApi()` composable for API calls
- Uses Pinia stores for shared state
- Uses Tailwind for styling
- Loading and error states handled

### General
- No extra frameworks installed beyond template defaults
- No hardcoded secrets
- No authentication code (production handles this)

3. Generate report:

```markdown
## Prototype Review

### Summary
<1-2 sentence assessment>

### Production-Ready
- <things that will port cleanly>

### Needs Changes
For each issue:
- **File**: path — **Issue**: what's wrong — **Fix**: how to fix

### Integration Notes for Engineers
- Which production files to create (Django models, DRF views, Vuex stores, etc.)
- Estimated effort
- Any complex logic that needs careful porting
```

4. Offer to fix any blocking issues automatically.

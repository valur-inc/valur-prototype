# Valur Prototype Environment

This is a lightweight full-stack prototyping environment for Valur team members. You can build complete features here — UI, API, database, calculations — without needing Docker, PostgreSQL, or the production codebase.

Everything you build here is designed to be portable to Valur's production stack by the engineering team.

## Stack

- **Frontend**: Vue 3 + Vite + Tailwind CSS + Pinia
- **Backend API**: Hono (runs on Bun)
- **Database**: SQLite (via `bun:sqlite`, zero setup)
- **Calculations**: TypeScript + decimal.js (precision financial math)
- **Runtime**: Bun (single runtime for everything)

## Commands

```bash
bun install          # Install dependencies (first time only)
bun run dev          # Start frontend + API (all you need)
bun run dev:app      # Start frontend only
bun run dev:api      # Start API only
```

Frontend runs at http://localhost:5173, API at http://localhost:3000.
The frontend proxies `/api/*` to the API server automatically.

## How to Build Features

When the user describes a feature, follow these patterns. They map directly to Valur's production code, making engineering handoff smooth.

### Adding a New Page

1. Create `src/pages/YourFeature.vue`:

```vue
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useApi } from "@/composables/useApi";

const api = useApi();
const items = ref([]);

onMounted(async () => {
  items.value = await api.get("/api/your-feature");
});
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold">Your Feature</h1>
    <!-- Build your UI here with Tailwind classes -->
  </div>
</template>
```

2. Add route in `src/router.ts`:
```ts
{
  path: "/your-feature",
  name: "your-feature",
  component: () => import("./pages/YourFeature.vue"),
}
```

3. Add nav link in `src/App.vue` if needed.

### Adding API Endpoints

Create `server/routes/your-feature.ts`:

```ts
import { Hono } from "hono";
import { getDb } from "../db/schema";

export const yourFeatureRoutes = new Hono();

// List items (exclude soft-deleted)
yourFeatureRoutes.get("/your-feature", (c) => {
  const db = getDb();
  const rows = db.query("SELECT * FROM your_table WHERE is_deleted = 0 ORDER BY id DESC").all();
  return c.json(rows);
});

// Create item
yourFeatureRoutes.post("/your-feature", async (c) => {
  const body = await c.req.json();
  const db = getDb();
  const result = db.query("INSERT INTO your_table (field1, field2) VALUES (?, ?) RETURNING *")
    .get(body.field1, body.field2);
  return c.json(result, 201);
});

// Delete item (soft-delete, NOT hard delete)
yourFeatureRoutes.delete("/your-feature/:id", (c) => {
  const db = getDb();
  db.query("UPDATE your_table SET is_deleted = 1, updated_at = datetime('now') WHERE id = ?")
    .run(c.req.param("id"));
  return c.json({ success: true });
});
```

Register in `server/index.ts`:
```ts
import { yourFeatureRoutes } from "./routes/your-feature";
app.route("/api", yourFeatureRoutes);
```

### Adding Database Tables

Add to `server/db/schema.ts` in the `initDb()` function:

```ts
db.exec(`
  CREATE TABLE IF NOT EXISTS your_table (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    field1 TEXT NOT NULL,
    field2 INTEGER NOT NULL DEFAULT 0,
    is_deleted INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);
```

**Every table MUST include**: `id`, `is_deleted`, `created_at`, `updated_at`. This matches Valur's production BaseModel + BaseSafeMixin pattern.

### Adding Financial Calculations

Create calculation functions in `calcs/`:

```ts
import Decimal from "decimal.js";

export function calculateSomething(params: {
  amount: string;     // Always string — preserves precision
  rate: string;
  years: number;
}): { years: YearResult[]; totals: Record<string, string> } {
  const amount = new Decimal(params.amount);
  const rate = new Decimal(params.rate);
  const years = [];

  let current = amount;
  for (let year = 1; year <= params.years; year++) {
    const growth = current.mul(rate);
    current = current.add(growth);
    years.push({
      year,
      value: current.toFixed(2),
      growth: growth.toFixed(2),
    });
  }

  return {
    years,
    totals: { finalValue: current.toFixed(2) },
  };
}
```

Expose via an API endpoint so the frontend can call it:

```ts
// In server/routes/your-calc.ts
import { calculateSomething } from "../../calcs/your-calc";

yourCalcRoutes.post("/calculate/your-calc", async (c) => {
  const params = await c.req.json();
  const result = calculateSomething(params);
  return c.json(result);
});
```

### Adding a Pinia Store

Create `src/stores/your-feature.ts`:

```ts
import { ref } from "vue";
import { defineStore } from "pinia";
import { useApi } from "@/composables/useApi";

export const useYourFeatureStore = defineStore("your-feature", () => {
  const api = useApi();
  const items = ref([]);
  const loading = ref(false);

  async function fetch() {
    loading.value = true;
    try {
      items.value = await api.get("/api/your-feature");
    } finally {
      loading.value = false;
    }
  }

  async function create(data: Record<string, unknown>) {
    const item = await api.post("/api/your-feature", data);
    items.value.unshift(item);
  }

  return { items, loading, fetch, create };
});
```

## Production Mapping Reference

This is how prototype code translates to Valur's production stack. Engineers use this when integrating your prototype.

| Prototype | Production | Where |
|---|---|---|
| `src/pages/*.vue` (Vue 3 `<script setup>`) | `src/pages/*.vue` (Vue 2 Options API) | frontend repo |
| `src/stores/*.ts` (Pinia) | `src/store/*.js` (Vuex namespaced modules) | frontend repo |
| `src/composables/useApi.ts` | `src/store/api.js` (addOrEditItem/getItems/deleteItem) | frontend repo |
| Tailwind classes | Tailwind classes (identical) | frontend repo |
| `server/routes/*.ts` (Hono) | `valur/api/views/*.py` (DRF ViewSets) | backend repo |
| `server/db/schema.ts` (SQLite) | `valur/<app>/models.py` (Django models + PostgreSQL) | backend repo |
| `calcs/*.ts` (decimal.js) | `valur/models/<feature>/` (Python Decimal) | model repo |
| TypeScript interfaces | DRF Serializers + Pydantic models | backend/model repos |

## Mandatory Patterns

These MUST be followed in all prototype code. They exist because Valur's production system requires them.

### Soft Delete
Never hard-delete data. Always use soft-delete:
- Every table has `is_deleted INTEGER NOT NULL DEFAULT 0`
- DELETE endpoints set `is_deleted = 1` instead of removing the row
- All queries filter `WHERE is_deleted = 0`

### Timestamps
Every table includes:
- `created_at` — set once on creation
- `updated_at` — updated on every modification

### Financial Precision
- Use `decimal.js` for ALL financial calculations
- Pass monetary values as strings (`"1000.50"`, not `1000.50`)
- Never use native JS `number` for dollar amounts, rates, or percentages
- Round only at output (`.toFixed(2)`), not during intermediate calculations

### Year-by-Year Projections
Financial calculators return `{ years: [...], totals: {...} }`:
- `years`: Array of per-year results
- `totals`: Summary aggregations
This matches the production Model service pattern exactly.

### API Response Shapes
- List endpoints return arrays: `[{ id, ...fields, created_at, updated_at }]`
- Create endpoints return the created object with `201` status
- Error responses: `{ message: "..." }` with appropriate HTTP status
- Delete endpoints return `{ success: true }`

## What NOT to Do

- **Do NOT install additional UI frameworks** (no React, no Angular, no component libraries). Tailwind handles all styling.
- **Do NOT use native JS numbers for money**. Always use `decimal.js`.
- **Do NOT hard-delete records**. Always soft-delete.
- **Do NOT add authentication**. The prototype doesn't need it — production handles auth via JWT.
- **Do NOT add environment variable management** beyond what's here. Keep it simple.
- **Do NOT create separate microservices**. Everything runs in this one project.
- **Do NOT use an ORM**. Raw SQL with `bun:sqlite` is fine for prototypes. Engineers will translate to Django ORM.

## File Structure

```
prototype-template/
├── src/                    # Frontend (Vue 3)
│   ├── pages/              # Page components (one per route)
│   ├── components/         # Reusable UI components
│   ├── stores/             # Pinia state stores
│   ├── composables/        # Vue composables (useApi, etc.)
│   ├── types/              # TypeScript type definitions
│   ├── assets/             # CSS, images
│   ├── App.vue             # Root component with nav
│   ├── router.ts           # Route definitions
│   └── main.ts             # App entry point
├── server/                 # Backend API (Hono)
│   ├── routes/             # API route handlers
│   ├── db/                 # Database schema and setup
│   └── index.ts            # Server entry point
├── calcs/                  # Financial calculations
│   └── index.ts            # Calculator functions
├── scripts/
│   └── dev.ts              # Dev server launcher
└── CLAUDE.md               # This file
```

---
name: valur-prototype:ship
description: Deploy a Valur prototype to Vercel. Type-checks, commits, configures Vercel if needed, and deploys. Returns a live URL to share with the team. Use when asked to "ship", "deploy", "publish", or "share this".
user_invocable: true
---

# Ship Valur Prototype

Deploy the prototype to Vercel and return a shareable URL. Run straight through — only stop for errors or missing authentication.

## Step 1: Pre-flight checks

### Check for SQLite usage

```bash
grep -r "bun:sqlite\|getDb()" server/ --include="*.ts" -l
```

If any route files use the database, warn the user upfront:

```
Heads up: Your prototype uses a local SQLite database. When deployed to
Vercel, the UI and navigation will work perfectly, but API routes that
read/write the database won't work (SQLite only runs locally).

This is fine for sharing the UI and flow with the team. If you need a
live API demo, we'd need to switch to Vercel Postgres or Turso.

Want to proceed with the deploy?
```

Wait for confirmation before continuing.

### Check for .gitignore

```bash
cat .gitignore 2>/dev/null
```

If `.gitignore` doesn't exist, create one:

```
node_modules/
dist/
prototype.db
.vercel/
.env
.env.local
.DS_Store
```

### Type-check

```bash
bun run build
```

If there are type errors, fix them and re-run until clean. Do not deploy broken code.

## Step 2: Commit changes

Check for uncommitted changes:
```bash
git status --short
```

If there are changes, commit them:

1. Review what changed:
   ```bash
   git diff --stat
   ```

2. Stage files — use `git add -A` (the `.gitignore` ensures `prototype.db`, `node_modules/`, `dist/`, and `.env` are excluded automatically).

3. Verify nothing sensitive is staged:
   ```bash
   git diff --cached --name-only
   ```
   If you see any `.env` files, credentials, or `prototype.db` in the staged list, unstage them with `git reset HEAD <file>` and add them to `.gitignore`.

4. Commit:
   ```bash
   git commit -m "<short description of what's being shipped>"
   ```

If the working tree is clean, skip to Step 3.

## Step 3: Vercel CLI

Check if Vercel CLI is available:
```bash
bunx vercel --version 2>/dev/null || npx vercel --version 2>/dev/null
```

If not found, install it:
```bash
bun add -g vercel
```

If that fails, tell the user to run `! npm i -g vercel` and `! vercel login`, then try `/valur-prototype:ship` again.

Use `bunx vercel` for all subsequent commands (fall back to `npx vercel` if needed).

## Step 4: Link project

```bash
ls .vercel/project.json 2>/dev/null && cat .vercel/project.json
```

If `.vercel/project.json` doesn't exist, run `bunx vercel link`. If Vercel asks for settings:
- Framework: Vite
- Build command: `vite build`
- Output directory: `dist`
- Install command: `bun install`

If Vercel asks the user to log in, tell them: "Run `! vercel login` first, then try `/valur-prototype:ship` again."

## Step 5: Vercel configuration

Check if `vercel.json` exists:
```bash
cat vercel.json 2>/dev/null
```

If it doesn't exist, create the Vercel configuration and the serverless API adapter.

### Create `vercel.json`:
```json
{
  "buildCommand": "bun install && vite build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" }
  ],
  "functions": {
    "api/**/*.ts": {
      "runtime": "@vercel/node@3"
    }
  }
}
```

### Create `api/index.ts`:

This is a Vercel serverless function that wraps the API. Because `bun:sqlite` is not available on Vercel, you must re-create the Hono app here rather than importing from `server/index.ts`.

1. Read `server/index.ts` to find all registered route files.
2. Read each route file and check whether it imports from `../db/schema` (uses SQLite).
3. Build `api/index.ts`:

```ts
import { handle } from "hono/vercel";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono().basePath("/api");

app.use("*", cors());

app.get("/health", (c) => c.json({ status: "ok" }));

// --- Routes that DON'T use SQLite: import and register them here ---
// import { calcRoutes } from "../server/routes/calculations";
// app.route("/", calcRoutes);

// --- Routes that use SQLite: create stub endpoints ---
// These return a helpful message instead of crashing.
// Example for a route that normally uses getDb():
// app.all("/examples/*", (c) =>
//   c.json({ message: "This endpoint requires the local database. Run 'bun run dev' locally." }, 501)
// );

export default handle(app);
```

**Rules for building `api/index.ts`:**
- Routes that do NOT import from `../db/schema` → import and register them normally
- Routes that DO import from `../db/schema` → create a stub that returns a 501 with a helpful message explaining the endpoint needs the local database
- Always include the `/health` endpoint
- Import calculation routes from `../../calcs/` if they exist and are used by any route

### Commit the new files:
```bash
git add vercel.json api/
git commit -m "add Vercel deployment config"
```

If `vercel.json` and `api/index.ts` already exist, skip this step.

## Step 6: Deploy

If the user said "prod", "production", or "live" (in their message or `$ARGUMENTS`):
```bash
bunx vercel --prod --yes 2>&1
```

Otherwise deploy a preview:
```bash
bunx vercel --yes 2>&1
```

If deployment fails:
- Authentication error — tell the user to run `! vercel login`
- Build error — fix it and re-deploy
- Anything else — show the error and stop

## Step 7: Done

Share the deployment URL with the user. Format the message clearly:

```
Deployed! Here's your link:

  <URL>

Share this with anyone on the team — they can open it in any browser.
```

If the prototype uses SQLite, add:

```
The UI and page flow are fully deployed. API routes that read/write
the database return a placeholder message since SQLite only runs
locally. This is normal — the deployed version is for sharing the
UI design and flow with the team.
```

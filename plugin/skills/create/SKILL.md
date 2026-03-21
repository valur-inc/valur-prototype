---
name: valur-prototype:create
description: Create a new Valur prototype project in the current directory. Sets up Vue 3 + Vite + Tailwind frontend, Hono API backend, SQLite database, and decimal.js calculations — all running on Bun with zero infrastructure.
user_invocable: true
---

# Create Valur Prototype

Set up a full-stack prototype project in the current working directory.

## Step 1: Ensure Bun is installed

Run `bun --version` to check.

If Bun is NOT installed, install it automatically:
- **Mac/Linux**: Run `curl -fsSL https://bun.sh/install | bash` then `export BUN_INSTALL="$HOME/.bun" && export PATH="$BUN_INSTALL/bin:$PATH"`
- **Windows**: Run `powershell -c "irm bun.sh/install.ps1 | iex"`

Verify with `bun --version` after installing. If it still fails, tell the user to close and reopen their terminal, then run `/valur-prototype:create` again.

## Step 2: Create project files

Read every file from the plugin's template directory at `${CLAUDE_PLUGIN_ROOT}/template/` — preserving the full directory structure (`src/`, `server/`, `calcs/`, `scripts/`).

Write each file to the current working directory, maintaining the same relative paths. The template contains:

```
CLAUDE.md                          # Guides future Claude sessions
package.json                       # Bun dependencies
tsconfig.json                      # TypeScript config
tsconfig.node.json                 # Vite TS config
vite.config.ts                     # Vite + API proxy setup
tailwind.config.ts                 # Tailwind with Valur colors
postcss.config.js                  # PostCSS
index.html                         # Entry HTML
scripts/dev.ts                     # Dev server launcher
src/main.ts                        # Vue app entry
src/App.vue                        # Root component with nav
src/router.ts                      # Route definitions
src/env.d.ts                       # Vue type declarations
src/assets/main.css                # Tailwind imports
src/pages/Home.vue                 # Example page
src/stores/example.ts              # Example Pinia store
src/composables/useApi.ts          # API helper
src/types/index.ts                 # Shared types
server/index.ts                    # Hono API entry
server/db/schema.ts                # SQLite schema
server/routes/example.ts           # Example CRUD routes
calcs/index.ts                     # decimal.js calculator example
```

## Step 3: Install dependencies

Run `bun install`.

## Step 4: Scaffold initial feature (if described)

If the user provided a description of what they want to build (via $ARGUMENTS or in their message), scaffold the initial feature:
- Create the page in `src/pages/`
- Add the route in `src/router.ts`
- Create the database table in `server/db/schema.ts`
- Create the API routes in `server/routes/`
- Create a Pinia store in `src/stores/`
- Wire everything together

## Step 5: Done

Tell the user:
```
Prototype ready! Run:
  bun run dev

Then open http://localhost:5173

Describe what you want to build and I'll create it.
```

## Important

- Do NOT skip writing the CLAUDE.md file — it's essential for guiding future Claude sessions in this project.
- Do NOT modify the template files — write them exactly as they are in the plugin's template directory.
- Create necessary subdirectories (`src/pages/`, `src/stores/`, etc.) before writing files into them.

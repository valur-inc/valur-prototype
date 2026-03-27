---
name: valur-prototype:create
description: Create a new Valur prototype project in the current directory. Sets up Vue 3 + Vite + Tailwind frontend, Hono API backend, SQLite database, and decimal.js calculations — all running on Bun with zero infrastructure.
user_invocable: true
---

# Create Valur Prototype

Set up a full-stack prototype project in the current working directory.

## Step 1: Check directory is empty

Run `ls -A` in the current directory. If there are files present (other than `.git`), warn the user: "This folder isn't empty. Create a new empty folder and run /valur-prototype:create there."

## Step 2: Ensure Bun is installed

Run `$HOME/.bun/bin/bun --version` to check. If that fails, also try `bun --version` (it may already be on PATH).

If Bun is NOT installed, install it automatically:

1. **Install**: Run `curl -fsSL https://bun.sh/install | bash`
2. **Set PATH for this session**: Run `export BUN_INSTALL="$HOME/.bun" && export PATH="$BUN_INSTALL/bin:$PATH"`
3. **Persist PATH for the user's terminal**: The installer writes to `~/.bashrc`, but macOS defaults to zsh. Detect the shell and append to the correct rc file if it doesn't already contain `BUN_INSTALL`:
   - Run `echo $SHELL` to detect the shell
   - If it contains `zsh`: check `~/.zshrc` for `BUN_INSTALL`. If not found, append:
     ```
     echo '' >> ~/.zshrc
     echo '# Bun' >> ~/.zshrc
     echo 'export BUN_INSTALL="$HOME/.bun"' >> ~/.zshrc
     echo 'export PATH="$BUN_INSTALL/bin:$PATH"' >> ~/.zshrc
     ```
   - If it contains `bash`: the installer already handled `~/.bashrc`, no action needed.
4. **Verify**: Run `$HOME/.bun/bin/bun --version`. If this fails, tell the user to close and reopen their terminal, then run `/valur-prototype:create` again.

For **Windows**: Run `powershell -c "irm bun.sh/install.ps1 | iex"`

## Step 3: Create project files

Read every file from the plugin's template directory at `${CLAUDE_PLUGIN_ROOT}/template/` and write it to the current working directory, preserving the exact same content and directory structure.

**Complete file checklist** — read and write every one of these files. Do not skip any:

```
.gitignore                         # Git ignore rules (node_modules, db, etc.)
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

Create the directories first (`src/pages/`, `src/stores/`, `src/composables/`, `src/types/`, `src/assets/`, `server/routes/`, `server/db/`, `calcs/`, `scripts/`), then write the files.

**Do NOT modify template files** — write them exactly as they are in the plugin's template directory.

## Step 4: Install dependencies

Run `bun install`.

## Step 5: Initialize git repository

```bash
git init
git add -A
git commit -m "initial prototype setup"
```

This creates a clean starting point. All future changes can be tracked and deployed.

## Step 6: Scaffold initial feature (if described)

If the user provided a description of what they want to build (via $ARGUMENTS or in their message), scaffold the initial feature:
- Create the page in `src/pages/`
- Add the route in `src/router.ts`
- Create the database table in `server/db/schema.ts`
- Create the API routes in `server/routes/`
- Create a Pinia store in `src/stores/`
- Wire everything together

## Step 7: Done

Tell the user:
```
Your prototype is ready! To start it:

  bun run dev

Then open http://localhost:5173 in your browser.

Tell me what you want to build and I'll create it for you.
```

## Important

- Do NOT skip writing the `.gitignore` — without it, database files and dependencies will be committed.
- Do NOT skip writing the `CLAUDE.md` — it guides all future Claude sessions in this project.
- Do NOT modify the template files — write them exactly as they are in the plugin's template directory.
- Create necessary subdirectories before writing files into them.

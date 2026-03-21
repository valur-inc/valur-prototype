VALUR PROTOTYPE PLUGIN
======================

A Claude Code plugin for Valur team members to build full-stack feature
prototypes without Docker, PostgreSQL, or access to the production codebase.

What you can build:
  - Pages, forms, dashboards, wizards     (Vue 3 + Tailwind)
  - API endpoints and data storage        (Hono + SQLite)
  - Financial calculations                (decimal.js)


================================================================
INSTALLATION
================================================================

STEP 1 -- Install Node.js (needed for Claude Code)

  Go to https://nodejs.org and download the LTS version.
  Run the installer and follow the steps.

  To verify it worked, open a new terminal and run:
    node --version

  You should see a version number like "v22.0.0".


STEP 2 -- Install Claude Code

  Mac / Linux / Windows:
    npm install -g @anthropic-ai/claude-code

  Run "claude" once and log in with your Anthropic account.


STEP 3 -- Install the plugin

  Open Claude Code:
    claude

  Run these two commands:
    /plugin marketplace add https://github.com/valur-inc/valur-prototype
    /plugin install valur-prototype

  Done. You can close Claude Code.

  Note: Bun (needed to run prototypes) is installed automatically
  the first time you use the plugin.


================================================================
BUILDING A PROTOTYPE
================================================================

1. Create an empty folder for your project:

     mkdir ~/my-feature
     cd ~/my-feature

2. Start Claude Code:

     claude

3. Run:

     /valur-prototype:create

   Claude installs Bun if needed, sets up the project, and
   installs all dependencies automatically.

4. Start the dev server:

     bun run dev

5. Open http://localhost:5173 in your browser.

6. Describe what you want to build in plain English. Examples:

     "Create a page where advisors can enter client details
     and save them to a database. Show a list of all clients."

     "Build a calculator where I enter an investment amount
     and return rate, and it shows a 10-year projection."

     "Add a dashboard with summary cards showing total
     clients and total assets."

     "Create a multi-step form: step 1 personal info,
     step 2 asset details, step 3 review."


================================================================
REVIEWING A PROTOTYPE
================================================================

When your prototype is ready, ask an engineer to run:

  /valur-prototype:review

This checks your code against Valur's standards and generates
an integration report for the engineering team.


================================================================
TROUBLESHOOTING
================================================================

"bun: command not found" after setup
  Close and reopen your terminal, then run "bun run dev" again.

"claude: command not found"
  Run: npm install -g @anthropic-ai/claude-code
  If npm is not found, go back to Step 1 and install Node.js.

Prototype not loading in browser
  Keep the terminal with "bun run dev" open -- don't close it.

Want to start fresh
  Delete the project folder, create a new one, and run
  /valur-prototype:create again.

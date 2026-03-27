/**
 * Start both frontend (Vite) and backend (Hono) dev servers.
 * Usage: bun run dev
 *
 * If one server crashes, the other will be stopped automatically
 * so the error is visible in the terminal.
 */
import { $ } from "bun";

console.log("Starting Valur prototype...");
console.log("  Frontend: http://localhost:5173");
console.log("  API:      http://localhost:3000");
console.log("");

const frontend = $`bun run dev:app`.quiet();
const api = $`bun run dev:api`;

try {
  // Wait for whichever finishes (or crashes) first
  const result = await Promise.race([
    frontend.then(() => "frontend"),
    api.then(() => "api"),
  ]);
  console.error(`\n${result} server stopped unexpectedly. Shutting down...`);
  process.exit(1);
} catch (error) {
  console.error("\nA server crashed. Check the error above and restart with: bun run dev");
  process.exit(1);
}

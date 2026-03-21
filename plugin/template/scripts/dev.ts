/**
 * Start both frontend (Vite) and backend (Hono) dev servers.
 * Usage: bun run dev
 */
import { $ } from "bun";

console.log("Starting Valur prototype...");
console.log("  Frontend: http://localhost:5173");
console.log("  API:      http://localhost:3000");
console.log("");

await Promise.all([
  $`bun run dev:app`.quiet(),
  $`bun run dev:api`,
]);

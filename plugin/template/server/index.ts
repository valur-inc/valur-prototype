import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { exampleRoutes } from "./routes/example";
import { initDb } from "./db/schema";

export const app = new Hono();

app.use("*", logger());
app.use("*", cors());

// Health check
app.get("/api/health", (c) => c.json({ status: "ok" }));

// Register route modules here
app.route("/api", exampleRoutes);

// Initialize database and start
initDb();

export default {
  port: 3000,
  fetch: app.fetch,
};

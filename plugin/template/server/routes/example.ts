/**
 * Example API routes.
 *
 * Production mapping:
 * - Each route group here maps to a DRF ViewSet in valur/api/views/<feature>.py
 * - GET /examples      → ViewSet.list()
 * - POST /examples     → ViewSet.create()
 * - GET /examples/:id  → ViewSet.retrieve()
 * - PATCH /examples/:id → ViewSet.partial_update()
 * - DELETE /examples/:id → ViewSet.destroy() (soft-delete)
 *
 * URL pattern in production: /api/<user_pk>/your-feature/
 */
import { Hono } from "hono";
import { getDb } from "../db/schema";

export const exampleRoutes = new Hono();

// List (excludes soft-deleted — mirrors safe_objects manager)
exampleRoutes.get("/examples", (c) => {
  const db = getDb();
  const rows = db.query("SELECT * FROM examples WHERE is_deleted = 0 ORDER BY id DESC").all();
  return c.json(rows);
});

// Create
exampleRoutes.post("/examples", async (c) => {
  const body = await c.req.json<{ name: string }>();
  const db = getDb();
  const result = db.query("INSERT INTO examples (name) VALUES (?) RETURNING *").get(body.name);
  return c.json(result, 201);
});

// Retrieve
exampleRoutes.get("/examples/:id", (c) => {
  const db = getDb();
  const row = db.query("SELECT * FROM examples WHERE id = ? AND is_deleted = 0").get(c.req.param("id"));
  if (!row) return c.json({ message: "Not found" }, 404);
  return c.json(row);
});

// Update
exampleRoutes.patch("/examples/:id", async (c) => {
  const body = await c.req.json<{ name?: string }>();
  const db = getDb();
  if (body.name) {
    db.query("UPDATE examples SET name = ?, updated_at = datetime('now') WHERE id = ?").run(body.name, c.req.param("id"));
  }
  const row = db.query("SELECT * FROM examples WHERE id = ?").get(c.req.param("id"));
  return c.json(row);
});

// Soft delete (mirrors BaseSafeMixin pattern)
exampleRoutes.delete("/examples/:id", (c) => {
  const db = getDb();
  db.query("UPDATE examples SET is_deleted = 1, updated_at = datetime('now') WHERE id = ?").run(c.req.param("id"));
  return c.json({ success: true });
});

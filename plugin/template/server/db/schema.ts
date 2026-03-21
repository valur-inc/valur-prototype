/**
 * SQLite database setup using Bun's built-in SQLite driver.
 *
 * Production mapping:
 * - Each table here maps to a Django model in valur/<app>/models.py
 * - id, created_at, updated_at map to BaseModel fields (pk, created, modified)
 * - is_deleted maps to BaseSafeMixin soft-delete pattern
 * - user_id maps to BaseUserModel.user ForeignKey
 *
 * When defining tables, think about the Django model equivalent:
 *   SQLite INTEGER  → Django IntegerField / DecimalField
 *   SQLite TEXT     → Django CharField / TextField
 *   SQLite REAL     → Django FloatField (avoid for money — use TEXT + decimal.js)
 *   SQLite BLOB     → Django FileField (in production, files go to S3)
 */
import { Database } from "bun:sqlite";

let db: Database;

export function getDb(): Database {
  if (!db) {
    db = new Database("prototype.db", { create: true });
    db.exec("PRAGMA journal_mode = WAL;");
  }
  return db;
}

export function initDb() {
  const db = getDb();

  // Example table — replace with your own
  db.exec(`
    CREATE TABLE IF NOT EXISTS examples (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      is_deleted INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Add your tables here. Each table should include:
  //   id            — primary key
  //   is_deleted    — soft delete (production uses BaseSafeMixin)
  //   created_at    — auto timestamp (production uses BaseModel.created)
  //   updated_at    — auto timestamp (production uses BaseModel.modified)
}

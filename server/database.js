import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { migrateDatabase } from "./migrations.js";

export function createDatabase(databasePath = process.env.DATABASE_PATH ?? "./data/portfolio.sqlite") {
  if (databasePath !== ":memory:") {
    fs.mkdirSync(path.dirname(path.resolve(databasePath)), { recursive: true });
  }

  const db = new Database(databasePath);
  try {
    db.pragma("busy_timeout = 5000");
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    migrateDatabase(db);
  } catch (error) {
    db.close();
    throw error;
  }
  return db;
}

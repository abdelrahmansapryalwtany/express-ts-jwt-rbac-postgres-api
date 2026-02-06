import path from "node:path";
import { newDb } from "pg-mem";
import type { Pool } from "pg";
import { createApp } from "../../src/app";
import { runMigrations } from "../../src/db/migrate";

export async function createTestApp() {
  process.env.JWT_SECRET = process.env.JWT_SECRET ?? "test_secret_1234567890";
  process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1h";
  process.env.DATABASE_URL = process.env.DATABASE_URL ?? "postgres://test";

  const db = newDb();
  const adapter = db.adapters.createPg();
  const pool = new adapter.Pool() as unknown as Pool;

  await runMigrations(pool, path.join(process.cwd(), "migrations"));

  const app = createApp({ pool });
  return { app, pool, db };
}


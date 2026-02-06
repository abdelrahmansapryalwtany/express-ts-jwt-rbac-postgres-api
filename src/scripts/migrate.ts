import path from "node:path";
import { createPool } from "../db/pool";
import { runMigrations } from "../db/migrate";

async function main() {
  const pool = createPool();
  const migrationsDir = path.join(process.cwd(), "migrations");

  await runMigrations(pool, migrationsDir);
  await pool.end();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});


import fs from "node:fs";
import path from "node:path";
export type Queryable = { query: (sql: string) => Promise<unknown> };

export async function runMigrations(db: Queryable, migrationsDir: string): Promise<void> {
  const entries = fs.readdirSync(migrationsDir, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile() && e.name.endsWith(".sql"))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b));

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    await db.query(sql);
  }
}


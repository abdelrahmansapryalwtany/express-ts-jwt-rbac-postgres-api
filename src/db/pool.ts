import { Pool } from "pg";
import { getEnv } from "../config/env";

export function createPool(): Pool {
  const env = getEnv();
  return new Pool({
    connectionString: env.DATABASE_URL,
  });
}


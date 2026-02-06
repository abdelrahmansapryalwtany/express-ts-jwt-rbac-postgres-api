import { createApp } from "./app";
import { createPool } from "./db/pool";
import { getEnv } from "./config/env";

async function main() {
  const env = getEnv();
  const pool = createPool();
  const app = createApp({ pool });

  const server = app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`);
  });

  const shutdown = async () => {
    server.close(() => undefined);
    await pool.end();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


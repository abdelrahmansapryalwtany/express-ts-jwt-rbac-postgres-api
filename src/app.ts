import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import type { Pool } from "pg";
import { errorHandler } from "./errors/errorHandler";
import { healthRoutes } from "./routes/healthRoutes";
import { authRoutes } from "./routes/authRoutes";
import { userRoutes } from "./routes/userRoutes";
import { adminRoutes } from "./routes/adminRoutes";

export function createApp(deps: { pool: Pool }) {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.use(healthRoutes());
  app.use("/auth", authRoutes(deps.pool));
  app.use(userRoutes(deps.pool));
  app.use("/admin", adminRoutes(deps.pool));

  app.use(errorHandler);
  return app;
}


import { Router } from "express";
import type { Pool } from "pg";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import { UserRepo } from "../repos/userRepo";

export function adminRoutes(pool: Pool): Router {
  const router = Router();
  const users = new UserRepo(pool);

  router.get("/users", requireAuth, requireRole("admin"), async (_req, res, next) => {
    try {
      const list = await users.listUsers();
      res.json({ users: list });
    } catch (err) {
      next(err);
    }
  });

  return router;
}


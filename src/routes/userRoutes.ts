import { Router } from "express";
import type { Pool } from "pg";
import { HttpError } from "../errors/httpError";
import { requireAuth } from "../middleware/auth";
import { UserRepo } from "../repos/userRepo";

export function userRoutes(pool: Pool): Router {
  const router = Router();
  const users = new UserRepo(pool);

  router.get("/me", requireAuth, async (req, res, next) => {
    try {
      const id = req.user?.id;
      if (!id) throw new HttpError(401, "Unauthorized", "AUTH_REQUIRED");

      const user = await users.findById(id);
      if (!user) throw new HttpError(401, "Unauthorized", "AUTH_REQUIRED");

      res.json({
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          createdAt: user.created_at.toISOString(),
        },
      });
    } catch (err) {
      next(err);
    }
  });

  return router;
}


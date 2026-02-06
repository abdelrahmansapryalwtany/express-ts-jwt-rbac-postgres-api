import { Router } from "express";
import type { Pool } from "pg";
import { z } from "zod";
import { hashPassword, verifyPassword } from "../auth/password";
import { signAccessToken } from "../auth/jwt";
import { HttpError } from "../errors/httpError";
import { UserRepo } from "../repos/userRepo";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export function authRoutes(pool: Pool): Router {
  const router = Router();
  const users = new UserRepo(pool);

  router.post("/register", async (req, res, next) => {
    try {
      const body = RegisterSchema.parse(req.body);
      const existing = await users.findByEmail(body.email);
      if (existing) throw new HttpError(409, "Email already in use", "EMAIL_TAKEN");

      const passwordHash = await hashPassword(body.password);
      const created = await users.createUser({ email: body.email, passwordHash });
      res.status(201).json({ user: created });
    } catch (err) {
      next(err);
    }
  });

  router.post("/login", async (req, res, next) => {
    try {
      const body = LoginSchema.parse(req.body);
      const user = await users.findByEmail(body.email);
      if (!user) throw new HttpError(401, "Invalid email or password", "LOGIN_INVALID");

      const ok = await verifyPassword(body.password, user.password_hash);
      if (!ok) throw new HttpError(401, "Invalid email or password", "LOGIN_INVALID");

      const accessToken = signAccessToken({ id: user.id, role: user.role });
      res.json({ accessToken });
    } catch (err) {
      next(err);
    }
  });

  return router;
}


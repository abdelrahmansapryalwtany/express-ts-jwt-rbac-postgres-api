import type { RequestHandler } from "express";
import { HttpError } from "../errors/httpError";
import { verifyAccessToken } from "../auth/jwt";
import type { Role } from "../types/roles";

export type AuthUser = {
  id: number;
  role: Role;
};

function parseBearerToken(authorization?: string): string | null {
  if (!authorization) return null;
  const [scheme, token] = authorization.split(" ");
  if (!scheme || !token) return null;
  if (scheme.toLowerCase() !== "bearer") return null;
  return token;
}

export const requireAuth: RequestHandler = (req, _res, next) => {
  const token = parseBearerToken(req.header("authorization"));
  if (!token) return next(new HttpError(401, "Missing bearer token", "AUTH_MISSING"));

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: Number(payload.sub), role: payload.role };
    return next();
  } catch {
    return next(new HttpError(401, "Invalid token", "AUTH_INVALID"));
  }
};


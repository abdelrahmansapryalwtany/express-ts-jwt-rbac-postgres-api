import type { RequestHandler } from "express";
import { HttpError } from "../errors/httpError";
import type { Role } from "../types/roles";

export function requireRole(...allowed: Role[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.user) return next(new HttpError(401, "Unauthorized", "AUTH_REQUIRED"));
    if (!allowed.includes(req.user.role)) {
      return next(new HttpError(403, "Forbidden", "FORBIDDEN"));
    }
    return next();
  };
}


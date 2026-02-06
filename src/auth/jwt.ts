import jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";
import { getEnv } from "../config/env";
import type { Role } from "../types/roles";

export type AccessTokenPayload = {
  sub: string;
  role: Role;
};

export function signAccessToken(user: { id: number; role: Role }): string {
  const env = getEnv();
  const payload: AccessTokenPayload = { sub: String(user.id), role: user.role };
  const secret: Secret = env.JWT_SECRET;
  const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"] };
  return jwt.sign(payload, secret, options);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const env = getEnv();
  const secret: Secret = env.JWT_SECRET;
  const decoded = jwt.verify(token, secret);
  if (typeof decoded !== "object" || decoded == null) {
    throw new Error("Invalid token");
  }

  const payload = decoded as Partial<AccessTokenPayload>;
  if (!payload.sub || !payload.role) {
    throw new Error("Invalid token payload");
  }

  return { sub: payload.sub, role: payload.role };
}


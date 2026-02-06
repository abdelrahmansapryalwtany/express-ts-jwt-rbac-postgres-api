import type { Pool } from "pg";
import type { Role } from "../types/roles";

export type UserRow = {
  id: number;
  email: string;
  password_hash: string;
  role: Role;
  created_at: Date;
};

export type UserPublic = {
  id: number;
  email: string;
  role: Role;
  createdAt: string;
};

function toPublic(u: UserRow): UserPublic {
  return {
    id: u.id,
    email: u.email,
    role: u.role,
    createdAt: u.created_at.toISOString(),
  };
}

export class UserRepo {
  constructor(private readonly pool: Pool) {}

  async findByEmail(email: string): Promise<UserRow | null> {
    const res = await this.pool.query<UserRow>(
      `SELECT id, email, password_hash, role, created_at
       FROM users
       WHERE email = $1`,
      [email.toLowerCase()],
    );
    return res.rows[0] ?? null;
  }

  async findById(id: number): Promise<UserRow | null> {
    const res = await this.pool.query<UserRow>(
      `SELECT id, email, password_hash, role, created_at
       FROM users
       WHERE id = $1`,
      [id],
    );
    return res.rows[0] ?? null;
  }

  async createUser(input: {
    email: string;
    passwordHash: string;
    role?: Role;
  }): Promise<UserPublic> {
    const role: Role = input.role ?? "user";
    const res = await this.pool.query<UserRow>(
      `INSERT INTO users (email, password_hash, role)
       VALUES ($1, $2, $3)
       RETURNING id, email, password_hash, role, created_at`,
      [input.email.toLowerCase(), input.passwordHash, role],
    );

    return toPublic(res.rows[0]);
  }

  async listUsers(): Promise<UserPublic[]> {
    const res = await this.pool.query<UserRow>(
      `SELECT id, email, password_hash, role, created_at
       FROM users
       ORDER BY id ASC`,
    );
    return res.rows.map(toPublic);
  }
}


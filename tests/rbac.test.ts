import request from "supertest";
import { createTestApp } from "./helpers/testApp";
import { UserRepo } from "../src/repos/userRepo";
import { hashPassword } from "../src/auth/password";

describe("rbac", () => {
  it("blocks non-admin, allows admin", async () => {
    const { app, pool } = await createTestApp();
    const users = new UserRepo(pool);

    const userEmail = "user2@example.com";
    const userPassword = "password123";
    await request(app).post("/auth/register").send({ email: userEmail, password: userPassword });

    const userLogin = await request(app).post("/auth/login").send({ email: userEmail, password: userPassword });
    const userToken = userLogin.body.accessToken;

    const forbidden = await request(app)
      .get("/admin/users")
      .set("authorization", `Bearer ${userToken}`);
    expect(forbidden.status).toBe(403);

    const adminEmail = "admin@example.com";
    const adminPassword = "password123";
    await users.createUser({
      email: adminEmail,
      passwordHash: await hashPassword(adminPassword),
      role: "admin",
    });

    const adminLogin = await request(app)
      .post("/auth/login")
      .send({ email: adminEmail, password: adminPassword });
    const adminToken = adminLogin.body.accessToken;

    const ok = await request(app)
      .get("/admin/users")
      .set("authorization", `Bearer ${adminToken}`);
    expect(ok.status).toBe(200);
    expect(Array.isArray(ok.body.users)).toBe(true);
    expect(ok.body.users.length).toBeGreaterThanOrEqual(2);

    await pool.end();
  });
});


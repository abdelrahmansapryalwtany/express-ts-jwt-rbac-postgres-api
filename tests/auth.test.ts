import request from "supertest";
import { createTestApp } from "./helpers/testApp";

describe("auth flow", () => {
  it("register -> login -> me", async () => {
    const { app, pool } = await createTestApp();

    const email = "user@example.com";
    const password = "password123";

    const registerRes = await request(app).post("/auth/register").send({ email, password });
    expect(registerRes.status).toBe(201);
    expect(registerRes.body.user.email).toBe(email);
    expect(registerRes.body.user.role).toBe("user");

    const loginRes = await request(app).post("/auth/login").send({ email, password });
    expect(loginRes.status).toBe(200);
    expect(typeof loginRes.body.accessToken).toBe("string");

    const meRes = await request(app)
      .get("/me")
      .set("authorization", `Bearer ${loginRes.body.accessToken}`);
    expect(meRes.status).toBe(200);
    expect(meRes.body.user.email).toBe(email);
    expect(meRes.body.user.role).toBe("user");

    await pool.end();
  });
});


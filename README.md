# Express + TypeScript + JWT/RBAC + Postgres

[![CI](https://github.com/<OWNER>/<REPO>/actions/workflows/ci.yml/badge.svg)](https://github.com/<OWNER>/<REPO>/actions/workflows/ci.yml)

Small, production-ish API starter:

- Express (TypeScript)
- Postgres (`pg`)
- Auth: JWT access tokens
- RBAC: `user` / `admin`
- Tests: Jest + Supertest (DB is `pg-mem`, no Docker needed for unit tests)

> Replace `<OWNER>/<REPO>` in the badge URL after you push to GitHub.

## Quick start

### 1) Start Postgres (optional but recommended for local dev)

```bash
docker compose up -d
```

### 2) Create `.env`

This repo includes `env.example`. Create a `.env` file in the project root with the same keys:

- `PORT`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

Example (adjust if needed):

```env
PORT=3000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/app
JWT_SECRET=change_me_in_prod
JWT_EXPIRES_IN=15m
```

### 3) Install + migrate + run

```bash
npm install
npm run db:migrate
npm run dev
```

Health check:

- `GET /health` -> `{ ok: true }`

## API docs / examples

### Auth

#### Register

- `POST /auth/register`
- body: `{ "email": "user@example.com", "password": "password123" }`

PowerShell (use real curl, not the alias):

```powershell
curl.exe -s -X POST "http://localhost:3000/auth/register" -H "Content-Type: application/json" -d "{\"email\":\"user@example.com\",\"password\":\"password123\"}"
```

#### Login (get token)

- `POST /auth/login`
- body: `{ "email": "user@example.com", "password": "password123" }`
- response: `{ "accessToken": "..." }`

```powershell
curl.exe -s -X POST "http://localhost:3000/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"user@example.com\",\"password\":\"password123\"}"
```

#### Use the token

- `GET /me` (Bearer token required)

```powershell
curl.exe -s "http://localhost:3000/me" -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Admin (RBAC)

- `GET /admin/users` (Bearer token required + role `admin`)

Non-admin token should get `403`:

```powershell
curl.exe -i "http://localhost:3000/admin/users" -H "Authorization: Bearer <USER_ACCESS_TOKEN>"
```

Admin token should get `200`:

```powershell
curl.exe -i "http://localhost:3000/admin/users" -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>"
```

#### Making an admin for local testing

This starter intentionally does **not** include a â€œpromote roleâ€ endpoint.

Option A: update a user to admin directly in Postgres (docker):

```bash
docker compose exec -T db psql -U postgres -d app -c "UPDATE users SET role='admin' WHERE email='user@example.com';"
```

Option B: create an admin row manually:

```bash
docker compose exec -T db psql -U postgres -d app -c "INSERT INTO users(email,password_hash,role) VALUES ('admin@example.com','<bcrypt_hash_here>','admin');"
```

## Postman

A minimal collection is included: `postman_collection.json`.

## Running tests

```bash
npm test
```

Tests use an in-memory Postgres implementation (`pg-mem`) and run the SQL migrations from `./migrations`.

## Production notes

- JWT secret rotation: plan for periodic rotation (short overlap window or support multiple active secrets) and invalidate sessions when needed.
- Rate limiting: not included here (out of scope for this starter). Recommended for `/auth/login` (per-IP + per-credential).

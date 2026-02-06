# Express + TypeScript + JWT/RBAC + Postgres

Small, production-ish API starter:

- Express (TypeScript)
- Postgres (`pg`)
- Auth: JWT access tokens
- RBAC: `user` / `admin`
- Tests: Jest + Supertest (DB is `pg-mem`, no Docker needed for unit tests)

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

## Endpoints

### Auth

- `POST /auth/register`
  - body: `{ "email": "user@example.com", "password": "password123" }`
  - creates a `user`
- `POST /auth/login`
  - body: `{ "email": "...", "password": "..." }`
  - returns `{ "accessToken": "..." }`

### User

- `GET /me` (Bearer token required)

### Admin (RBAC)

- `GET /admin/users` (Bearer token required + role `admin`)

## Running tests

```bash
npm test
```

Tests use an in-memory Postgres implementation (`pg-mem`) and run the SQL migrations from `./migrations`.


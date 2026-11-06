# Luxent Hotel — Holiday Buffet 2026

Reservation form + admin dashboard for the Luxent Hotel Holiday Buffet 2026 early booking.

## Structure
- `client/` — Vite + React + Tailwind v4 frontend
- `server/` — Express API
- `db/migrations/` — plain SQL migrations
- `PROJECT_STATE.md` — living project state (ask me to "HANDOFF" to refresh)

## Local dev

### Prereqs
- Node 20+
- PostgreSQL 14+ running locally

### Backend
```bash
cd server
cp .env.example .env   # then edit DATABASE_URL, JWT_SECRET, ADMIN_*
npm install
npm run dev

## Database

Migrations live in `db/migrations/` (plain `.sql`, applied in filename order).
The runner lives in `server/scripts/migrate.js` so it can use `pg` and `bcrypt`
installed under `server/`.

```bash
cd server
npm run migrate

```bash
cd server
npm run migrate
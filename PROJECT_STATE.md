# PROJECT_STATE

_Last updated: Milestone 0_

## Project
Luxent Hotel – Holiday Buffet 2026 Early Booking Form
Reservation form + Express API + PostgreSQL. JWT-protected admin dashboard (read-only + CSV export).

## Stack (locked)
- Frontend: Vite + React (JS) + Tailwind CSS v4 (`@tailwindcss/vite`)
- Backend: Node.js + Express (ESM)
- DB: PostgreSQL via `pg`, plain SQL migrations
- Auth: JWT + bcrypt
- Deploy: Vercel (client), Render (server + Postgres, free tier)

## Conventions
- API errors: `{ success: false, message }` — success: `{ success: true, data }`
- Env values via `.env`, names only in `.env.example`
- Files: PascalCase.jsx components, camelCase others, snake_case DB

## Decisions
- Buffet dates (v1 seed): 2026-12-24, 2026-12-25, 2026-12-30, 2026-12-31
- Pricing constants: adult ₱1999, kid ₱999 (backend authoritative)
- Admin: single seeded user, no refresh token in v1
- Admin scope: read-only table + CSV export (no status/edit/delete)
- No capacity or per-email limits
- Phone: PH mobile regex `^(\+63|0)9\d{9}$`
- Adults ≥ 1, kids ≥ 0, no max
- Success UX: inline confirmation replaces form
- Timestamps: `timestamptz` in DB, PH time (`Asia/Manila`) in admin UI
- Deps approved: `react-router-dom` (M5), plain Render build (no Docker)

## Milestones
- [x] 0 Bootstrap (this milestone)
- [ ] 1 DB migrations
- [ ] 2 Reservation create API
- [ ] 3 Auth + admin API (list, CSV)
- [ ] 4 Frontend reservation form
- [ ] 5 Frontend admin UI
- [ ] 6 Deploy

## Next step
Milestone 1 — schema and seed migrations.
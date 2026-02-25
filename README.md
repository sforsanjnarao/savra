# Savra — Teacher Insights Dashboard

A full-stack analytics dashboard for school administrators to monitor teacher activity across lessons, quizzes, and assessments.

**Live Demo:** _[to be added after deployment]_

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Recharts, Tailwind CSS 4 |
| Backend | Express 5, Node.js (ESM) |
| Database | PostgreSQL + Prisma ORM |
| AI | OpenAI GPT-4o-mini (optional, graceful fallback) |
| Auth | JWT + bcrypt |
| Monorepo | Turborepo + pnpm workspaces |

---

## Architecture Decisions

### 1. Monorepo with Turborepo

The project is structured as a Turborepo monorepo with three packages:

```
savra/
├── apps/
│   ├── web/          # Next.js frontend
│   └── server/       # Express REST API
└── packages/
    └── db/           # Prisma schema, client, seed
```

This keeps the **Prisma client shared** between the server and any future consumers, and allows parallel builds via Turborepo.

### 2. Data Modeling & Duplicate Handling

The Prisma schema uses three models: `User`, `Teacher`, and `Activity`.

```
Activity @@unique([teacherId, activityType, subject, class, createdAt])
```

A **compound unique constraint** ensures the same activity record is never inserted twice — the system handles duplicate entries gracefully by rejecting them at the database level. The seed script also uses `upsert` to remain idempotent.

### 3. API Design

All endpoints are REST-based and grouped by concern:

| Route | Description |
|-------|-------------|
| `POST /api/auth/signin` | Admin login (JWT) |
| `GET /api/insites/overview` | Aggregate totals + breakdown by type |
| `GET /api/insites/weekly` | Weekly activity trends (per week, per type) |
| `GET /api/insites/ai-summary` | AI-generated insight summary |
| `GET /api/teachers` | All teachers with activity counts |
| `GET /api/teachers/:id` | Per-teacher detail with subjects, classes, recent activity |

All insights endpoints require `protect` + `onlyAdmin` middleware.

### 4. AI Insight Engine

The `/api/insites/ai-summary` endpoint:
- Aggregates teacher activity data from the database
- Sends it to **OpenAI GPT-4o-mini** with a principal-oriented prompt
- Returns a concise 2-3 sentence insight paragraph
- **Falls back gracefully** to a structured plain-text summary if `OPENAI_API_KEY` is not set

### 5. Frontend Architecture

- **Client-side rendering** with `"use client"` for all dashboard pages (enables `localStorage` token access)
- **Recharts `LineChart`** for weekly trends — color-coded lines for Lesson / Quiz / Assessment
- **Sidebar navigation** with Dashboard and Teachers views
- **Per-teacher drill-down**: metrics, subject/grade tags, weekly chart, recent activity timeline

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- pnpm ≥ 9
- PostgreSQL (local or cloud)

### Setup

```bash
# 1. Clone and install
git clone <repo-url> && cd savra
pnpm install

# 2. Configure environment
cp apps/server/.env.example apps/server/.env
# Edit .env with your DATABASE_URL and optionally OPENAI_API_KEY

# 3. Database setup
cd packages/db
pnpm exec prisma migrate dev
pnpm exec prisma generate
pnpm run db:seed

# 4. Start development
cd ../..
# Terminal 1 — Server
cd apps/server && pnpm run dev

# Terminal 2 — Frontend
cd apps/web && pnpm run dev
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Secret for JWT signing |
| `OPENAI_API_KEY` | ❌ | For AI summaries (falls back to plain text) |
| `PORT` | ❌ | Server port (default: 4000) |
| `CLIENT_ORIGIN` | ❌ | CORS origin (default: http://localhost:3000) |

### Default Login

```
Email:    admin@savra.com
Password: admin123
```

---

## Features

- ✅ **Admin authentication** with JWT + bcrypt
- ✅ **Dashboard overview** — total activities, lessons, quizzes, assessments
- ✅ **Weekly activity trends** — Recharts line chart with per-type breakdown
- ✅ **Teacher list** — table with per-teacher metrics and drill-down links
- ✅ **Per-teacher analysis** — subjects, grades, weekly pattern, recent activity
- ✅ **AI-generated insights** — GPT-4o-mini summaries (optional, graceful fallback)
- ✅ **Duplicate entry handling** — compound unique constraint on Activity model

---

## Future Scalability Improvements

- **Caching**: Add Redis caching for frequently accessed endpoints (overview, weekly) to reduce database load
- **Pagination**: Implement cursor-based pagination for teacher lists and activity feeds as data grows
- **Background Jobs**: Move AI summary generation to a background queue (Bull/BullMQ) to avoid blocking API responses
- **Role-Based Views**: Extend from admin-only to per-teacher login views showing their own activity
- **Real-Time Updates**: Add WebSocket support for live dashboard updates when new activities are logged
- **Analytics Export**: CSV/PDF export of teacher reports for offline sharing

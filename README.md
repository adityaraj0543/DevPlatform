# Developer Collaboration Platform (MERN)

Full-stack collaboration platform: GitHub + Trello + Slack + Jira in one app.

**Stack:** React 19 + Vite + TS + Tailwind + Redux Toolkit + React Query + Socket.IO • Node/Express + MongoDB/Mongoose + Redis + Cloudinary + JWT + Swagger + Docker.

## Structure
```
developer-platform/
├── client/                 # React 19 + Vite + TS frontend
├── server/                 # Express + MongoDB backend
├── docker/                 # nginx conf, mongo init
├── docs/                   # architecture, API, deployment guides
├── .github/workflows/      # CI/CD (lint, test, build, docker)
├── docker-compose.yml
└── README.md
```

## Quick start (local)
```bash
# 1. Backend
cd server
cp .env.example .env       # fill in values
npm install
npm run dev                # http://localhost:5000  (Swagger: /api/docs)

# 2. Frontend
cd ../client
cp .env.example .env
npm install
npm run dev                # http://localhost:5173

# 3. Or: everything at once with Docker
docker compose up --build
```

## Environment variables

### server/.env
| Key | Description |
|---|---|
| `PORT` | Backend port (default `5000`) |
| `NODE_ENV` | `development` / `production` |
| `MONGO_URI` | MongoDB connection string |
| `REDIS_URL` | `redis://localhost:6379` |
| `JWT_ACCESS_SECRET` | Random 64+ char secret |
| `JWT_REFRESH_SECRET` | Random 64+ char secret |
| `JWT_ACCESS_EXPIRES` | `15m` |
| `JWT_REFRESH_EXPIRES` | `7d` |
| `CLIENT_URL` | `http://localhost:5173` (CORS + email links) |
| `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET` | File uploads |
| `SMTP_HOST` / `_PORT` / `_USER` / `_PASS` / `_FROM` | Email |
| `GOOGLE_CLIENT_ID` / `_SECRET` | Google OAuth |

### client/.env
| Key | Description |
|---|---|
| `VITE_API_URL` | `http://localhost:5000/api` |
| `VITE_SOCKET_URL` | `http://localhost:5000` |

## Modules
Auth (JWT + refresh + Google + email verify + reset) • Projects & Teams • Repositories (branches, commits, PRs, file browser) • Issues (labels, milestones, priorities, comments, attachments) • Kanban (drag-drop, sprints, filters) • Activity feed (live) • Slack-like chat (channels, DMs, typing, presence, reactions, mentions, file share) • Notifications (realtime + email) • Global search • Admin & developer dashboards (Recharts analytics) • Profile & settings with dark mode.

## Docs
See `docs/` for: `architecture.md`, `api.md`, `deployment.md`, `testing.md`, `structure.md`.

## License
MIT

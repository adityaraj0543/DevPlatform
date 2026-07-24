# Architecture

```
┌──────────────┐     HTTPS      ┌────────────────┐
│  React SPA   │◀──────────────▶│  Express API   │
│ (Vite/Nginx) │  WebSocket     │ (Node 20)      │
└──────┬───────┘◀──────────────▶└─┬────────┬─────┘
       │                          │        │
       │ Socket.IO                │        │
       ▼                          ▼        ▼
   Redux+RQ                    MongoDB   Redis
                                  │
                                  ▼
                              Cloudinary (uploads)
                              SMTP (email)
```

**Auth:** short-lived JWT access (15m) + rotating refresh (7d, httpOnly cookie). Google OAuth via `google-auth-library`.

**Realtime:** Socket.IO with JWT handshake. Rooms per chat channel (`channel:<id>`). Events: `chat`, `typing`, `kanban`, `issue`, `comment`, `notification`, `online`/`offline`, `activity`.

**Security:** Helmet, CORS allowlist, rate limits (global + `/auth`), `express-mongo-sanitize`, `xss-clean`, `hpp`, bcrypt (12 rounds), express-validator on every route, role middleware (`admin | developer | project_owner`), file MIME allowlist + 20MB cap.

**Data model:** users, projects (with members + labels + milestones + sprints), repositories, branches, commits, pullRequests, issues (kanban status/order), comments (mentions), channels, messages (reactions, attachments), notifications, activities, teams, files.

# API Reference

Interactive Swagger UI at `http://localhost:5000/api/docs`.

Auth: send `Authorization: Bearer <access>` header. Refresh via `POST /api/auth/refresh` (uses http-only cookie).

## Endpoints (grouped)

### Auth (`/api/auth`)
- `POST /signup` — register (name, username, email, password)
- `POST /login` — email + password
- `POST /google` — Google ID token (`credential`)
- `POST /refresh` — rotates refresh token
- `POST /logout`
- `GET  /me`
- `POST /verify-email`, `/forgot-password`, `/reset-password`

### Users (`/api/users`)
List / get / update-self / avatar upload / admin delete.

### Projects (`/api/projects`)
CRUD + `POST /:id/members`, `DELETE /:id/members/:userId`.

### Repositories (`/api/repositories`)
CRUD + branches, commits, pull requests (`/pulls/:id/merge|close`).

### Issues (`/api/issues`)
CRUD + `POST /:id/kanban` (status change) + `POST /:id/attachments`.

### Comments (`/api/comments/:kind/:id`)
List / create / delete. Kinds: `issue`, `pull_request`, `commit`.

### Chat (`/api/chat`)
Channels list/create, `POST /dm/:userId`, messages list/send, reactions.

### Notifications, Activity, Search, Admin, Uploads
Standard REST — see Swagger.

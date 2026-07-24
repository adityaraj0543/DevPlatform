# Folder Structure

```
developer-platform/
├── client/                    # React 19 + Vite + TS
│   ├── src/
│   │   ├── api/               # Axios instance + resource clients
│   │   ├── components/
│   │   │   └── layout/        # Sidebar, Navbar, AuthLayout, RequireAuth
│   │   ├── features/auth/     # Redux auth slice
│   │   ├── hooks/
│   │   ├── lib/               # cn, theme, date-format helpers
│   │   ├── pages/             # All routed pages
│   │   ├── sockets/           # Socket.IO singleton
│   │   ├── store/             # Redux store + UI slice
│   │   └── styles/            # Tailwind entry CSS
│   ├── docker/nginx.conf
│   ├── Dockerfile
│   └── vite.config.ts
├── server/                    # Node + Express + MongoDB
│   ├── src/
│   │   ├── config/            # db, redis, cloudinary, swagger
│   │   ├── controllers/       # auth, user, project, repo, issue, ...
│   │   ├── middlewares/       # auth, role, error, rateLimit, upload, validate
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # Express routers
│   │   ├── sockets/           # Socket.IO server
│   │   ├── utils/             # jwt, email, logger, apiFeatures, seed
│   │   ├── app.js
│   │   └── index.js
│   ├── Dockerfile
│   └── .env.example
├── docs/
├── .github/workflows/ci.yml
└── docker-compose.yml
```

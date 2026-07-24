# Deployment

## Docker (local / VPS)
```bash
cp server/.env.example server/.env   # fill secrets
docker compose up --build -d
# client → http://localhost:8080   API → http://localhost:5000/api
```

## Render / Railway / Fly
- **Server**: Node service from `/server` (build `npm install`, start `npm start`). Env: all of `server/.env.example`.
- **Client**: static site from `/client` (build `npm run build`, publish `dist`). Env: `VITE_API_URL`, `VITE_SOCKET_URL`.
- **DB**: MongoDB Atlas — put connection string into `MONGO_URI`.
- **Redis**: Upstash / Render Redis.
- **Uploads**: Cloudinary account — set the 3 `CLOUDINARY_*` vars.

## nginx (reverse proxy in front of everything)
```
location /api/  { proxy_pass http://server:5000; proxy_set_header Host $host; }
location /socket.io/ { proxy_pass http://server:5000; proxy_http_version 1.1; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade"; }
location /      { proxy_pass http://client:80;   }
```

## GitHub Actions
`.github/workflows/ci.yml` runs lint, build, and `docker compose build` on every push/PR.

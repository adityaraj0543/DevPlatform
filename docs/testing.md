# Testing Guide

## Backend
`npm install --save-dev jest supertest` in `/server`, then:
```js
// server/tests/auth.test.js
const request = require('supertest');
const app = require('../src/app');
test('signup validates email', async () => {
  const r = await request(app).post('/api/auth/signup').send({});
  expect(r.status).toBe(400);
});
```

## Frontend
`npm install --save-dev vitest @testing-library/react jsdom`, then in `vite.config.ts` add `test: { environment: 'jsdom' }` and run `vitest`.

## Manual smoke
1. `cd server && npm run seed` — creates `admin@devplatform.io / admin1234`.
2. `cd server && npm run dev`; `cd client && npm run dev`.
3. Log in, create a project, open Kanban in two tabs — drag issues, watch realtime sync.
4. Open Chat, send messages between two accounts.
5. Visit `/admin` as admin to see analytics.

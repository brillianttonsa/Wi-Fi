# Wi-Fi API

1. Copy `.env.example` to `.env` and set `DATABASE_URL` and a strong `JWT_SECRET`.
2. Run `npm install`.
3. Run `npm run db:generate`, then `npm run db:migrate`.
4. Run `npm run dev`.

The Vite frontend already proxies `/api` requests to `http://localhost:3001`.

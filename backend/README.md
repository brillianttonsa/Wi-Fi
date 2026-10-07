# Wi-Fi API

1. Copy `.env.example` to `.env` and set `DATABASE_URL` and a strong `JWT_SECRET`.
2. Run `npm install`.
3. Run `npm run db:generate`, then `npm run db:migrate`.
4. Run `npm run dev`.

The Vite frontend already proxies `/api` requests to `http://localhost:3001`.

## Payments

`PAYMENT_GATEWAY=sandbox` confirms a checkout after a few seconds so you can test the token flow locally.

For live Tanzania mobile money, set `PAYMENT_GATEWAY=azampay` and the AzamPay credentials from the developer portal. Register this callback URL in AzamPay:

`https://your-api-host/api/payments/webhook/azampay`

If `PAYMENT_WEBHOOK_TOKEN` is set, AzamPay must call `...?token=YOUR_TOKEN` or send `x-webhook-token`. After payment is confirmed, the API issues a Wi-Fi token. The customer enters that token in the dashboard to start their session.

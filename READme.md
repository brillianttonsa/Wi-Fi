# Linka Wi‑Fi Access Platform

Linka is a full-stack Wi‑Fi package and access-management solution for customers who need simple, mobile-money-based internet access. It gives customers one place to choose a package, pay from a Tanzania mobile money account, receive a Wi‑Fi token after payment confirmation, and activate their internet session.

## The problem it solves

Managing prepaid Wi‑Fi manually creates delays and confusion: customers may not know which package is active, payments are difficult to confirm, and access often needs staff intervention. Linka turns that process into a self-service flow while keeping package and connection state visible to the customer.

## Customer journey

1. A customer creates an account or signs in.
2. They choose a Daily, 3 Days, Weekly, or Monthly Wi‑Fi package.
3. They enter their mobile money number and approve the payment prompt.
4. The payment gateway confirms payment and Linka issues a unique Wi‑Fi token.
5. The customer enters the token in the dashboard to activate Wi‑Fi.
6. The dashboard shows the active plan, expiry time, token, and payment history.

Only one active Wi‑Fi package is allowed per customer. While a connection is active, package purchase controls are disabled in the dashboard and the API rejects direct payment attempts. A new package can be purchased once the current package expires.

## Main capabilities

- Responsive public website with account registration and login.
- Authenticated customer dashboard at `/`, with `/packages` and `/profile` routes.
- Mobile-money checkout support with sandbox mode and AzamPay integration points.
- Payment confirmation webhook handling and unique Wi‑Fi token issuance.
- Token-based Wi‑Fi activation with package expiry tracking.
- Package payment history and active-connection status.
- Persistent light and black themes.
- Secure HttpOnly-cookie authentication and profile/password management.

## Architecture

```text
frontend/   React + TypeScript + Vite customer application
backend/    Express + TypeScript + PostgreSQL API
```

The frontend talks directly to the API through service modules. Its API origin is set through `frontend/.env` using `VITE_API_BASE_URL`; Vite does not contain API proxy or server configuration.

## Run locally

1. Configure `backend/.env` from `backend/.env.example` and set the database URL, JWT secret, and client origin.
2. Configure `frontend/.env` from `frontend/.env.example` with the API origin, for example `VITE_API_BASE_URL=http://localhost:3002`.
3. In `backend`, run `npm install`, `npm run db:migrate`, then `npm run dev`.
4. In `frontend`, run `npm install`, then `npm run dev`.

See [frontend/README.md](frontend/README.md) for frontend details and [backend/README.md](backend/README.md) for API, payment gateway, and webhook configuration.

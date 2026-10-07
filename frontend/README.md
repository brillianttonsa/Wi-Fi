# Wi-Fi Frontend

The wi-Fi customer web app, built with React, TypeScript, Vite, and Tailwind CSS. Visitors can explore Wi-Fi packages and sign in or register; authenticated users can manage their account, view package options, and access payment and Wi-Fi status features.

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- The Linka backend running locally for authentication and API-backed dashboard features

## Getting started

From the `frontend` directory:

```bash
npm install
npm run dev
```

Vite prints the local development URL when the server starts (usually `http://localhost:5173`).

The development server proxies requests beginning with `/api` to `http://localhost:3001`. Start the backend separately and configure its `CLIENT_ORIGIN` to match the frontend URL. See the backend [README](../backend/README.md) for database and API setup.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Run the TypeScript project build and create a production bundle in `dist/` |
| `npm run lint` | Run ESLint |
| `npm run preview` | Serve the production bundle locally for preview |

## Routes

The app uses React Router and presents routes based on the current authentication session:

| Path | Page | Access |
| --- | --- | --- |
| `/` | Public website when signed out; dashboard home when signed in | Public or authenticated |
| `/packages` | Package selection and payment history | Authenticated |
| `/profile` | Profile and password settings | Authenticated |

Signed-out visitors who open a dashboard path are redirected to `/`. After authentication, unknown paths also redirect to `/`.

## Features

- Public website with package information, login and registration dialogs, and contact details.
- Cookie-based authentication with session restoration, login, registration, and logout.
- Dashboard navigation for Home, Packages, and Profile.
- Profile and password update forms.
- Package-selection dialog, payment history with seven entries per page, payment status, and Wi-Fi token/status display.
- Responsive layouts and Tailwind CSS styling.

Payment creation, history, and Wi-Fi features call the corresponding `/api/payments` endpoints. They require the matching payment routes to be implemented and available in the backend.

## Project layout

```text
src/
  component/
    dashboard/     Dashboard pages and reusable dashboard components
    website/       Public site, authentication dialogs, and footer
  context/         Authentication provider and context
  dashboard/       Authenticated dashboard shell
  hooks/           Shared React hooks
  services/        API request, auth, profile, and payment clients
  website/         Public website composition
  App.tsx          Authentication-aware route table
  index.css        Tailwind CSS entry point and global styles
  main.tsx         React application entry point
```

## API and authentication

The shared API client sends browser requests with credentials so the backend's HttpOnly session cookie is included. In local development, Vite forwards `/api` traffic to port `3001`; the frontend does not store the session token itself.

Authentication endpoints used by the frontend:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `PATCH /api/profile`

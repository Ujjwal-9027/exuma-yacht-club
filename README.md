# Exuma Yacht Club

Next.js App Router site for the Exuma Yacht Club resort, marina, shop, and admin tools. The application uses TypeScript, MongoDB, and server-rendered pages with client components for interactive flows.

## Requirements

- Node.js 20.9 or newer
- npm
- A MongoDB database for catalog, orders, inquiries, site settings, and rate limits

## Local Setup

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Set the values in `.env.local` before using database-backed routes. Keep this file private; it is ignored by Git. The admin login requires `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`. `MONGODB_DB` is optional and defaults to `exuma_yacht_club`.

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string. |
| `MONGODB_DB` | Database name; defaults to `exuma_yacht_club`. |
| `ADMIN_PASSWORD` | Initial/fallback admin password. Use a long random value. |
| `ADMIN_SESSION_SECRET` | Secret used to sign the admin session cookie. |
| `EMAIL_PROVIDER` | `smtp` or `resend`; Resend is selected when unset. |
| `EMAIL_FROM` | Verified sender address for email delivery. |
| `RESEND_API_KEY` | Resend API key when using Resend. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD` | SMTP connection settings when using SMTP. |
| Admin Settings notification recipients | Inquiry and order recipients are configured in the database-backed admin settings. |
| `PAYMENT_PROVIDER` | Currently only `manual` is implemented; defaults to `manual`. |
| `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_ENVIRONMENT` | PayPal configuration helpers; a verified PayPal checkout/capture flow is not currently connected to order placement. |

Never commit real credentials. `.env.example` contains placeholders only.

## Commands

```powershell
npm run dev
npm test
npm run lint
npm run typecheck
npm run build
npm start
```

`npm test` runs the Vitest regression suite for order authorization, payment guards, inventory, and database initialization.

## Project Layout

- `src/app/` contains public pages, admin pages, route handlers, and framework metadata routes.
- `src/components/` contains shared UI and interactive client components.
- `src/db/` contains MongoDB connection/repository operations and persisted document types.
- `src/lib/` contains business rules and integrations such as email, payments, shipping, receipts, and authentication.
- `src/data/`, `src/content/`, and `src/config/` contain static content and site configuration.
- `public/` contains static assets and uploaded product images.

## Production Notes

- Demo payments are accepted only outside production. The current payment adapter records manual orders as unpaid; integrate and verify a real payment provider before accepting online payments.
- Customer order pages and receipt delivery require an order-specific HttpOnly credential or an authenticated admin session. Customers who lose their checkout cookie can verify with a one-time code sent to the original order email.
- Admin product image uploads write to `public/uploads/products` on the application filesystem. No deployment manifest is present in this repository. For Vercel/serverless deployments, move uploads to durable object storage; function-local files are not persistent or shared across instances.
- Configure all required environment variables in the deployment platform, run `npm run build`, and deploy with a Node.js-compatible Next.js host. Do not deploy `.env.local`.
# Reline — Talktiyu reseller storefront

A Next.js site that resells virtual phone numbers for SMS verification,
backed by the Talktiyu Reseller API, with wallet top-ups via Flutterwave.

## What's included

- **Auth** — email/password signup & login, JWT session in an httpOnly cookie
  (`src/lib/session.ts`). No third-party auth provider needed.
- **Wallet** — users top up in Naira via Flutterwave; balance lives in your
  own database, credited only after webhook-verified payment
  (`src/app/api/wallet/*`).
- **Talktiyu integration** — server-only client (`src/lib/talktiyu.ts`).
  Your `TALKTIYU_API_KEY` never reaches the browser: the frontend only talks
  to your own `/api/talktiyu/*` and `/api/orders/*` routes, which proxy to
  Talktiyu and apply your markup.
- **Pricing** — `MARKUP_PERCENT` in `.env` sets how much you add on top of
  Talktiyu's base price. Change it any time without a redeploy of pricing
  logic elsewhere — it's applied in one place (`src/lib/pricing.ts`).
- **Order lifecycle** — buy → poll for SMS → auto-refund after 20 minutes
  with no code, or manual cancel after the 2-minute minimum hold, matching
  Talktiyu's documented rules.

## Setup

```bash
npm install
cp .env.example .env   # then fill in the real values below
npm run db:push        # creates prisma/dev.db (SQLite) with the schema
npm run dev
```

Open http://localhost:3000.

### Environment variables (`.env`)

| Variable | Where to get it |
|---|---|
| `JWT_SECRET` | Generate: `openssl rand -base64 32` |
| `TALKTIYU_API_KEY` | Talktiyu dashboard → Reseller → API key |
| `MARKUP_PERCENT` | Your choice, e.g. `30` for a 30% markup |
| `FLW_PUBLIC_KEY` / `FLW_SECRET_KEY` | Flutterwave dashboard → Settings → API keys |
| `FLW_SECRET_HASH` | A random string **you** choose — set the same value in Flutterwave dashboard → Settings → Webhooks → Secret Hash |
| `APP_URL` | `http://localhost:3000` locally, your real domain in production |

### Wiring up the Flutterwave webhook

Flutterwave needs to reach your webhook to actually credit wallets — the
redirect back to your site alone is not proof of payment. In the
Flutterwave dashboard, set the webhook URL to:

```
https://<your-domain>/api/wallet/webhook
```

Locally, use a tunnel (e.g. `ngrok http 3000`) and point the dashboard at
the tunnel URL while testing.

## Production notes

- **Database**: SQLite is fine for local dev; switch `provider` in
  `prisma/schema.prisma` to `postgresql` and point `DATABASE_URL` at a real
  Postgres instance before you take real money.
- **Stock races**: Talktiyu shares number stock across all its resellers —
  a purchase can still fail with "no numbers available" even if `/services`
  showed stock a second earlier. The buy flow already surfaces that error
  to the user without charging their wallet.
- **Rate limits**: Talktiyu's FAQ mentions a minimum 6%-successful-activation
  requirement per 100 buys, and blocks on rapid buy/cancel cycles — build
  your own throttling on top if you expect heavy traffic, so one user
  doesn't jeopardize your whole reseller account.
- **Payment provider risk**: virtual-number/OTP resale is sometimes flagged
  as high-risk by payment processors. Check Flutterwave's acceptable-use
  policy for your account tier before going live.

## Project layout

```
src/
  app/
    page.tsx                 marketing landing page
    login/, signup/           auth pages
    dashboard/                 authenticated app (wallet, buy, orders)
    api/
      auth/                    signup, login, logout
      wallet/                  topup, webhook, status
      talktiyu/                servers, countries, services (proxied + priced)
      orders/                  create/list, [id]/status, [id]/cancel
  lib/
    talktiyu.ts                Talktiyu API client (server-only)
    flutterwave.ts              Flutterwave payment client
    pricing.ts                  markup calculation
    session.ts                  JWT session cookie helpers
    prisma.ts                   Prisma client singleton
  components/                   UI
prisma/schema.prisma            User, Transaction, Order models
```

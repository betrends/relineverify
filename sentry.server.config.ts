import * as Sentry from "@sentry/nextjs";

// Sentry.init() is a safe no-op when dsn is unset, so this stays inert
// until NEXT_PUBLIC_SENTRY_DSN is configured in the environment.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
});

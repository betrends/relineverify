// Shared by the client-side countdown and the server-side regenerate check
// so both agree on exactly when a displayed code counts as stale.
export const CODE_EXPIRY_MS = 10 * 60 * 1000;

// Email codes get longer than SMS codes — checking a temp inbox and typing
// a code into some other site's form is a slower round-trip than an SMS
// landing straight on your phone.
export const EMAIL_CODE_EXPIRY_MS = 30 * 60 * 1000;

// How long a generated email waits for a code to arrive before it's closed
// out as expired (no refund — see the status/cancel routes).
export const EMAIL_WAIT_EXPIRY_MS = 60 * 60 * 1000;

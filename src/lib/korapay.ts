/**
 * Minimal Korapay client — used only for initializing wallet top-up
 * payments and verifying them (from the webhook or the redirect
 * callback). See https://developers.korapay.com/docs/checkout-redirect
 */

const KORAPAY_BASE = "https://api.korapay.com/merchant/api/v1";

export async function initializePayment(params: {
  reference: string;
  amountNgn: number;
  email: string;
  redirectUrl: string;
}) {
  const secretKey = process.env.KORAPAY_SECRET_KEY;
  if (!secretKey) throw new Error("KORAPAY_SECRET_KEY is not set");

  const appUrl = process.env.APP_URL;

  const res = await fetch(`${KORAPAY_BASE}/charges/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reference: params.reference,
      amount: params.amountNgn,
      currency: "NGN",
      redirect_url: params.redirectUrl,
      notification_url: appUrl ? `${appUrl}/api/wallet/webhook` : undefined,
      customer: { email: params.email },
      narration: "Wallet top-up",
    }),
  });

  const json = await res.json();
  if (!json.status) {
    throw new Error(json.message || "Failed to initialize payment");
  }
  return json.data.checkout_url as string;
}

export async function verifyTransaction(reference: string) {
  const secretKey = process.env.KORAPAY_SECRET_KEY;
  if (!secretKey) throw new Error("KORAPAY_SECRET_KEY is not set");

  const res = await fetch(`${KORAPAY_BASE}/charges/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
    cache: "no-store",
  });
  const json = await res.json();
  return json;
}

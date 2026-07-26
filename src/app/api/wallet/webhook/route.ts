import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { verifyTransaction } from "@/lib/korapay";

/**
 * Korapay calls this endpoint after a payment event. The signature is an
 * HMAC-SHA256 of the JSON-stringified `data` object, signed with our
 * secret key. We also re-verify the transaction server-side via the
 * charges API (never trust the webhook body's amount/status directly)
 * before crediting anyone's wallet.
 *
 * Configure this URL in the Korapay dashboard as:
 *   https://<your-domain>/api/wallet/webhook
 * See https://developers.korapay.com/docs/webhooks
 */
export async function POST(req: NextRequest) {
  const secretKey = process.env.KORAPAY_SECRET_KEY;
  const signature = req.headers.get("x-korapay-signature");

  const rawBody = await req.text();
  const event = safeParse(rawBody);

  if (!secretKey || !signature || !event?.data) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const expected = crypto
    .createHmac("sha256", secretKey)
    .update(JSON.stringify(event.data))
    .digest("hex");

  const signatureValid =
    signature.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));

  if (!signatureValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const reference: string | undefined = event.data.reference;
  if (!reference) {
    return NextResponse.json({ error: "Malformed payload" }, { status: 400 });
  }

  const transaction = await prisma.transaction.findUnique({
    where: { reference },
  });
  if (!transaction) {
    return NextResponse.json({ error: "Unknown transaction" }, { status: 404 });
  }
  if (transaction.status !== "pending") {
    // Already processed — ack without double-crediting.
    return NextResponse.json({ ok: true });
  }

  const verified = await verifyTransaction(reference);
  const isGood =
    verified?.status === true &&
    verified?.data?.status === "success" &&
    verified?.data?.currency === "NGN" &&
    Number(verified?.data?.amount) >= transaction.amount &&
    verified?.data?.reference === reference;

  if (!isGood) {
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: "failed" },
    });
    return NextResponse.json({ ok: true });
  }

  await prisma.$transaction([
    prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: "successful" },
    }),
    prisma.user.update({
      where: { id: transaction.userId },
      data: { walletBalance: { increment: transaction.amount } },
    }),
  ]);

  return NextResponse.json({ ok: true });
}

function safeParse(raw: string) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

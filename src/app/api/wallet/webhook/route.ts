import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { verifyTransaction } from "@/lib/korapay";
import { calculateReferralReward } from "@/lib/referral";

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
    include: { user: { select: { referredById: true } } },
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

  await prisma.$transaction(async (tx) => {
    // Korapay's own docs warn webhook deliveries can be retried/duplicated —
    // guard the transition so only the delivery that actually flips this
    // transaction away from "pending" gets to credit anyone's wallet.
    // Otherwise two concurrent deliveries could both pass the earlier
    // `status !== "pending"` check and double-credit the same top-up.
    const claimed = await tx.transaction.updateMany({
      where: { id: transaction.id, status: "pending" },
      data: { status: "successful" },
    });
    if (claimed.count === 0) return;

    await tx.user.update({
      where: { id: transaction.userId },
      data: { walletBalance: { increment: transaction.amount } },
    });

    // Referral program: 5% of every top-up a referred user makes goes to
    // whoever referred them, for as long as the referral relationship exists.
    const referrerId = transaction.type === "topup" ? transaction.user.referredById : null;
    if (referrerId) {
      const rewardAmount = calculateReferralReward(transaction.amount);
      if (rewardAmount > 0) {
        await tx.user.update({
          where: { id: referrerId },
          data: { walletBalance: { increment: rewardAmount } },
        });
        await tx.transaction.create({
          data: {
            userId: referrerId,
            type: "referral",
            amount: rewardAmount,
            reference: `referral_${reference}`,
            status: "successful",
          },
        });
        await tx.referralEarning.create({
          data: {
            referrerId,
            referredUserId: transaction.userId,
            topupAmount: transaction.amount,
            rewardAmount,
            topupReference: reference,
          },
        });
      }
    }
  });

  return NextResponse.json({ ok: true });
}

function safeParse(raw: string) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

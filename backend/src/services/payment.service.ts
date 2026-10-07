import { and, desc, eq, gt, isNotNull, isNull } from "drizzle-orm";
import { env } from "../config/env.js";
import { db } from "../db/client.js";
import { payments } from "../db/schema/index.js";
import { HttpError } from "../lib/http-error.js";
import { normalizeTzPhone, parseProvider } from "../lib/phone.js";
import { initiateCheckout } from "./payments/gateway.js";
import { parseAzamPayWebhook } from "./payments/azampay.js";

const plans = new Map([
  ["Daily", { amount: 5000, durationMs: 24 * 60 * 60 * 1000 }],
  ["3 Days", { amount: 12000, durationMs: 3 * 24 * 60 * 60 * 1000 }],
  ["Weekly", { amount: 25000, durationMs: 7 * 24 * 60 * 60 * 1000 }],
  ["Monthly", { amount: 70000, durationMs: 30 * 24 * 60 * 60 * 1000 }],
]);

const sandboxConfirmAfterMs = 8_000;

function createReference() {
  return `LK-${crypto.randomUUID().replaceAll("-", "").slice(0, 10).toUpperCase()}`;
}

function createWifiToken() {
  return `WIFI-${crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

export async function submitPayment(userId: number, planName: string, paymentPhone: string, providerName?: string) {
  const plan = plans.get(planName);
  if (!plan) throw new HttpError(400, "The selected package is not available.");

  let phone: string;
  try {
    phone = normalizeTzPhone(paymentPhone);
  } catch (error) {
    throw new HttpError(400, error instanceof Error ? error.message : "Enter a valid payment phone number.");
  }

  const provider = parseProvider(providerName, phone);
  const reference = createReference();
  const [payment] = await db.insert(payments).values({
    userId,
    planName,
    amount: plan.amount,
    paymentPhone: phone,
    provider,
    reference,
  }).returning();

  try {
    const checkout = await initiateCheckout({ reference, amount: plan.amount, phone, provider });
    if (checkout.providerReference) {
      await db.update(payments)
        .set({ providerTransactionId: checkout.providerReference, updatedAt: new Date() })
        .where(eq(payments.id, payment.id));
    }
    return { payment, checkout };
  } catch (error) {
    await db.update(payments)
      .set({ status: "rejected", updatedAt: new Date() })
      .where(eq(payments.id, payment.id));
    throw error;
  }
}

async function issueToken(paymentId: number, providerTransactionId?: string) {
  const wifiToken = createWifiToken();
  const [updated] = await db.update(payments)
    .set({
      status: "approved",
      wifiToken,
      tokenIssuedAt: new Date(),
      ...(providerTransactionId ? { providerTransactionId } : {}),
      updatedAt: new Date(),
    })
    .where(and(eq(payments.id, paymentId), eq(payments.status, "pending")))
    .returning();
  return updated;
}

async function maybeConfirmSandboxPayment(payment: typeof payments.$inferSelect) {
  if (env.PAYMENT_GATEWAY !== "sandbox" || payment.status !== "pending") return payment;
  if (Date.now() - payment.createdAt.getTime() < sandboxConfirmAfterMs) return payment;
  return (await issueToken(payment.id)) ?? payment;
}

export async function listPayments(userId: number) {
  const rows = await db.select().from(payments).where(eq(payments.userId, userId)).orderBy(desc(payments.createdAt));
  return Promise.all(rows.map((row) => maybeConfirmSandboxPayment(row)));
}

export async function getPayment(userId: number, reference: string) {
  const [payment] = await db.select().from(payments).where(and(eq(payments.userId, userId), eq(payments.reference, reference))).limit(1);
  if (!payment) throw new HttpError(404, "Payment was not found.");
  return maybeConfirmSandboxPayment(payment);
}

export async function handleGatewayWebhook(body: Record<string, unknown>) {
  const result = parseAzamPayWebhook(body);
  if (!result.reference) throw new HttpError(400, "The webhook payload is missing a payment reference.");

  const [byReference] = await db.select().from(payments).where(eq(payments.reference, result.reference)).limit(1);
  const [byProvider] = result.providerTransactionId
    ? await db.select().from(payments).where(eq(payments.providerTransactionId, result.providerTransactionId)).limit(1)
    : [];
  const match = byReference ?? byProvider;
  if (!match) throw new HttpError(404, "No payment matches this webhook.");
  if (match.status !== "pending") return match;

  if (!result.success) {
    const [rejected] = await db.update(payments)
      .set({ status: "rejected", providerTransactionId: result.providerTransactionId || match.providerTransactionId, updatedAt: new Date() })
      .where(eq(payments.id, match.id))
      .returning();
    return rejected;
  }

  return (await issueToken(match.id, result.providerTransactionId)) ?? match;
}

export async function getWifiStatus(userId: number) {
  const now = new Date();
  const [connection] = await db.select().from(payments).where(and(
    eq(payments.userId, userId),
    eq(payments.status, "approved"),
    isNotNull(payments.activatedAt),
    gt(payments.expiresAt, now),
  )).orderBy(desc(payments.activatedAt)).limit(1);

  const [pendingToken] = await db.select().from(payments).where(and(
    eq(payments.userId, userId),
    eq(payments.status, "approved"),
    isNotNull(payments.wifiToken),
    isNull(payments.activatedAt),
  )).orderBy(desc(payments.tokenIssuedAt)).limit(1);

  return { connection: connection ?? null, pendingToken: pendingToken ?? null };
}

export async function activateWifi(userId: number, token: string) {
  const wifiToken = token.trim().toUpperCase();
  if (!wifiToken) throw new HttpError(400, "Enter the Wi-Fi token from your payment.");

  const active = await getWifiStatus(userId);
  if (active.connection) {
    throw new HttpError(409, "You already have an active Wi-Fi session. Wait until it expires before activating another token.");
  }

  const [payment] = await db.select().from(payments).where(and(
    eq(payments.userId, userId),
    eq(payments.wifiToken, wifiToken),
    eq(payments.status, "approved"),
    isNull(payments.activatedAt),
  )).limit(1);

  if (!payment) throw new HttpError(400, "That token is invalid or has already been used.");

  const plan = plans.get(payment.planName);
  if (!plan) throw new HttpError(400, "The package for this token is no longer available.");

  const activatedAt = new Date();
  const [activated] = await db.update(payments)
    .set({
      activatedAt,
      expiresAt: new Date(activatedAt.getTime() + plan.durationMs),
      updatedAt: activatedAt,
    })
    .where(and(eq(payments.id, payment.id), isNull(payments.activatedAt)))
    .returning();

  if (!activated) throw new HttpError(409, "This token has already been activated.");
  return activated;
}

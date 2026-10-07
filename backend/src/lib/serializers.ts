import type { users, payments } from "../db/schema/index.js";

type User = typeof users.$inferSelect;
type Payment = typeof payments.$inferSelect;

export function serializeUser(user: User) {
  return {
    id: user.id,
    fullName: user.fullName,
    phone: user.phone,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export function serializePayment(payment: Payment) {
  return {
    id: payment.id,
    plan: payment.planName,
    amount: payment.amount,
    phone: payment.paymentPhone,
    provider: payment.provider,
    status: `${payment.status[0].toUpperCase()}${payment.status.slice(1)}`,
    reference: payment.reference,
    wifiToken: payment.status === "approved" ? payment.wifiToken : null,
    activatedAt: payment.activatedAt?.toISOString() ?? null,
    expiresAt: payment.expiresAt?.toISOString() ?? null,
    createdAt: payment.createdAt.toISOString(),
  };
}

export function serializeConnection(payment: Payment | null) {
  if (!payment?.activatedAt || !payment.expiresAt) return null;
  return {
    plan: payment.planName,
    token: payment.wifiToken,
    activatedAt: payment.activatedAt.toISOString(),
    expiresAt: payment.expiresAt.toISOString(),
  };
}

export function serializePendingToken(payment: Payment | null) {
  if (!payment?.wifiToken) return null;
  return {
    plan: payment.planName,
    token: payment.wifiToken,
    reference: payment.reference,
  };
}

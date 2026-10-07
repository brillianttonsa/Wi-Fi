import { env } from "../../config/env.js";
import { HttpError } from "../../lib/http-error.js";
import type { MobileProvider } from "../../lib/phone.js";
import { requestAzamPayCheckout } from "./azampay.js";

export type CheckoutRequest = {
  reference: string;
  amount: number;
  phone: string;
  provider: MobileProvider;
};

export type CheckoutResult = {
  message: string;
  providerReference?: string;
};

export async function initiateCheckout(request: CheckoutRequest): Promise<CheckoutResult> {
  if (env.PAYMENT_GATEWAY === "azampay") {
    return requestAzamPayCheckout(request);
  }

  return {
    message: "Approve the payment prompt on your phone. Access will unlock after the payment is confirmed.",
  };
}

export function assertWebhookAccess(token: string | undefined) {
  if (!env.PAYMENT_WEBHOOK_TOKEN) return;
  if (token !== env.PAYMENT_WEBHOOK_TOKEN) {
    throw new HttpError(401, "Invalid payment webhook token.");
  }
}

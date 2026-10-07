import { env } from "../../config/env.js";
import { HttpError } from "../../lib/http-error.js";
import type { CheckoutRequest, CheckoutResult } from "./gateway.js";

type TokenCache = { value: string; expiresAt: number };
let tokenCache: TokenCache | null = null;

const sandbox = env.AZAMPAY_SANDBOX;
const authUrl = sandbox
  ? "https://authenticator-sandbox.azampay.co.tz/AppRegistration/GenerateToken"
  : "https://authenticator.azampay.co.tz/AppRegistration/GenerateToken";
const checkoutUrl = sandbox
  ? "https://sandbox.azampay.co.tz/azampay/mno/checkout"
  : "https://checkout.azampay.co.tz/azampay/mno/checkout";

async function getAccessToken() {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 30_000) return tokenCache.value;

  const response = await fetch(authUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      appName: env.AZAMPAY_APP_NAME,
      clientId: env.AZAMPAY_CLIENT_ID,
      clientSecret: env.AZAMPAY_CLIENT_SECRET,
    }),
  });

  const payload = await response.json().catch(() => null) as {
    data?: { accessToken?: string; expire?: string };
    message?: string;
  } | null;

  const accessToken = payload?.data?.accessToken;
  if (!response.ok || !accessToken) {
    throw new HttpError(502, payload?.message ?? "Unable to authenticate with AzamPay.");
  }

  const expiresAt = payload?.data?.expire ? Date.parse(payload.data.expire) : Date.now() + 50 * 60 * 1000;
  tokenCache = { value: accessToken, expiresAt: Number.isNaN(expiresAt) ? Date.now() + 50 * 60 * 1000 : expiresAt };
  return accessToken;
}

export async function requestAzamPayCheckout(request: CheckoutRequest): Promise<CheckoutResult> {
  const accessToken = await getAccessToken();
  const response = await fetch(checkoutUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-API-Key": env.AZAMPAY_API_KEY ?? "",
    },
    body: JSON.stringify({
      accountNumber: request.phone,
      amount: String(request.amount),
      currency: "TZS",
      externalId: request.reference,
      provider: request.provider,
    }),
  });

  const payload = await response.json().catch(() => null) as {
    success?: boolean;
    message?: string;
    transactionId?: string;
  } | null;

  if (!response.ok || payload?.success === false) {
    throw new HttpError(502, payload?.message ?? "AzamPay did not accept the checkout request.");
  }

  return {
    message: payload?.message ?? "Check your phone and approve the mobile money prompt to complete payment.",
    providerReference: payload?.transactionId,
  };
}

export function parseAzamPayWebhook(body: Record<string, unknown>) {
  const statusValue = String(body.transactionstatus ?? body.transactionStatus ?? "").toLowerCase();
  const reference = String(body.utilityref ?? body.externalreference ?? body.externalId ?? body.reference ?? "");
  const providerTransactionId = String(body.transid ?? body.reference ?? "");
  const success = statusValue === "success" || statusValue === "true";
  return { reference, providerTransactionId, success };
}

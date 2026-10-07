import { apiRequest } from "./api";

export type ApiPayment = {
  id: number;
  plan: string;
  amount: number;
  phone: string;
  provider: string;
  status: "Pending" | "Approved" | "Rejected";
  reference: string;
  wifiToken: string | null;
  activatedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
};

export type WifiStatus = {
  connection: {
    plan: string;
    token: string | null;
    activatedAt: string;
    expiresAt: string;
  } | null;
  pendingToken: {
    plan: string;
    token: string;
    reference: string;
  } | null;
};

export function getPaymentsRequest() {
  return apiRequest<{ payments: ApiPayment[] }>("/api/payments");
}

export function getPaymentRequest(reference: string) {
  return apiRequest<{ payment: ApiPayment }>(`/api/payments/${encodeURIComponent(reference)}`);
}

export function createPaymentRequest(planName: string, phone: string, provider?: string) {
  return apiRequest<{ payment: ApiPayment; checkout: { message: string } }>("/api/payments", {
    method: "POST",
    body: JSON.stringify({ planName, phone, provider }),
  });
}

export function getWifiStatusRequest() {
  return apiRequest<WifiStatus>("/api/payments/wifi");
}

export function activateWifiRequest(token: string) {
  return apiRequest<{ connection: WifiStatus["connection"]; payment: ApiPayment }>("/api/payments/wifi/activate", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

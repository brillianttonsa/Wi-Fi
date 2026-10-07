export type AuthMode = "login" | "register" | "forgot" | "reset";

export type DashboardTab = "home" | "packages" | "profile";

export type PackagePlan = {
  name: string;
  duration: string;
  price: number;
  note: string;
  popular?: boolean;
};

export type PaymentRecord = {
  date: string;
  plan: string;
  amount: number;
  status: "Pending" | "Approved" | "Rejected";
  phone: string;
  reference: string;
  provider?: string;
  wifiToken?: string | null;
  activatedAt?: string | null;
  expiresAt?: string | null;
};

export type WifiConnection = {
  plan: string;
  token: string | null;
  activatedAt: string;
  expiresAt: string;
};

export type PendingWifiToken = {
  plan: string;
  token: string;
  reference: string;
};

export type DashboardOutletContext = {
  payments: PaymentRecord[];
  addPayment: (planName: string, phone: string, provider?: string) => Promise<PaymentRecord>;
  getPayment: (reference: string) => Promise<PaymentRecord>;
  connection: WifiConnection | null;
  pendingToken: PendingWifiToken | null;
  activateWifi: (token: string) => Promise<void>;
};

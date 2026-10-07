const prefixes: [string, string][] = [
  ["74", "Mpesa"],
  ["75", "Mpesa"],
  ["76", "Mpesa"],
  ["68", "Airtel"],
  ["69", "Airtel"],
  ["78", "Airtel"],
  ["65", "Tigo"],
  ["67", "Tigo"],
  ["71", "Tigo"],
  ["77", "Tigo"],
  ["62", "Halopesa"],
  ["61", "Azampesa"],
];

export const providers = ["Mpesa", "Airtel", "Tigo", "Halopesa", "Azampesa"] as const;
export type MobileProvider = (typeof providers)[number];

export function normalizeTzPhone(input: string) {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("255") && digits.length === 12) return digits;
  if (digits.startsWith("0") && digits.length === 10) return `255${digits.slice(1)}`;
  if (digits.length === 9) return `255${digits}`;
  throw new Error("Enter a valid Tanzania mobile number.");
}

export function detectProvider(phone: string): MobileProvider {
  const local = phone.replace(/^255/, "").slice(0, 2);
  return prefixes.find(([prefix]) => prefix === local)?.[1] as MobileProvider ?? "Mpesa";
}

export function parseProvider(value: string | undefined, phone: string): MobileProvider {
  if (value && providers.includes(value as MobileProvider)) return value as MobileProvider;
  return detectProvider(phone);
}

import type { PackagePlan } from "../types";

export const packages: PackagePlan[] = [
  { name: "Daily", duration: "24 hours", price: 5_000, note: "A quick connection" },
  { name: "3 Days", duration: "72 hours", price: 12_000, note: "For the long weekend", popular: true },
  { name: "Weekly", duration: "7 days", price: 25_000, note: "Best for regular use" },
  { name: "Monthly", duration: "30 days", price: 70_000, note: "Always stay online" },
];

export const benefits = [
  ["zap", "Fast", "Smooth streaming, quick downloads, zero waiting."],
  ["receipt", "Affordable", "Simple plans for every budget. No hidden fees."],
  ["wifi", "Reliable", "A stable connection whenever you need it."],
  ["shield", "Secure", "Protected browsing on every connected device."],
] as const;

export const formatTsh = (amount: number) =>
  `TSh ${new Intl.NumberFormat("en-TZ").format(amount)}`;
import type { PaymentRecord } from "../../types";
import { PaymentHistoryTable } from "./PaymentHistoryTable";

export function PaymentHistoryCard({ payments }: { payments: PaymentRecord[] }) {
  return (
    <section className="overflow-hidden rounded-[16px] border border-[#e5eae6] bg-white">
      <PaymentHistoryTable payments={payments} />
    </section>
  );
}
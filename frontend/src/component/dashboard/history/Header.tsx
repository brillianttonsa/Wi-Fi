import { formatTsh } from "../../website/Contants";
import type { PaymentRecord } from "../../types";

export function HistoryHeader({ payments }: { payments: PaymentRecord[] }) {
  const totalApproved = payments
    .filter((payment) => payment.status === "Approved")
    .reduce((total, payment) => total + payment.amount, 0);

  return (
    <div className="mb-4 mt-10">
      <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#fa6b37]">Payment activity</span>
      <h2 className="mt-1 text-xl font-extrabold tracking-[-0.05em] text-[#12201d]">Package payment history</h2>
      <p className="mt-1 text-[10px] text-[#66736e]">Approved payments total {formatTsh(totalApproved)}.</p>
    </div>
  );
}
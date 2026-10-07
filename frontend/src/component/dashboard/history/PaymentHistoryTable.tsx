import { useState } from "react";
import type { PaymentRecord } from "../../types";
import { Button, Icon } from "../../shared";
import { formatTsh } from "../../website/Contants";

export function PaymentHistoryTable({ payments }: { payments: PaymentRecord[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;
  const pageCount = Math.ceil(payments.length / pageSize);
  const visiblePayments = payments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (payments.length === 0) {
    return <p className="px-5 py-8 text-center text-[11px] text-[#66736e]">No package payments yet.</p>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] border-collapse text-left text-[9px]">
          <thead className="bg-[#fafbf8] text-[7px] font-extrabold uppercase tracking-[0.12em] text-[#909b96]">
            <tr>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Package</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Payment phone</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Reference</th>
            </tr>
          </thead>
          <tbody>
            {visiblePayments.map((payment) => (
              <tr key={payment.reference} className="border-t border-[#edf1ee] text-[#3f4c48]">
                <td className="whitespace-nowrap px-5 py-4">{payment.date}</td>
                <td className="px-5 py-4"><span className="flex items-center gap-2"><Icon name="wifi" size={15} className="text-[#fa6b37]" />{payment.plan}</span></td>
                <td className="whitespace-nowrap px-5 py-4 font-semibold">{formatTsh(payment.amount)}</td>
                <td className="whitespace-nowrap px-5 py-4">{payment.phone}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2 py-1 text-[7px] font-bold ${payment.status === "Approved" ? "bg-[#e4f6ed] text-[#20835b]" : payment.status === "Pending" ? "bg-[#fff0d9] text-[#b87516]" : "bg-[#fbe9e6] text-[#c84a3e]"}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-5 py-4 font-mono text-[#586c67]">{payment.reference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pageCount > 1 && (
        <div className="flex items-center justify-between border-t border-[#edf1ee] px-4 py-3">
          <span className="text-[9px] text-[#66736e]">
            Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, payments.length)} of {payments.length}
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => page - 1)} className="px-3 py-2 text-[9px]">Previous</Button>
            <Button variant="secondary" disabled={currentPage === pageCount} onClick={() => setCurrentPage((page) => page + 1)} className="px-3 py-2 text-[9px]">Next</Button>
          </div>
        </div>
      )}
    </>
  );
}
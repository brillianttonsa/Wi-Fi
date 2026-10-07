import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { packages } from "../../website/Contants";
import type { DashboardOutletContext, PackagePlan } from "../../types";
import { PaymentHistoryCard } from "../history/Card";
import { HistoryHeader } from "../history/Header";
import { ChoosePackageModal } from "./ChoosePackageModal";
import { PackagesCard } from "./PackagesCard";
import { PackagesHeader } from "./Header";

export function PackagesPage() {
  const { payments, addPayment, getPayment } = useOutletContext<DashboardOutletContext>();
  const [selectedPlan, setSelectedPlan] = useState<PackagePlan | null>(null);

  return (
    <>
      <PackagesHeader />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {packages.map((plan) => (
          <PackagesCard key={plan.name} plan={plan} onChoose={setSelectedPlan} />
        ))}
      </div>
      <HistoryHeader payments={payments} />
      <PaymentHistoryCard payments={payments} />
      {selectedPlan && (
        <ChoosePackageModal
          initialPlan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onSubmitPayment={addPayment}
          onPollPayment={getPayment}
        />
      )}
    </>
  );
}

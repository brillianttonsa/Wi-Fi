import { useEffect, useState, type FormEvent } from "react";
import { packages, formatTsh } from "../../website/Contants";
import type { PackagePlan, PaymentRecord } from "../../types";
import { Button, Field, Icon, Modal } from "../../shared";
import { useAuth } from "../../../hooks/useAuth";

const networks = ["Mpesa", "Airtel", "Tigo", "Halopesa", "Azampesa"] as const;

type ChoosePackageModalProps = {
  initialPlan: PackagePlan;
  onClose: () => void;
  onSubmitPayment: (planName: string, phone: string, provider?: string) => Promise<PaymentRecord>;
  onPollPayment: (reference: string) => Promise<PaymentRecord>;
};

export function ChoosePackageModal({ initialPlan, onClose, onSubmitPayment, onPollPayment }: ChoosePackageModalProps) {
  const { user } = useAuth();
  const [planName, setPlanName] = useState(initialPlan.name);
  const [provider, setProvider] = useState<(typeof networks)[number]>("Mpesa");
  const [step, setStep] = useState<"form" | "waiting" | "paid" | "failed">("form");
  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const selectedPlan = packages.find((plan) => plan.name === planName) ?? initialPlan;

  useEffect(() => {
    if (step !== "waiting" || !payment) return;
    let cancelled = false;
    const poll = window.setInterval(() => {
      void onPollPayment(payment.reference).then((latest) => {
        if (cancelled) return;
        setPayment(latest);
        if (latest.status === "Approved") setStep("paid");
        if (latest.status === "Rejected") setStep("failed");
      }).catch((pollError: unknown) => {
        if (!cancelled) setError(pollError instanceof Error ? pollError.message : "Unable to check payment status.");
      });
    }, 2500);
    return () => {
      cancelled = true;
      window.clearInterval(poll);
    };
  }, [onPollPayment, payment, step]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const phone = String(formData.get("phone") ?? "").trim();
    setError("");
    setSubmitting(true);
    try {
      const created = await onSubmitPayment(selectedPlan.name, phone, provider);
      setPayment(created);
      setStep(created.status === "Approved" ? "paid" : created.status === "Rejected" ? "failed" : "waiting");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to start the payment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Choose a Wi-Fi package" onClose={onClose} className="max-w-[500px]">
      {step === "waiting" && payment && (
        <div className="py-6 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#fff0d9] text-[#b87516]"><Icon name="clock" size={26} /></span>
          <h2 className="mt-5 text-2xl font-extrabold tracking-[-0.05em] text-[#12201d]">Approve on your phone</h2>
          <p className="mt-2 text-[12px] leading-5 text-[#586c67]">
            A {payment.provider ?? provider} prompt was sent to {payment.phone}. Approve it to confirm {formatTsh(selectedPlan.price)}.
          </p>
          <div className="mt-5 rounded-xl bg-[#f6f7f3] p-4 text-left text-[10px] text-[#5b6d68]">
            <p>Reference <strong className="float-right text-[#12201d]">{payment.reference}</strong></p>
            <p className="mt-3">Status <strong className="float-right text-[#b87516]">Waiting for payment</strong></p>
          </div>
          {error && <p role="alert" className="mt-3 text-[11px] text-[#c84a3e]">{error}</p>}
        </div>
      )}

      {step === "paid" && payment && (
        <div className="py-6 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#e4f6ed] text-[#20835b]"><Icon name="check" size={26} /></span>
          <h2 className="mt-5 text-2xl font-extrabold tracking-[-0.05em] text-[#12201d]">Payment confirmed</h2>
          <p className="mt-2 text-[12px] leading-5 text-[#586c67]">
            Enter this token on the home page to activate your {selectedPlan.name} Wi-Fi package.
          </p>
          <div className="mt-5 rounded-xl bg-[#f6f7f3] px-4 py-5 font-mono text-lg font-extrabold tracking-[0.18em] text-[#123d33]">
            {payment.wifiToken}
          </div>
          <Button onClick={onClose} className="mt-6 w-full">Done</Button>
        </div>
      )}

      {step === "failed" && (
        <div className="py-6 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#fbe9e6] text-[#c84a3e]"><Icon name="x" size={26} /></span>
          <h2 className="mt-5 text-2xl font-extrabold tracking-[-0.05em] text-[#12201d]">Payment was not completed</h2>
          <p className="mt-2 text-[12px] leading-5 text-[#586c67]">The mobile money request failed or was cancelled. You can try again with the same number.</p>
          <Button onClick={() => setStep("form")} className="mt-6 w-full">Try again</Button>
        </div>
      )}

      {step === "form" && (
        <>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#fa6b37]">Package payment</span>
          <h2 className="mt-2 pr-8 text-[1.8rem] font-extrabold tracking-[-0.06em] text-[#12201d]">Choose your plan</h2>
          <p className="mb-6 mt-2 text-[11px] text-[#586c67]">Enter the mobile money number that will receive the payment prompt.</p>
          <form onSubmit={submit}>
            <label className="mb-4 block text-left">
              <span className="mb-2 block text-[10px] font-bold text-[#12201d]">Package</span>
              <select
                value={planName}
                onChange={(event) => setPlanName(event.target.value)}
                className="h-12 w-full rounded-xl border border-[#dfe5e1] bg-white px-3 text-[12px] text-[#12201d] outline-none focus:border-[#fa6b37] focus:ring-4 focus:ring-[#fa6b37]/10"
              >
                {packages.map((plan) => <option key={plan.name} value={plan.name}>{plan.name} — {formatTsh(plan.price)}</option>)}
              </select>
            </label>
            <label className="mb-4 block text-left">
              <span className="mb-2 block text-[10px] font-bold text-[#12201d]">Mobile network</span>
              <select
                value={provider}
                onChange={(event) => setProvider(event.target.value as (typeof networks)[number])}
                className="h-12 w-full rounded-xl border border-[#dfe5e1] bg-white px-3 text-[12px] text-[#12201d] outline-none focus:border-[#fa6b37] focus:ring-4 focus:ring-[#fa6b37]/10"
              >
                {networks.map((network) => <option key={network} value={network}>{network}</option>)}
              </select>
            </label>
            <Field
              label="Mobile money payment phone number"
              placeholder="+255 7XX XXX XXX"
              type="tel"
              name="phone"
              defaultValue={user?.phone}
              autoComplete="tel"
              required
              icon="phone"
            />
            <div className="mb-5 rounded-xl bg-[#f6f7f3] p-4 text-[10px] text-[#5b6d68]">
              <span>{selectedPlan.duration} access</span>
              <strong className="float-right text-[15px] text-[#12201d]">{formatTsh(selectedPlan.price)}</strong>
            </div>
            {error && <p role="alert" className="mb-3 text-[11px] text-[#c84a3e]">{error}</p>}
            <Button type="submit" disabled={submitting} className="min-h-[46px] w-full">{submitting ? "Sending prompt..." : "Pay with mobile money"} <Icon name="arrow" size={17} /></Button>
          </form>
          <p className="mt-4 flex items-center justify-center gap-2 text-[9px] text-[#75817c]">
            <Icon name="shield" size={14} /> Approve the prompt on your phone. Your Wi-Fi token is issued after payment is detected.
          </p>
        </>
      )}
    </Modal>
  );
}

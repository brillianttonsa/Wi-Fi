import type { PackagePlan } from "../../types";
import { Button, Icon } from "../../shared";
import { formatTsh } from "../../website/Contants";

export function PackagesCard({ plan, onChoose }: { plan: PackagePlan; onChoose: (plan: PackagePlan) => void }) {
  return (
    <article className={`relative flex flex-col rounded-[18px] border bg-white p-5 shadow-[0_12px_24px_rgba(18,32,29,0.04)] ${plan.popular ? "border-[#fa6b37]" : "border-[#e3e9e3]"}`}>
      {plan.popular && <span className="absolute right-4 top-4 rounded-full bg-[#fa6b37] px-2 py-1 text-[7px] font-extrabold uppercase tracking-[0.18em] text-white">Popular</span>}
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff1ea] text-[#fa6b37]">
        <Icon name={plan.name === "Daily" ? "zap" : plan.name === "Monthly" ? "wifi" : "clock"} />
      </span>
      <span className="mt-5 text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#66736e]">{plan.duration}</span>
      <h2 className="mt-2 text-[18px] font-extrabold tracking-[-0.05em] text-[#12201d]">{plan.name}</h2>
      <p className="mt-2 text-[10px] text-[#556760]">{plan.note}</p>
      <strong className="mt-4 text-[23px] font-extrabold tracking-[-0.06em] text-[#12201d]">{formatTsh(plan.price)}</strong>
      <Button onClick={() => onChoose(plan)} className="mt-5 min-h-[38px] w-full text-[10px]">
        Choose package <Icon name="arrow" size={15} />
      </Button>
      
    </article>
  );
}
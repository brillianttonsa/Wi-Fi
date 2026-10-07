import { packages, formatTsh } from "./Contants";
import { Button, Icon } from "../shared";

export function PackagesCard({ onChoosePackage }: { onChoosePackage: () => void }) {
  return (
    <section id="packages" className="bg-[#f1f4ee] py-20">
      <div className="mx-auto max-w-[1220px] px-5 md:px-8 lg:px-10">
        <div className="mx-auto max-w-[620px] text-center">
          <span className="inline-flex rounded-full bg-[#fff0e8] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#fa6b37]">Simple pricing</span>
          <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.06em] sm:text-5xl">A plan for every pace</h2>
          <p className="mt-3 text-sm text-[#586c67]">Choose what works today. Upgrade whenever you want.</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {packages.map((plan) => (
            <article key={plan.name} className={`relative flex flex-col rounded-[22px] border bg-white p-5 shadow-[0_16px_30px_rgba(18,32,29,0.04)] ${plan.popular ? "border-[#fa6b37] bg-[#fffaf7]" : "border-[#e6ece6]"}`}>
              {plan.popular && <span className="absolute right-5 top-5 rounded-full bg-[#fa6b37] px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-[0.12em] text-white">Most popular</span>}
              <span className="pt-7 text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#fa6b37]">{plan.duration}</span>
              <h3 className="mt-3 text-[28px] font-extrabold tracking-[-0.06em]">{plan.name}</h3>
              <p className="mt-2 text-[12px] text-[#5e6d69]">{plan.note}</p>
              <div className="mt-5 text-[28px] font-extrabold tracking-[-0.06em]">{formatTsh(plan.price)}</div>
              <ul className="mt-5 flex-1 space-y-2.5 text-[11px] text-[#3b4a45]">
                {["Unlimited browsing", "All devices supported", "Instant activation"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-[#e4f5eb] text-[#1f7d59]"><Icon name="check" size={13} /></span>
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant={plan.popular ? "primary" : "dark"} className="mt-6 min-h-[42px] w-full text-[12px]" onClick={onChoosePackage}>
                Choose package <Icon name="arrow" size={16} />
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
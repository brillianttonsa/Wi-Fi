import { benefits } from "./Contants";
import { Icon, type IconName } from "../shared";

export function WhyUs() {
  return (
    <section id="benefits" className="mx-auto grid max-w-[1220px] gap-4 px-5 pb-16 md:grid-cols-2 md:px-8 lg:grid-cols-4 lg:px-10">
      {benefits.map(([icon, title, text]) => (
        <article key={title} className="rounded-[20px] border border-[#e7ece7] bg-white p-6 shadow-[0_12px_28px_rgba(18,32,29,0.03)]">
          <span className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-[#fff1ea] text-[#fa6b37]">
            <Icon name={icon as IconName} />
          </span>
          <h2 className="text-xl font-extrabold tracking-[-0.06em]">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-[#5d6c66]">{text}</p>
        </article>
      ))}
    </section>
  );
}
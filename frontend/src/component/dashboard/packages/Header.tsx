import { Icon } from "../../shared";

export function PackagesHeader() {
  return (
    <header className="mb-6">
      <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#fa6b37]">Stay connected</span>
      <h1 className="mt-2 text-[2.2rem] font-extrabold tracking-[-0.07em] text-[#12201d]">Choose your package</h1>
      <p className="mt-2 text-[11px] text-[#586c67]">Select a plan, enter your mobile money number, then approve the payment prompt on your phone.</p>
      <p className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#edf7f1] px-3 py-2 text-[10px] text-[#31564a]">
        <Icon name="shield" size={15} /> After payment is detected you receive a Wi-Fi token to activate access.
      </p>
    </header>
  );
}
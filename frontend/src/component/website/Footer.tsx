import { Logo } from "../shared";

export function Footer() {
  return (
    <footer className="bg-[#102f28] text-white">
      <div className="mx-auto flex max-w-[1220px] flex-col gap-4 px-5 py-8 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left lg:px-10">
        <div>
          <Logo inverse />
          <p className="mt-2 text-[10px] text-white/60">Better internet, made simple.</p>
        </div>
        <p className="text-[10px] text-white/45">© {new Date().getFullYear()} Wi-Fi Networks</p>
      </div>
    </footer>
  );
}
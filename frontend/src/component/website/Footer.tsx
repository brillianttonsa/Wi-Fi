import { Logo } from "../shared";

export function Footer() {
  return (
    <footer className="bg-[#102f28] text-white">
      <div className="mx-auto flex max-w-[1220px] flex-col gap-4 px-5 py-8 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left lg:px-10">
        <div>
          <Logo inverse />
          <p className="mt-2 text-[10px] text-white/60">Better internet, made simple.</p>
        </div>
        <address className="flex flex-col gap-2 text-[10px] not-italic text-white/75">
          <a href="mailto:hello@linka.net" className="hover:text-white">hello@linka.net</a>
          <a href="tel:+255754123456" className="hover:text-white">+255 754 123 456</a>
        </address>
        <p className="text-[10px] text-white/45">© {new Date().getFullYear()} Linka Networks</p>
      </div>
    </footer>
  );
}
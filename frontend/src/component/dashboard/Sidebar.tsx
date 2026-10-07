import { NavLink } from "react-router-dom";
import { Button, Icon, Logo } from "../shared";
import type { DashboardTab } from "../types";

const navigation: { id: DashboardTab; label: string; to: string; icon: "home" | "profile" | "package" }[] = [
  { id: "home", label: "Home", to: "/", icon: "home" },
  { id: "packages", label: "Packages", to: "/packages", icon: "package" },
  { id: "profile", label: "Profile", to: "/profile", icon: "profile" },
];

type SidebarProps = {
  onLogout: () => void;
  mobileOpen: boolean;
  onClose: () => void;
};

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Dashboard navigation" className="mt-10 space-y-1">
      {navigation.map(({ id, label, to, icon }) => (
        <NavLink
          key={id}
          to={to}
          end={to === "/"}
          onClick={onNavigate}
          className={({ isActive }) => `flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-[12px] font-semibold transition ${
            isActive
              ? "bg-white text-[#12201d] shadow-[inset_3px_0_0_#fa6b37]"
              : "text-[#66736e] hover:bg-white/70 hover:text-[#12201d]"
          }`}
        >
          <Icon name={icon} /> {label}
        </NavLink>
      ))}
    </nav>
  );
}

function SidebarBody({ onLogout, onNavigate }: { onLogout: () => void; onNavigate?: () => void }) {
  return (
    <>
      <Logo to="/" />
      <div className="flex min-h-0 flex-1 flex-col">
        <SidebarNav onNavigate={onNavigate} />
        <Button variant="ghost" onClick={onLogout} className="mt-auto justify-start px-3 text-[11px] text-[#66736e] hover:bg-white hover:text-[#12201d]">
          <Icon name="logout" size={17} /> Log out
        </Button>
      </div>
    </>
  );
}

export function Sidebar({ onLogout, mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 hidden w-[230px] flex-col border-r border-[#e4e9e3] bg-[#f7f8f2] p-6 text-[#12201d] lg:flex">
        <SidebarBody onLogout={onLogout} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-[#081814]/40" onClick={onClose} />
          <aside className="relative flex h-full w-[min(230px,86vw)] flex-col border-r border-[#e4e9e3] bg-[#f7f8f2] p-6 text-[#12201d] shadow-[12px_0_40px_rgba(18,32,29,0.12)]">
            <button type="button" aria-label="Close menu" onClick={onClose} className="absolute right-3 top-4 grid h-8 w-8 place-items-center rounded-full text-[#12201d] hover:bg-white">
              <Icon name="x" size={16} />
            </button>
            <SidebarBody onLogout={onLogout} onNavigate={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}

import { useEffect, type ReactNode } from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  Copy,
  Eye,
  Home,
  LockKeyhole,
  Menu,
  Package,
  Phone,
  ReceiptText,
  ShieldCheck,
  UserRound,
  Wifi,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type IconName =
  | "arrow"
  | "check"
  | "chevron"
  | "clock"
  | "copy"
  | "eye"
  | "home"
  | "lock"
  | "menu"
  | "package"
  | "phone"
  | "profile"
  | "receipt"
  | "shield"
  | "wifi"
  | "x"
  | "zap";

const icons: Record<IconName, LucideIcon> = {
  arrow: ArrowRight,
  check: Check,
  chevron: ChevronRight,
  clock: Clock3,
  copy: Copy,
  eye: Eye,
  home: Home,
  lock: LockKeyhole,
  menu: Menu,
  package: Package,
  phone: Phone,
  profile: UserRound,
  receipt: ReceiptText,
  shield: ShieldCheck,
  wifi: Wifi,
  x: X,
  zap: Zap,
};

export function Icon({ name, size = 20, className = "" }: { name: IconName; size?: number; className?: string }) {
  const IconComponent = icons[name];
  return <IconComponent aria-hidden="true" size={size} strokeWidth={1.8} className={`shrink-0 ${className}`} />;
}

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <a
      href="#top"
      className={`inline-flex items-center gap-2 text-base font-extrabold tracking-[-0.06em] ${
        inverse ? "text-white" : "text-[#12201d]"
      }`}
      aria-label="Linka home"
    >
      <span
        className={`grid h-8 w-8 place-items-center rounded-xl border text-[#fa6b37] ${
          inverse ? "border-white/10 bg-white/10" : "border-[#e9efe8] bg-[#f6f8f4]"
        }`}
      >
        <Icon name="wifi" size={18} />
      </span>
      Linka
    </a>
  );
}

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "dark";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

export function Button({
  children,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
  disabled = false,
}: ButtonProps) {
  const variants = {
    primary: "bg-[#fa6b37] text-white shadow-[0_14px_22px_rgba(250,107,55,0.22)] hover:bg-[#e95d2a]",
    secondary: "bg-[#eef2ee] text-[#123d33] hover:bg-[#e4ebe5]",
    ghost: "bg-transparent text-[#123d33] hover:bg-[#eef2ee]",
    dark: "bg-[#123d33] text-white hover:bg-[#0f2a26]",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

type FieldProps = {
  label: string;
  placeholder: string;
  type?: string;
  name?: string;
  required?: boolean;
  autoComplete?: string;
  icon?: IconName;
};

export function Field({
  label,
  placeholder,
  type = "text",
  name,
  required = false,
  autoComplete,
  icon,
}: FieldProps) {
  return (
    <label className="mb-4 block text-left">
      <span className="mb-2 block text-[10px] font-bold text-[#12201d]">{label}</span>
      <span className="flex h-12 items-center gap-2.5 rounded-xl border border-[#dfe5e1] bg-white px-3 text-[#93a09b] transition focus-within:border-[#fa6b37] focus-within:ring-4 focus-within:ring-[#fa6b37]/10">
        {icon && <Icon name={icon} size={17} />}
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className="w-full border-0 bg-transparent text-[12px] text-[#12201d] outline-none placeholder:text-[#a7afac]"
        />
      </span>
    </label>
  );
}

type ModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
};

export function Modal({ title, onClose, children, className = "" }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#081814]/65 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative my-auto max-h-[calc(100vh-2rem)] w-full max-w-[470px] overflow-y-auto rounded-[22px] bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,0.24)] sm:p-8 ${className}`}
      >
        <button
          type="button"
          aria-label="Close dialog"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-[#f4f6f2] text-[#12201d] transition hover:bg-[#e9eee8]"
        >
          <Icon name="x" size={18} />
        </button>
        {children}
      </section>
    </div>
  );
}

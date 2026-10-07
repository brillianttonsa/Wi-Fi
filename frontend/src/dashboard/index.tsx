import { useCallback, useEffect, useRef, useState } from "react";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { initialPaymentHistory } from "../component/dashboard/Constants";
import { Sidebar } from "../component/dashboard/Sidebar";
import { Icon, Logo } from "../component/shared";
import type { DashboardOutletContext, PaymentRecord, PendingWifiToken, WifiConnection } from "../component/types";
import {
  activateWifiRequest,
  createPaymentRequest,
  getPaymentRequest,
  getPaymentsRequest,
  getWifiStatusRequest,
  type ApiPayment,
} from "../services/paymentApi";

const toPaymentRecord = (payment: ApiPayment): PaymentRecord => ({
  date: new Intl.DateTimeFormat("en-TZ", { dateStyle: "medium" }).format(new Date(payment.createdAt)),
  plan: payment.plan,
  amount: payment.amount,
  status: payment.status,
  phone: payment.phone,
  reference: payment.reference,
  provider: payment.provider,
  wifiToken: payment.wifiToken,
  activatedAt: payment.activatedAt,
  expiresAt: payment.expiresAt,
});

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState<PaymentRecord[]>(initialPaymentHistory);
  const [connection, setConnection] = useState<WifiConnection | null>(null);
  const [pendingToken, setPendingToken] = useState<PendingWifiToken | null>(null);
  const [logoutError, setLogoutError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const loadWifi = useCallback(() =>
    getWifiStatusRequest()
      .then((status) => {
        setConnection(status.connection);
        setPendingToken(status.pendingToken);
      })
      .catch((error: unknown) => console.error("Unable to load Wi-Fi status.", error)), []);

  useEffect(() => {
    if (!user) return;
    void getPaymentsRequest()
      .then(({ payments: savedPayments }) => setPayments(savedPayments.map(toPaymentRecord)))
      .catch((error: unknown) => console.error("Unable to load payment history.", error));
    void loadWifi();
  }, [loadWifi, user]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  if (!user) return <Navigate to="/" replace />;

  const addPayment = useCallback(async (planName: string, phone: string, provider?: string) => {
    const { payment } = await createPaymentRequest(planName, phone, provider);
    const record = toPaymentRecord(payment);
    setPayments((current) => [record, ...current]);
    return record;
  }, []);

  const getPayment = useCallback(async (reference: string) => {
    const { payment } = await getPaymentRequest(reference);
    const record = toPaymentRecord(payment);
    setPayments((current) => {
      const without = current.filter((item) => item.reference !== record.reference);
      return [record, ...without];
    });
    if (record.status === "Approved") void loadWifi();
    return record;
  }, [loadWifi]);

  const activateWifi = useCallback(async (token: string) => {
    await activateWifiRequest(token);
    await loadWifi();
    const { payments: savedPayments } = await getPaymentsRequest();
    setPayments(savedPayments.map(toPaymentRecord));
  }, [loadWifi]);

  const handleLogout = async () => {
    setLogoutError("");
    setMenuOpen(false);
    setMobileNavOpen(false);
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : "Unable to log out. Please try again.");
    }
  };

  const outletContext: DashboardOutletContext = { payments, addPayment, getPayment, connection, pendingToken, activateWifi };

  return (
    <div className="min-h-screen bg-[#f7f8f2] lg:flex">
      <Sidebar onLogout={handleLogout} mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="w-full">
        <header className="flex h-[68px] items-center justify-between border-b border-[#e4e9e3] bg-[#f7f8f2] px-4 sm:px-6 lg:h-[76px] lg:justify-end lg:px-8">
          <div className="flex items-center gap-2 lg:hidden">
            <button type="button" aria-label="Open menu" onClick={() => setMobileNavOpen(true)} className="grid h-9 w-9 place-items-center rounded-xl text-[#12201d] hover:bg-white">
              <Icon name="menu" size={18} />
            </button>
            <Logo to="/" />
          </div>
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="flex items-center gap-3 rounded-xl px-1 py-1 hover:bg-white"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#dceadd] text-[10px] font-extrabold text-[#123d33]">
                {user.fullName.split(/\s+/).slice(0, 2).map((name) => name[0]?.toUpperCase()).join("")}
              </span>
              <div className="hidden text-left sm:flex sm:flex-col">
                <strong className="text-[10px] text-[#12201d]">{user.fullName}</strong>
                <small className="text-[8px] text-[#66736e]">{user.phone}</small>
              </div>
              <Icon name="chevron" size={15} className={`text-[#66736e] transition ${menuOpen ? "rotate-90" : ""}`} />
            </button>
            {menuOpen && (
              <div role="menu" className="absolute right-0 top-[calc(100%+8px)] z-40 w-44 overflow-hidden rounded-xl border border-[#e4e9e3] bg-white py-1 shadow-[0_16px_40px_rgba(18,32,29,0.12)]">
                <Link to="/profile" role="menuitem" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-[11px] font-semibold text-[#12201d] hover:bg-[#f7f8f2]">
                  <Icon name="profile" size={15} /> Profile
                </Link>
                <button type="button" role="menuitem" onClick={handleLogout} className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-[11px] font-semibold text-[#12201d] hover:bg-[#f7f8f2]">
                  <Icon name="logout" size={15} /> Log out
                </button>
              </div>
            )}
          </div>
        </header>
        {logoutError && <p role="alert" className="bg-[#fbe9e6] px-5 py-2 text-center text-[11px] text-[#c84a3e]">{logoutError}</p>}
        <main className="mx-auto w-[min(1040px,calc(100%-32px))] pb-12 pt-8 lg:pt-10">
          <Outlet context={outletContext} />
        </main>
      </div>
    </div>
  );
}

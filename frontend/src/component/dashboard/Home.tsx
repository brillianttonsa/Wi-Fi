import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Button, Icon } from "../shared";
import type { PendingWifiToken, WifiConnection } from "../types";

function remainingParts(expiresAt: string) {
  const total = Math.max(0, Date.parse(expiresAt) - Date.now());
  const days = Math.floor(total / 86_400_000);
  const hours = Math.floor((total % 86_400_000) / 3_600_000);
  const mins = Math.floor((total % 3_600_000) / 60_000);
  return { days, hours, mins, total };
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function Home({
  onViewPackages,
  connection,
  pendingToken,
  onActivate,
  customerName,
}: {
  onViewPackages: () => void;
  connection: WifiConnection | null;
  pendingToken: PendingWifiToken | null;
  onActivate: (token: string) => Promise<void>;
  customerName: string;
}) {
  const [now, setNow] = useState(() => Date.now());
  const [tokenInput, setTokenInput] = useState(pendingToken?.token ?? "");
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (pendingToken?.token) setTokenInput(pendingToken.token);
  }, [pendingToken?.token]);

  const remaining = useMemo(() => (connection ? remainingParts(connection.expiresAt) : null), [connection, now]);
  const progress = connection && remaining
    ? Math.min(100, Math.max(8, ((Date.parse(connection.expiresAt) - now) / (Date.parse(connection.expiresAt) - Date.parse(connection.activatedAt))) * 100))
    : 0;

  const activate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setActivating(true);
    try {
      await onActivate(tokenInput);
    } catch (activateError) {
      setError(activateError instanceof Error ? activateError.message : "Unable to activate this token.");
    } finally {
      setActivating(false);
    }
  };

  const copyToken = async () => {
    if (!pendingToken?.token) return;
    await navigator.clipboard.writeText(pendingToken.token);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section>
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#fa6b37]">
            {new Intl.DateTimeFormat("en-TZ", { weekday: "long", month: "long", day: "numeric" }).format(new Date())}
          </span>
          <h1 className="mt-2 text-[2.2rem] font-extrabold tracking-[-0.07em] text-[#12201d] lg:text-[2.8rem]">
            {greeting()}, {customerName.split(/\s+/)[0]}.
          </h1>
          <p className="mt-2 text-[11px] text-[#5b6d68]">
            {connection ? "Your package is active. Stay connected." : pendingToken ? "Payment confirmed. Enter your token to start Wi-Fi." : "Buy a package, pay from your phone, then activate with your token."}
          </p>
        </div>
        <Button variant="secondary" onClick={onViewPackages} className="min-h-[42px] text-[11px]">
          <Icon name="package" size={17} /> Buy a package
        </Button>
      </div>

      {connection && remaining ? (
        <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#123d33] via-[#1b5547] to-[#10382d] p-5 text-white shadow-[0_22px_40px_rgba(18,61,51,0.18)] sm:p-6">
          <div className="absolute -right-16 -top-14 h-56 w-56 rounded-full border border-white/10" />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-[8px] font-extrabold uppercase tracking-[0.18em] text-[#a9c6bd]">
                <i className="h-2.5 w-2.5 rounded-full bg-[#72dc98] shadow-[0_0_0_4px_rgba(114,220,152,0.12)]" /> Active connection
              </span>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-[#fa6b37]"><Icon name="wifi" size={24} /></span>
            </div>
            <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-[9px] uppercase tracking-[0.18em] text-white/45">Current Wi-Fi access</span>
                <h2 className="mt-1 text-[2.1rem] font-extrabold tracking-[-0.07em]">{connection.plan} Plan</h2>
                <p className="mt-1 text-[9px] text-white/60">Unlimited high-speed access</p>
              </div>
              <div className="grid grid-cols-[34px_12px_34px_12px_34px] items-center gap-y-1 text-center">
                <strong className="font-mono text-[22px] font-medium">{String(remaining.days).padStart(2, "0")}</strong><b className="text-white/30">:</b>
                <strong className="font-mono text-[22px] font-medium">{String(remaining.hours).padStart(2, "0")}</strong><b className="text-white/30">:</b>
                <strong className="font-mono text-[22px] font-medium">{String(remaining.mins).padStart(2, "0")}</strong>
                <span className="text-[7px] uppercase text-white/40">Days</span>
                <span className="text-[7px] uppercase text-white/40">Hours</span>
                <span className="text-[7px] uppercase text-white/40">Mins</span>
              </div>
            </div>
            <div className="mt-6 border-t border-white/10 pt-4">
              <div className="flex items-center justify-between text-[8px] text-white/45">
                <span>Time remaining</span>
                <strong className="text-white">{remaining.days} days, {remaining.hours} hours left</strong>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#fa6b37]" style={{ width: `${progress}%` }} /></div>
              <p className="mt-3 flex items-center gap-2 text-[8px] text-white/55">
                <Icon name="clock" size={15} /> Expires {new Intl.DateTimeFormat("en-TZ", { dateStyle: "medium", timeStyle: "short" }).format(new Date(connection.expiresAt))}
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-[24px] border border-[#e5eae6] bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-[#66736e]">No active session</span>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff1ea] text-[#fa6b37]"><Icon name="wifi" size={22} /></span>
          </div>
          <h2 className="mt-4 text-[1.6rem] font-extrabold tracking-[-0.06em] text-[#12201d]">Connect after payment</h2>
          <p className="mt-2 text-[11px] text-[#5b6d68]">Once mobile money payment is confirmed, your access token appears here. Enter it to start Wi-Fi.</p>
        </section>
      )}

      <section className="mt-5 rounded-[18px] border border-[#e5eae6] bg-white p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff1ea] text-[#fa6b37]"><Icon name="lock" size={17} /></span>
          <div>
            <h2 className="text-[12px] font-bold text-[#12201d]">Your Wi-Fi token</h2>
            <p className="mt-1 text-[9px] text-[#66736e]">
              {pendingToken ? "Payment detected. Use this token to activate Wi-Fi." : connection ? "This session is already active." : "Your token will appear here after payment is confirmed."}
            </p>
          </div>
        </div>
        <div aria-live="polite" className="mt-4 flex min-h-11 items-center justify-between gap-3 rounded-xl border border-dashed border-[#d8e1da] bg-[#fafbf8] px-4 py-3 font-mono text-sm font-bold tracking-wider text-[#123d33]">
          <span>{pendingToken?.token ?? connection?.token ?? ""}</span>
          {pendingToken?.token && (
            <button type="button" onClick={() => void copyToken()} className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#fa6b37]">
              {copied ? "Copied" : "Copy"}
            </button>
          )}
        </div>
        {!connection && (
          <form onSubmit={activate} className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              value={tokenInput}
              onChange={(event) => setTokenInput(event.target.value)}
              placeholder="Enter token to activate Wi-Fi"
              className="h-11 rounded-xl border border-[#dfe5e1] bg-white px-3 font-mono text-[12px] text-[#12201d] outline-none focus:border-[#fa6b37] focus:ring-4 focus:ring-[#fa6b37]/10"
              required
            />
            <Button type="submit" disabled={activating} className="min-h-[44px]">{activating ? "Activating..." : "Activate Wi-Fi"}</Button>
          </form>
        )}
        {error && <p role="alert" className="mt-3 text-[11px] text-[#c84a3e]">{error}</p>}
      </section>

      <div className="mt-8 rounded-[18px] border border-[#d9e5d9] bg-[#edf7f1] p-5">
        <h2 className="text-[15px] font-extrabold text-[#123d33]">Need more Wi-Fi time?</h2>
        <p className="mt-1 text-[10px] text-[#5d6c66]">Choose a package and approve the mobile money prompt on your phone.</p>
        <Button onClick={onViewPackages} className="mt-4 min-h-[38px] text-[10px]">View packages <Icon name="arrow" size={15} /></Button>
      </div>
    </section>
  );
}

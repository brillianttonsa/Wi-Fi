import { useAuth } from "../../hooks/useAuth";
import type { AuthMode } from "../types";
import { Logo, Modal } from "../shared";
import { Login } from "./Login";
import { Register } from "./Register";

type AuthModalProps = {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
  onAuthenticated: () => void;
};

export function AuthModal({ mode, onModeChange, onClose, onAuthenticated }: AuthModalProps) {
  const { login, register } = useAuth();

  return (
    <Modal title="Wi-Fi account" onClose={onClose}>
      <div className="mb-7 pr-10">
        <Logo />
      </div>
      {mode === "login" && (
        <Login
          onLogin={async (phone, password) => { await login(phone, password); onAuthenticated(); }}
          onRegister={() => onModeChange("register")}
          onForgotPassword={() => onModeChange("forgot")}
        />
      )}
      {mode === "register" && (
        <Register
          onRegister={async (data) => { await register(data); onAuthenticated(); }}
          onLogin={() => onModeChange("login")}
        />
      )}
      {(mode === "forgot" || mode === "reset") && (
        <div className="py-4">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#fa6b37]">Account recovery</span>
          <h2 className="mt-2 text-[2rem] font-extrabold tracking-[-0.06em] text-[#12201d]">Contact Wi-Fi support</h2>
          <p className="mt-3 text-[12px] leading-5 text-[#586c67]">
            Password recovery is not configured on this local server yet. Contact support to regain access.
          </p>
          <a href="mailto:hello@wifi.com" className="mt-4 inline-block font-bold text-[#fa6b37]">hello@wifi.com</a>
          <button type="button" onClick={() => onModeChange("login")} className="mt-5 block text-[11px] font-semibold text-[#66736e]">Back to log in</button>
        </div>
      )}
    </Modal>
  );
}

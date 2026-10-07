import { useState } from "react";
import type { AuthMode } from "../types";
import { Icon, Logo, Modal } from "../shared";
import { ForgotPassword } from "./ForgotPassword";
import { Login } from "./Login";
import { Register } from "./Register";
import { ResetPassword } from "./ResetPassword";

type AuthModalProps = {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
  onAuthenticated: () => void;
};

export function AuthModal({ mode, onModeChange, onClose, onAuthenticated }: AuthModalProps) {
  const [resetComplete, setResetComplete] = useState(false);

  return (
    <Modal title="Wi-Fi account" onClose={onClose}>
      <div className="mb-7 pr-10">
        <Logo />
      </div>
      {resetComplete ? (
        <div className="py-5 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#e4f5eb] text-[#20835b]"><Icon name="check" size={26} /></span>
          <h2 className="mt-5 text-2xl font-extrabold tracking-[-0.05em]">Password updated</h2>
          <p className="mt-2 text-sm text-[#586c67]">You can now log in with your new password.</p>
          <button type="button" onClick={() => { setResetComplete(false); onModeChange("login"); }} className="mt-6 font-bold text-[#fa6b37]">Return to log in</button>
        </div>
      ) : (
        <>
          {mode === "login" && (
            <Login
              onSuccess={onAuthenticated}
              onRegister={() => onModeChange("register")}
              onForgotPassword={() => onModeChange("forgot")}
            />
          )}
          {mode === "register" && (
            <Register onSuccess={onAuthenticated} onLogin={() => onModeChange("login")} />
          )}
          {mode === "forgot" && (
            <ForgotPassword onContinue={() => onModeChange("reset")} onBack={() => onModeChange("login")} />
          )}
          {mode === "reset" && (
            <ResetPassword
              onSuccess={() => setResetComplete(true)}
              onBack={() => onModeChange("login")}
            />
          )}
        </>
      )}
     
    </Modal>
  );
}

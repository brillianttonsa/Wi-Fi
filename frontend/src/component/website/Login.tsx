import { useState, type FormEvent } from "react";
import { Button, Field, Icon } from "../shared";

type LoginProps = {
  onLogin: (phone: string, password: string) => Promise<void>;
  onRegister: () => void;
  onForgotPassword: () => void;
};

export function Login({ onLogin, onRegister, onForgotPassword }: LoginProps) {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError("");
    setSubmitting(true);
    try {
      await onLogin(String(formData.get("phone") ?? ""), String(formData.get("password") ?? ""));
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#fa6b37]">Welcome back</span>
      <h2 className="mt-2 text-[2rem] font-extrabold tracking-[-0.06em] text-[#12201d]">Log in to Wi-Fi</h2>
      <p className="mb-7 mt-2 text-[12px] text-[#586c67]">Enter your details to manage your Wi-Fi.</p>
      <Field label="Phone number" placeholder="+255 7XX XXX XXX" type="tel" name="phone" autoComplete="tel" required icon="phone" />
      <Field label="Password" placeholder="Enter your password" type="password" name="password" autoComplete="current-password" required icon="lock" />
      <button type="button" className="mb-5 ml-auto block text-[10px] font-bold text-[#fa6b37]" onClick={onForgotPassword}>Forgot password?</button>
      {error && <p role="alert" className="mb-3 text-[11px] text-[#c84a3e]">{error}</p>}
      <Button type="submit" disabled={submitting} className="min-h-[46px] w-full">
        {submitting ? "Logging in..." : "Log in"} <Icon name="arrow" size={17} />
      </Button>
      <p className="mt-5 text-center text-[11px] text-[#5f6d69]">
        New to Wi-Fi? <button type="button" onClick={onRegister} className="font-bold text-[#fa6b37]">Create an account</button>
      </p>
    </form>
  );
}
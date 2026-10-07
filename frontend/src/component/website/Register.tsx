import { useState, type FormEvent } from "react";
import { Button, Field, Icon } from "../shared";

type RegisterData = { fullName: string; phone: string; email?: string; password: string };

export function Register({ onRegister, onLogin }: { onRegister: (data: RegisterData) => Promise<void>; onLogin: () => void }) {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError("");
    setSubmitting(true);
    try {
      await onRegister({
        fullName: String(formData.get("name") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#fa6b37]">Join Wi-Fi</span>
      <h2 className="mt-2 text-[2rem] font-extrabold tracking-[-0.06em] text-[#12201d]">Create your account</h2>
      <p className="mb-7 mt-2 text-[12px] text-[#586c67]">Get online in just a couple of minutes.</p>
      <Field label="Full name" placeholder="Your full name" name="name" autoComplete="name" required icon="profile" />
      <Field label="Phone number" placeholder="+255 7XX XXX XXX" type="tel" name="phone" autoComplete="tel" required icon="phone" />
      <Field label="Email address" placeholder="you@example.com" type="email" name="email" autoComplete="email" icon="profile" />
      <Field label="Password" placeholder="At least 8 characters" type="password" name="password" autoComplete="new-password" required icon="lock" />
      {error && <p role="alert" className="mb-3 text-[11px] text-[#c84a3e]">{error}</p>}
      <Button type="submit" disabled={submitting} className="min-h-[46px] w-full">
        {submitting ? "Creating account..." : "Create account"} <Icon name="arrow" size={17} />
      </Button>
      <p className="mt-5 text-center text-[11px] text-[#5f6d69]">
        Already registered? <button type="button" onClick={onLogin} className="font-bold text-[#fa6b37]">Log in</button>
      </p>
    </form>
  );
}
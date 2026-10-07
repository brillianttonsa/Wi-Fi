import { useState, type FormEvent } from "react";
import { Button, Field, Icon } from "../shared";

export function ResetPassword({ onSuccess, onBack }: { onSuccess: () => void; onBack: () => void }) {
  const [error, setError] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (form.get("password") !== form.get("confirmPassword")) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    onSuccess();
  };

  return (
    <form onSubmit={submit}>
      <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#fa6b37]">Account recovery</span>
      <h2 className="mt-2 text-[2rem] font-extrabold tracking-[-0.06em] text-[#12201d]">Set a new password</h2>
      <p className="mb-7 mt-2 text-[12px] leading-5 text-[#586c67]">Choose a new password for your account.</p>
      <Field label="Verification code" placeholder="Enter the code" name="code" required icon="lock" />
      <Field label="New password" placeholder="At least 8 characters" type="password" name="password" autoComplete="new-password" required icon="lock" />
      <Field label="Confirm new password" placeholder="Repeat your password" type="password" name="confirmPassword" autoComplete="new-password" required icon="lock" />
      {error && <p role="alert" className="mb-3 text-[11px] text-[#c84a3e]">{error}</p>}
      <Button type="submit" className="min-h-[46px] w-full">Reset password <Icon name="check" size={17} /></Button>
      <button type="button" onClick={onBack} className="mt-5 w-full text-center text-[11px] font-semibold text-[#66736e]">Back to log in</button>
    </form>
  );
}
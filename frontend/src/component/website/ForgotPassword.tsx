import type { FormEvent } from "react";
import { Button, Field, Icon } from "../shared";

export function ForgotPassword({ onContinue, onBack }: { onContinue: () => void; onBack: () => void }) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onContinue();
  };

  return (
    <form onSubmit={submit}>
      <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#fa6b37]">Account recovery</span>
      <h2 className="mt-2 text-[2rem] font-extrabold tracking-[-0.06em] text-[#12201d]">Forgot password?</h2>
      <p className="mb-7 mt-2 text-[12px] leading-5 text-[#586c67]">Enter your account phone number to continue resetting your password.</p>
      <Field label="Phone number" placeholder="+255 7XX XXX XXX" type="tel" name="phone" autoComplete="tel" required icon="phone" />
      <Button type="submit" className="min-h-[46px] w-full">Continue <Icon name="arrow" size={17} /></Button>
      <button type="button" onClick={onBack} className="mt-5 w-full text-center text-[11px] font-semibold text-[#66736e]">Back to log in</button>
    </form>
  );
}
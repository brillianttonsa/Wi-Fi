import { useState, type FormEvent } from "react";
import { useAuth } from "../../hooks/useAuth";
import { ApiError } from "../../services/api";
import { Button, Field, Icon } from "../shared";

export function Profile() {
  const { user, updateProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const currentPassword = String(data.get("currentPassword") ?? "");
    const newPassword = String(data.get("newPassword") ?? "");
    const confirmPassword = String(data.get("confirmPassword") ?? "");

    if (newPassword && newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      setMessage("");
      return;
    }
    if (Boolean(currentPassword) !== Boolean(newPassword)) {
      setError("Enter both your current and new passwords to change your password.");
      setMessage("");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");
    try {
      await updateProfile({
        fullName: String(data.get("fullName") ?? ""),
        phone: String(data.get("phone") ?? ""),
        email: String(data.get("email") ?? ""),
        ...(currentPassword || newPassword ? { currentPassword, newPassword } : {}),
      });
      form.reset();
      setMessage("Profile changes saved.");
    } catch (saveError) {
      setError(saveError instanceof ApiError ? saveError.message : "Unable to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <div className="mb-6">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#fa6b37]">Your account</span>
        <h1 className="mt-2 text-[2.2rem] font-extrabold tracking-[-0.07em] text-[#12201d]">Profile</h1>
        <p className="mt-2 text-[11px] text-[#586c67]">Update your contact details or change your password.</p>
      </div>
      <form key={`${user?.updatedAt}-${user?.phone}`} onSubmit={submit} className="rounded-[18px] border border-[#e5eae6] bg-white p-5 sm:p-6">
        <div className="flex items-center gap-4 border-b border-[#edf1ee] pb-6">
          <span className="grid h-[58px] w-[58px] shrink-0 place-items-center rounded-full bg-[#dceadd] text-[15px] font-extrabold text-[#123d33]">
            {user?.fullName.split(/\s+/).slice(0, 2).map((name) => name[0]?.toUpperCase()).join("")}
          </span>
          <div>
            <h2 className="text-[17px] font-extrabold tracking-[-0.05em] text-[#12201d]">{user?.fullName}</h2>
            <p className="mt-1 text-[9px] text-[#5b6d68]">Account created {user ? new Date(user.createdAt).toLocaleDateString() : ""}</p>
          </div>
        </div>

        <h3 className="mb-4 mt-6 text-[12px] font-extrabold text-[#123d33]">Contact details</h3>
        <div className="grid md:grid-cols-2 md:gap-x-4">
          <Field label="Full name" placeholder="Your full name" name="fullName" defaultValue={user?.fullName} autoComplete="name" required />
          <Field label="Phone number" placeholder="+255 754 123 456" type="tel" name="phone" defaultValue={user?.phone} autoComplete="tel" required icon="phone" />
          <Field label="Email address" placeholder="you@example.com" type="email" name="email" defaultValue={user?.email ?? ""} autoComplete="email" />
        </div>

        <h3 className="mb-1 mt-3 text-[12px] font-extrabold text-[#123d33]">Change password</h3>
        <p className="mb-4 text-[9px] text-[#73817c]">Leave all password fields blank to keep your current password.</p>
        <div className="grid md:grid-cols-2 md:gap-x-4">
          <Field label="Current password" placeholder="Enter current password" type="password" name="currentPassword" autoComplete="current-password" icon="lock" />
          <span className="hidden md:block" />
          <Field label="New password" placeholder="At least 8 characters" type="password" name="newPassword" autoComplete="new-password" icon="lock" />
          <Field label="Confirm new password" placeholder="Repeat new password" type="password" name="confirmPassword" autoComplete="new-password" icon="lock" />
        </div>

        {error && <p role="alert" className="mb-3 text-[11px] text-[#c84a3e]">{error}</p>}
        {message && <p role="status" className="mb-3 text-[11px] text-[#20835b]">{message}</p>}
        <Button type="submit" disabled={saving} className="mt-2 min-h-[42px]">
          <Icon name="check" size={16} /> {saving ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </section>
  );
}

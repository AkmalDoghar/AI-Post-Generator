"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordForm() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const endpoint = step === "email" ? "request" : step === "otp" ? "verify" : "reset";
      const body = step === "email" ? { email } : step === "otp" ? { otp } : { password, confirmPassword };
      if (step === "reset" && password !== confirmPassword) throw new Error("Passwords do not match.");
      const response = await fetch(`/api/auth/forgot-password/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Something went wrong. Please try again.");

      if (step === "email") {
        setStep("otp");
        setMessage("If an account exists for that email, a verification code has been sent.");
      } else if (step === "otp") {
        setStep("reset");
        setMessage("Email verified. Choose a new password.");
      } else {
        setStep("complete");
        setMessage("Your password has been updated successfully.");
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card w-full max-w-md rounded-2xl border border-orange-200/15 bg-[#171719] p-5 shadow-xl shadow-orange-950/30 sm:p-6">
      <p className="text-xs uppercase tracking-[0.25em] text-orange-300">Account recovery</p>
      <h1 className="mt-1.5 text-2xl font-bold text-white">Reset your password</h1>
      <p className="mt-1.5 text-sm leading-5 text-slate-400">Verify your email and get back to your workspace.</p>

      {message && <div role="status" className="mt-5 rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">{message}</div>}
      {error && <div role="alert" className="mt-5 rounded-xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</div>}

      {step === "complete" ? (
        <Link href="/login" className="mt-6 block w-full rounded-xl bg-orange-300 px-4 py-3 text-center font-semibold text-slate-950 transition hover:bg-orange-200">Back to login</Link>
      ) : (
        <form onSubmit={submit} className="mt-5 space-y-4">
          {step === "email" && <label className="block text-sm font-medium text-slate-200">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-orange-300 focus:ring-2 focus:ring-orange-400/20" /></label>}
          {step === "otp" && <label className="block text-sm font-medium text-slate-200">Verification code<input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} placeholder="123456" className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-center text-xl tracking-[0.35em] text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-orange-300 focus:ring-2 focus:ring-orange-400/20" /></label>}
          {step === "reset" && <>
            <label className="block text-sm font-medium text-slate-200">New password<input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-slate-100 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-400/20" /></label>
            <label className="block text-sm font-medium text-slate-200">Confirm password<input required minLength={8} type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-slate-100 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-400/20" /></label>
          </>}
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-orange-300 px-4 py-3 font-semibold text-slate-950 transition hover:bg-orange-200 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Please wait..." : step === "email" ? "Send verification code" : step === "otp" ? "Verify code" : "Update password"}</button>
        </form>
      )}

      {step !== "complete" && <Link href="/login" className="mt-5 block text-center text-sm text-slate-400 transition hover:text-orange-200">Back to login</Link>}
    </div>
  );
}

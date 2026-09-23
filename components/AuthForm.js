"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getPasswordStrength(password) {
  if (!password) return { label: "", width: "0%", color: "bg-slate-700" };
  const score = [password.length >= 8, /[A-Z]/.test(password), /\d/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length;
  if (score <= 1) return { label: "Needs work", width: "25%", color: "bg-red-400" };
  if (score === 2) return { label: "Fair", width: "50%", color: "bg-amber-300" };
  if (score === 3) return { label: "Good", width: "75%", color: "bg-cyan-300" };
  return { label: "Strong", width: "100%", color: "bg-emerald-300" };
}

export default function AuthForm({ mode, variant = "default" }) {
  const isSignup = mode === "signup";
  const isLoginVariant = variant === "login";
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const strength = getPasswordStrength(password);

  function validate() {
    const nextErrors = {};
    if (isSignup && name.trim().length < 2) nextErrors.name = "Please enter your full name.";
    if (!emailPattern.test(email.trim())) nextErrors.email = "Please enter a valid email address.";
    if (!password) nextErrors.password = "Password is required.";
    else if (password.length < 8) nextErrors.password = "Password must be at least 8 characters.";
    if (isSignup && !confirmPassword) nextErrors.confirmPassword = "Please confirm your password.";
    else if (isSignup && password !== confirmPassword) nextErrors.confirmPassword = "Passwords do not match.";
    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;
    const nextErrors = validate();
    setErrors(nextErrors);
    setServerError("");
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/auth/${isSignup ? "signup" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      router.replace(isSignup ? "/login" : (searchParams.get("next") || "/dashboard"));
      router.refresh();
    } catch (error) {
      setServerError(error.message || "Unable to complete authentication.");
    } finally {
      setLoading(false);
    }
  }

  function handleGitHub() {
    if (!loading) window.location.assign("/api/auth/github");
  }

  const queryError = searchParams.get("error");
  const githubError = queryError === "github_not_configured"
    ? "GitHub sign-in is not configured yet. Use email and password instead."
    : queryError === "github_failed"
      ? "GitHub sign-in could not be completed. Please try again."
      : "";
  const forgotMessage = searchParams.get("forgot") === "1"
    ? "Password reset is not configured yet. Contact your workspace administrator."
    : "";

  return (
    <div className="auth-card w-full max-w-md rounded-2xl border p-5 shadow-xl sm:p-6" style={{ background: "rgba(10,22,18,0.9)", borderColor: "rgba(52,211,153,0.15)", boxShadow: "0 24px 70px rgba(0,0,0,0.4)", backdropFilter: "blur(20px)" }}>
      <div className="mb-5">
        <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.22em", color: "#34d399" }}>{isSignup ? "Start building" : "Welcome back"}</p>
        <h2 className="mt-1.5 text-2xl font-bold" style={{ color: "#f0faf8" }}>{isSignup ? "Create your account" : "Sign in to GitPulse"}</h2>
        <p className="mt-1.5 text-sm leading-5" style={{ color: "#4a7a70" }}>{isSignup ? "Create your workspace in a few seconds." : "Log in to continue to your workspace."}</p>
      </div>

      {(serverError || githubError || forgotMessage) && <div role="alert" className={`mb-5 rounded-xl border px-4 py-3 text-sm ${forgotMessage && !serverError && !githubError ? "border-cyan-400/25 bg-cyan-400/10 text-cyan-100" : "border-red-400/25 bg-red-400/10 text-red-100"}`}>{serverError || githubError || forgotMessage}</div>}

      <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
        {isSignup && <Field label="Full name" id="name" value={name} onChange={setName} error={errors.name} autoComplete="name" placeholder="Ada Lovelace" />}
        <Field label="Email" id="email" type="email" value={email} onChange={setEmail} error={errors.email} autoComplete="email" placeholder="you@example.com" />
        <PasswordField label="Password" id="password" value={password} onChange={setPassword} visible={showPassword} setVisible={setShowPassword} error={errors.password} autoComplete={isSignup ? "new-password" : "current-password"} />
        {isSignup && <>
          <div className="space-y-2">
            <PasswordField label="Confirm password" id="confirm-password" value={confirmPassword} onChange={setConfirmPassword} visible={showConfirmPassword} setVisible={setShowConfirmPassword} error={errors.confirmPassword} autoComplete="new-password" />
            {password && <div aria-label={`Password strength: ${strength.label}`} className="space-y-1"><div className="h-1.5 overflow-hidden rounded-full bg-slate-800"><div className={`h-full ${strength.color} transition-all`} style={{ width: strength.width }} /></div><p className="text-xs text-slate-500">Password strength: {strength.label}</p></div>}
          </div>
        </>}
        {!isSignup && <div className="flex justify-end"><Link href="/forgot-password" className="text-sm text-cyan-300 transition hover:text-cyan-200">Forgot password?</Link></div>}
        <button type="submit" disabled={loading} style={{ width: "100%", borderRadius: "0.75rem", padding: "0.75rem 1rem", fontWeight: 700, color: "#051a12", background: "linear-gradient(135deg, #34d399, #22d3ee)", boxShadow: "0 10px 28px rgba(52,211,153,0.22)", transition: "transform 0.2s, box-shadow 0.2s", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }} onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 14px 36px rgba(52,211,153,0.34)"; }}} onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(52,211,153,0.22)"; }}>{loading ? (isSignup ? "Creating account..." : "Signing in...") : (isSignup ? "Create account" : "Log in")}</button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-500"><span className="h-px flex-1 bg-white/10" />or<span className="h-px flex-1 bg-white/10" /></div>
      <button type="button" onClick={handleGitHub} disabled={loading} style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "center", gap: "0.6rem", borderRadius: "0.75rem", border: "1px solid rgba(52,211,153,0.15)", padding: "0.72rem 1rem", fontSize: "0.85rem", fontWeight: 500, color: "#c8f0e6", background: "rgba(52,211,153,0.04)", transition: "background 0.2s, border-color 0.2s", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(52,211,153,0.09)"; e.currentTarget.style.borderColor = "rgba(52,211,153,0.3)"; }} onMouseLeave={e => { e.currentTarget.style.background = "rgba(52,211,153,0.04)"; e.currentTarget.style.borderColor = "rgba(52,211,153,0.15)"; }}>
        <GitHubIcon />
        Continue with GitHub
      </button>

      <p style={{ marginTop: "1.25rem", textAlign: "center", fontSize: "0.8rem", color: "#3a5e56" }}>{isSignup ? "Already have an account?" : "Don't have an account?"} <Link href={isSignup ? "/login" : "/signup"} style={{ color: "#34d399", fontWeight: 600 }}>{isSignup ? "Log in" : "Sign up"}</Link></p>
    </div>
  );
}

function Field({ label, id, type = "text", value, onChange, error, ...props }) {
  return <div className="space-y-1.5"><label htmlFor={id} className="block text-sm font-medium text-slate-200">{label}</label><input id={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20" {...props} />{error && <p id={`${id}-error`} className="text-sm text-red-300">{error}</p>}</div>;
}

function PasswordField({ label, id, value, onChange, visible, setVisible, error, ...props }) {
  return <div className="space-y-1.5"><label htmlFor={id} className="block text-sm font-medium text-slate-200">{label}</label><div className="relative"><input id={id} type={visible ? "text" : "password"} value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5 pr-20 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20" {...props} /><button type="button" onClick={() => setVisible((current) => !current)} aria-pressed={visible} aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`} className="absolute inset-y-0 right-3 rounded px-2 text-xs text-slate-400 hover:bg-white/5 hover:text-white">{visible ? "Hide" : "Show"}</button></div>{error && <p id={`${id}-error`} className="text-sm text-red-300">{error}</p>}</div>;
}

function GitHubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.22-3.37-1.22-.46-1.2-1.11-1.52-1.11-1.52-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.58 2.35 1.12 2.92.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.02-2.75-.1-.26-.44-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.2 9.2 0 0 1 12 7.1c.85 0 1.7.12 2.49.36 1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.21 2.45.11 2.71.64.72 1.02 1.63 1.02 2.75 0 3.93-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9v2.81c0 .27.18.6.69.49A10.25 10.25 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";

const inputStyle = {
  display: "block",
  width: "100%",
  marginTop: "0.5rem",
  borderRadius: "0.75rem",
  border: "1px solid rgba(52,211,153,0.12)",
  background: "rgba(5,20,16,0.8)",
  padding: "0.72rem 1rem",
  color: "#e8f5f2",
  outline: "none",
  fontSize: "0.88rem",
  transition: "border-color 0.2s",
};

const labelStyle = {
  display: "block",
  fontSize: "0.78rem",
  fontWeight: 600,
  color: "#7ab8a8",
};

const steps = ["email", "otp", "reset", "complete"];
const stepLabels = ["Enter email", "Verify code", "New password", "Done"];

export default function ForgotPasswordForm() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const currentStepIndex = steps.indexOf(step);

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
    <div style={{
      background: "rgba(10,22,18,0.9)",
      border: "1px solid rgba(52,211,153,0.15)",
      borderRadius: "1.25rem",
      padding: "2rem",
      boxShadow: "0 24px 70px rgba(0,0,0,0.4)",
      backdropFilter: "blur(20px)",
    }}>
      {/* Step progress */}
      <div style={{ display: "flex", alignItems: "center", gap: "0", marginBottom: "1.75rem" }}>
        {stepLabels.map((label, i) => {
          const done = i < currentStepIndex;
          const active = i === currentStepIndex;
          return (
            <div key={label} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
                <div style={{
                  width: "1.75rem", height: "1.75rem", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.65rem", fontWeight: 700,
                  background: done || active
                    ? "linear-gradient(135deg, #34d399, #22d3ee)"
                    : "rgba(52,211,153,0.08)",
                  border: `1px solid ${done || active ? "transparent" : "rgba(52,211,153,0.12)"}`,
                  color: done || active ? "#051a12" : "#2a4540",
                  transition: "all 0.3s",
                }}>
                  {done ? "✓" : i + 1}
                </div>
                <span style={{
                  fontSize: "0.58rem", color: active ? "#34d399" : done ? "#22d3ee" : "#2a4540",
                  whiteSpace: "nowrap", fontWeight: active ? 700 : 500,
                }}>
                  {label}
                </span>
              </div>
              {i < stepLabels.length - 1 && (
                <div style={{
                  flex: 1, height: "1px",
                  background: i < currentStepIndex
                    ? "linear-gradient(90deg, #34d399, #22d3ee)"
                    : "rgba(52,211,153,0.1)",
                  margin: "0 0.3rem", marginBottom: "1.2rem",
                  transition: "background 0.3s",
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Header */}
      <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#34d399", marginBottom: "0.5rem" }}>
        Account recovery
      </p>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#f0faf8", margin: "0 0 0.4rem" }}>
        Reset your password
      </h1>
      <p style={{ color: "#4a7a70", fontSize: "0.82rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
        Verify your email and get back to your workspace.
      </p>

      {/* Messages */}
      {message && (
        <div style={{
          marginBottom: "1.25rem", padding: "0.8rem 1rem", borderRadius: "0.75rem",
          background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)",
          color: "#a7f3d0", fontSize: "0.8rem", lineHeight: 1.5,
        }} role="status">{message}</div>
      )}
      {error && (
        <div style={{
          marginBottom: "1.25rem", padding: "0.8rem 1rem", borderRadius: "0.75rem",
          background: "rgba(239,68,68,0.08)", border: "1px solid rgba(248,113,113,0.2)",
          color: "#fca5a5", fontSize: "0.8rem",
        }} role="alert">{error}</div>
      )}

      {/* Form */}
      {step === "complete" ? (
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "3.5rem", height: "3.5rem", borderRadius: "50%", margin: "0 auto 1rem",
            background: "linear-gradient(135deg, #34d399, #22d3ee)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.5rem", color: "#051a12",
          }}>✓</div>
          <p style={{ color: "#a7f3d0", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
            Password updated successfully!
          </p>
          <Link href="/login" style={{
            display: "block", textAlign: "center", padding: "0.8rem 1rem",
            borderRadius: "0.75rem", fontWeight: 700, fontSize: "0.88rem",
            background: "linear-gradient(135deg, #34d399, #22d3ee)",
            color: "#051a12", boxShadow: "0 8px 24px rgba(52,211,153,0.25)",
          }}>
            Back to login →
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {step === "email" && (
            <label>
              <span style={labelStyle}>Email address</span>
              <input
                required type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "rgba(52,211,153,0.45)"}
                onBlur={e => e.target.style.borderColor = "rgba(52,211,153,0.12)"}
              />
            </label>
          )}

          {step === "otp" && (
            <div>
              <label style={labelStyle}>Verification code</label>
              <p style={{ color: "#2a5a4a", fontSize: "0.72rem", marginBottom: "0.5rem" }}>
                Check your email at <strong style={{ color: "#34d399" }}>{email}</strong>
              </p>
              <input
                required inputMode="numeric" pattern="[0-9]{6}" maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                style={{
                  ...inputStyle,
                  textAlign: "center", fontSize: "1.5rem",
                  letterSpacing: "0.4em", fontWeight: 700,
                }}
                onFocus={e => e.target.style.borderColor = "rgba(52,211,153,0.45)"}
                onBlur={e => e.target.style.borderColor = "rgba(52,211,153,0.12)"}
              />
            </div>
          )}

          {step === "reset" && (
            <>
              <label>
                <span style={labelStyle}>New password</span>
                <input
                  required minLength={8} type="password" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "rgba(52,211,153,0.45)"}
                  onBlur={e => e.target.style.borderColor = "rgba(52,211,153,0.12)"}
                />
              </label>
              <label>
                <span style={labelStyle}>Confirm password</span>
                <input
                  required minLength={8} type="password" value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your new password"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "rgba(52,211,153,0.45)"}
                  onBlur={e => e.target.style.borderColor = "rgba(52,211,153,0.12)"}
                />
              </label>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", borderRadius: "0.75rem",
              padding: "0.8rem 1rem", fontWeight: 700,
              color: "#051a12",
              background: loading ? "rgba(52,211,153,0.4)" : "linear-gradient(135deg, #34d399, #22d3ee)",
              boxShadow: "0 10px 28px rgba(52,211,153,0.2)",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "0.88rem", transition: "transform 0.2s, box-shadow 0.2s",
              border: "none",
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 14px 36px rgba(52,211,153,0.32)"; }}}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(52,211,153,0.2)"; }}
          >
            {loading ? "Please wait…" : step === "email" ? "Send verification code" : step === "otp" ? "Verify & continue" : "Update password"}
          </button>

          {step !== "complete" && (
            <Link href="/login" style={{
              display: "block", textAlign: "center",
              fontSize: "0.75rem", color: "#2a5a4a",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.color = "#34d399"}
              onMouseLeave={e => e.currentTarget.style.color = "#2a5a4a"}
            >
              ← Back to login
            </Link>
          )}
        </form>
      )}
    </div>
  );
}

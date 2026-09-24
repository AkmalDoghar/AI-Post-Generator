import { Suspense } from "react";
import AuthForm from "../../components/AuthForm";
import BrandLogo from "../../components/BrandLogo";

const steps = [
  { n: "01", title: "Connect GitHub", desc: "Link your account — takes 30 seconds." },
  { n: "02", title: "AI Finds the Story", desc: "7 angles analyzed, strongest one suggested." },
  { n: "03", title: "Pick a Draft", desc: "3 variations — choose what fits your voice." },
  { n: "04", title: "Review & Share", desc: "Nothing posts automatically. Always your call." },
];

export default function SignupPage() {
  return (
    <main className="auth-layout auth-layout-signup" style={{
      minHeight: "100vh",
      background: "#050d0b",
      display: "flex",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'DM Sans','Inter',sans-serif",
    }}>
      {/* Ambient blobs */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", top: "-15%", left: "-10%",
          width: "50vw", height: "50vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(52,211,153,0.1) 0%, transparent 70%)",
          filter: "blur(80px)", animation: "blob1 14s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "-10%", right: "-10%",
          width: "40vw", height: "40vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%)",
          filter: "blur(70px)", animation: "blob2 18s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(52,211,153,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />
      </div>

      {/* Left Panel — Form */}
      <div className="auth-layout-form auth-layout-signup-form" style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "3rem 2rem", position: "relative", zIndex: 1,
        borderRight: "1px solid rgba(52,211,153,0.08)",
      }}>
        <div style={{ width: "min(100%, 26rem)" }}>
          <div style={{ marginBottom: "2rem" }}>
            <BrandLogo href="/" />
          </div>
          <Suspense fallback={<div style={{ height: "400px" }} />}>
            <AuthForm mode="signup" />
          </Suspense>
          <p style={{ marginTop: "1rem", textAlign: "center", color: "#2a4540", fontSize: "0.7rem" }}>
            Your drafts stay yours until you choose to share them
          </p>
        </div>
      </div>

      {/* Right Panel — Social Proof / Steps */}
      <div className="auth-layout-side auth-layout-signup-side" style={{
        flex: "0 0 46%", minHeight: "100vh", padding: "3.5rem 4rem",
        display: "flex", flexDirection: "column", justifyContent: "center",
        position: "relative", zIndex: 1,
      }}>
        <div style={{ maxWidth: "28rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            padding: "0.35rem 0.8rem", borderRadius: "999px",
            background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.18)",
            color: "#34d399", fontSize: "0.65rem", fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.5rem",
          }}>
            <span style={{
              width: "0.38rem", height: "0.38rem", borderRadius: "50%",
              background: "#34d399", animation: "pulse 2s ease-in-out infinite",
            }} />
            Start in seconds
          </div>

          <h2 style={{
            fontFamily: "'Space Grotesk','Inter',sans-serif",
            fontSize: "clamp(2rem, 3.5vw, 3.5rem)",
            fontWeight: 700, letterSpacing: "-0.055em",
            lineHeight: 0.95, color: "#f0faf8", margin: "0 0 1.25rem",
          }}>
            Make your work<br />
            <span style={{
              fontFamily: "Georgia,serif", fontStyle: "italic", fontWeight: 400,
              background: "linear-gradient(90deg, #34d399, #22d3ee)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>worth following.</span>
          </h2>

          <p style={{ color: "#4a7a70", fontSize: "0.85rem", lineHeight: 1.65, marginBottom: "2.5rem" }}>
            Create a focused workspace that turns your GitHub activity into clear, human social posts.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {steps.map((step) => (
              <div key={step.n} style={{
                display: "flex", alignItems: "flex-start", gap: "1rem",
                padding: "1rem 1.1rem",
                background: "rgba(52,211,153,0.04)",
                border: "1px solid rgba(52,211,153,0.08)",
                borderRadius: "0.85rem",
              }}>
                <div style={{
                  width: "1.85rem", height: "1.85rem", borderRadius: "0.45rem",
                  background: "linear-gradient(135deg, #34d399, #22d3ee)",
                  color: "#051a12", fontWeight: 700, fontSize: "0.68rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {step.n}
                </div>
                <div>
                  <div style={{ color: "#c8f0e6", fontWeight: 600, fontSize: "0.82rem", marginBottom: "0.2rem" }}>
                    {step.title}
                  </div>
                  <div style={{ color: "#4a7a70", fontSize: "0.74rem", lineHeight: 1.5 }}>
                    {step.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(3%,4%) scale(1.07)} }
        @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-4%,-3%) scale(0.94)} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 3px rgba(52,211,153,0.2)} 50%{box-shadow:0 0 0 6px rgba(52,211,153,0.06)} }
        @media(max-width:860px){
          main > div:last-of-type { display:none!important; }
        }
      `}</style>
    </main>
  );
}
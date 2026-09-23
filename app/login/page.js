import { Suspense } from "react";
import AuthForm from "../../components/AuthForm";
import BrandLogo from "../../components/BrandLogo";
import Link from "next/link";

const features = [
  { icon: "🧠", text: "7 Story Angles — AI picks the strongest" },
  { icon: "✍️", text: "3 draft variations per post" },
  { icon: "🛡️", text: "Zero hallucinated metrics — fact-verified" },
  { icon: "🎯", text: "Manual review only — you stay in control" },
];

export default function LoginPage() {
  return (
    <main style={{
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
          position: "absolute", top: "-15%", right: "-10%",
          width: "50vw", height: "50vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%)",
          filter: "blur(70px)",
          animation: "blob1 14s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "-10%", left: "-10%",
          width: "40vw", height: "40vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "blob2 18s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: "linear-gradient(rgba(52,211,153,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />
      </div>

      {/* Left Panel — Brand Info */}
      <div style={{
        flex: "0 0 46%", minHeight: "100vh", padding: "3.5rem 4rem",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        position: "relative", zIndex: 1,
        borderRight: "1px solid rgba(52,211,153,0.08)",
      }}>
        <div>
          <BrandLogo href="/" />
        </div>

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
              background: "#34d399", boxShadow: "0 0 0 3px rgba(52,211,153,0.2)",
              animation: "pulse 2s ease-in-out infinite",
            }} />
            Workspace ready
          </div>

          <h1 style={{
            fontFamily: "'Space Grotesk','Inter',sans-serif",
            fontSize: "clamp(2.5rem, 4vw, 4rem)",
            fontWeight: 700,
            letterSpacing: "-0.06em",
            lineHeight: 0.95,
            color: "#f0faf8",
            margin: "0 0 1.5rem",
          }}>
            Ship the update.<br />
            <span style={{
              fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 400,
              background: "linear-gradient(90deg, #34d399, #22d3ee)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>Share the momentum.</span>
          </h1>

          <p style={{ color: "#4a7a70", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "2rem" }}>
            Turn GitHub activity into clear, human social posts without losing the developer behind the work.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {features.map((f) => (
              <div key={f.text} style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.75rem 1rem",
                background: "rgba(52,211,153,0.04)",
                border: "1px solid rgba(52,211,153,0.08)",
                borderRadius: "0.7rem",
                fontSize: "0.78rem", color: "#5a8a80",
              }}>
                <span style={{ fontSize: "1rem" }}>{f.icon}</span>
                {f.text}
              </div>
            ))}
          </div>
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: "0.75rem",
          color: "#2a4540", fontSize: "0.68rem",
        }}>
          <span style={{
            width: "0.4rem", height: "0.4rem", borderRadius: "50%",
            background: "#34d399", boxShadow: "0 0 0 3px rgba(52,211,153,0.12)",
          }} />
          Private workspace · Nothing posts automatically
        </div>
      </div>

      {/* Right Panel — Form */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "3rem 2rem", position: "relative", zIndex: 1,
      }}>
        <div style={{ width: "min(100%, 26rem)" }}>
          <Suspense fallback={<div style={{ height: "400px" }} />}>
            <AuthForm mode="login" variant="login" />
          </Suspense>
          <p style={{ marginTop: "1rem", textAlign: "center", color: "#2a4540", fontSize: "0.7rem" }}>
            Private workspace · Review everything before you share
          </p>
        </div>
      </div>

      <style>{`
        @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-3%,4%) scale(1.07)} }
        @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(4%,-3%) scale(0.94)} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 3px rgba(52,211,153,0.2)} 50%{box-shadow:0 0 0 6px rgba(52,211,153,0.06)} }
        @media(max-width:860px){
          main > div:first-of-type { display:none!important; }
        }
      `}</style>
    </main>
  );
}

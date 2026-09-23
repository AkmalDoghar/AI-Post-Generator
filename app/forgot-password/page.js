import ForgotPasswordForm from "../../components/ForgotPasswordForm";
import BrandLogo from "../../components/BrandLogo";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#050d0b",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'DM Sans','Inter',sans-serif",
      padding: "2rem",
    }}>
      {/* Ambient blobs */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", top: "-20%", right: "-10%",
          width: "50vw", height: "50vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(52,211,153,0.1) 0%, transparent 70%)",
          filter: "blur(80px)", animation: "blob1 14s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "-15%", left: "-10%",
          width: "40vw", height: "40vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)",
          filter: "blur(70px)", animation: "blob2 18s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(52,211,153,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "min(100%, 26rem)" }}>
        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
          <BrandLogo href="/" />
        </div>

        <ForgotPasswordForm />

        <p style={{ marginTop: "1.25rem", textAlign: "center", color: "#2a4540", fontSize: "0.68rem" }}>
          Verification codes expire after 10 minutes ·{" "}
          <Link href="/login" style={{ color: "#34d399" }}>Back to login</Link>
        </p>
      </div>

      <style>{`
        @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-3%,4%) scale(1.07)} }
        @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(4%,-3%) scale(0.94)} }
      `}</style>
    </main>
  );
}

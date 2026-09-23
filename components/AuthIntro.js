import BrandLogo from "./BrandLogo";

export default function AuthIntro({ mode = "login" }) {
  const isSignup = mode === "signup";

  return (
    <section className="login-intro">
      {/* Logo — bigger and more prominent */}
      <div style={{ marginBottom: "0.5rem" }}>
        <BrandLogo href="/" />
      </div>

      <div className="login-intro-copy">
        <p className="login-eyebrow" style={{ color: "#34d399" }}>
          {isSignup ? "A better way to share progress" : "Your work has a story"}
        </p>

        <h1>
          {isSignup
            ? <><span>Make your work<br /></span><em>worth following.</em></>
            : <><span>Ship the update.<br /></span><em>Share the momentum.</em></>
          }
        </h1>

        <p style={{ color: "#6a8a84", maxWidth: "26rem", lineHeight: 1.65, fontSize: "0.95rem", marginTop: "1.5rem" }}>
          {isSignup
            ? "Create a focused workspace that turns your GitHub activity into clear, human social posts."
            : "Turn GitHub activity into clear, human social posts without losing the developer behind the work."}
        </p>

        {/* Feature dots */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", marginTop: "2rem" }}>
          {[
            "7 Story Angles — AI picks the strongest",
            "3 Draft Variations per post",
            "Fact-verified — zero hallucinated metrics",
            "Manual review only — nothing posts automatically",
          ].map((feat) => (
            <div key={feat} style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.75rem", color: "#7a9a94" }}>
              <span style={{
                width: "0.4rem", height: "0.4rem", borderRadius: "50%",
                background: "linear-gradient(135deg, #34d399, #22d3ee)",
                flexShrink: 0,
              }} />
              {feat}
            </div>
          ))}
        </div>
      </div>

      <div className="login-signal">
        <span className="login-signal-dot" style={{ background: "#34d399", boxShadow: "0 0 0 4px rgba(52,211,153,0.12)" }} />
        {isSignup ? "Start in seconds" : "Workspace ready"}
        <span className="login-signal-line" />
        Private by default
      </div>
    </section>
  );
}

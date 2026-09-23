import Link from "next/link";
import ActivityOrbit from "../../components/ActivityOrbit";
import MarketingHeader from "../../components/MarketingHeader";
import BrandLogo from "../../components/BrandLogo";

const activity = [
  { label: "Commits analyzed", value: "24", pct: "92%", color: "#34d399", tone: "feat / fix ratio" },
  { label: "Pull requests", value: "06", pct: "68%", color: "#22d3ee", tone: "merged & reviewed" },
  { label: "New repositories", value: "02", pct: "44%", color: "#a78bfa", tone: "standalone modules" },
];

export default function SignalPage() {
  return (
    <main className="gp-landing">
      <style>{`
        .gp-landing {
          min-height: 100vh;
          background: #050d0b;
          color: #e8f5f2;
          font-family: 'DM Sans','Inter',sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        .gp-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden;
        }
        .gp-bg-blob {
          position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.3;
          animation: blob-drift 14s ease-in-out infinite;
        }
        .gp-bg-blob-1 {
          width: 50vw; height: 50vw; background: radial-gradient(circle, #22d3ee 0%, transparent 70%);
          top: -15%; right: -10%;
        }
        .gp-bg-blob-2 {
          width: 45vw; height: 45vw; background: radial-gradient(circle, #34d399 0%, transparent 70%);
          bottom: -15%; left: -10%; animation-delay: -7s;
        }
        @keyframes blob-drift {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(4%, -3%) scale(1.06); }
        }

        .gp-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(52,211,153,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(52,211,153,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .gp-shell {
          width: min(100% - 2.5rem, 88rem); margin: 0 auto; position: relative; z-index: 1;
        }

        .gp-header {
          display: flex; align-items: center; justify-content: space-between; padding: 1.75rem 0;
        }
        .gp-nav { display: flex; gap: 2.25rem; }
        .gp-nav a { color: #6a9e90; font-size: 0.82rem; transition: color 0.2s; }
        .gp-nav a:hover { color: #e8f5f2; }
        .gp-header-actions { display: flex; align-items: center; gap: 1.25rem; }
        .gp-login-link { color: #6a9e90; font-size: 0.82rem; transition: color 0.2s; }
        .gp-login-link:hover { color: #e8f5f2; }
        .gp-cta-sm {
          display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.55rem 1rem;
          border-radius: 0.6rem; background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.25);
          color: #34d399; font-size: 0.78rem; font-weight: 600; transition: all 0.2s;
        }
        .gp-cta-sm:hover { background: rgba(52,211,153,0.18); transform: translateY(-1px); }

        .sig-hero {
          display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;
          padding: 4.5rem 0 5rem;
        }
        .sig-eyebrow {
          display: inline-flex; align-items: center; gap: 0.55rem; padding: 0.38rem 0.85rem;
          border-radius: 999px; background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.18);
          color: #34d399; font-size: 0.67rem; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; margin-bottom: 1.5rem;
        }
        .sig-dot {
          width: 0.42rem; height: 0.42rem; border-radius: 50%; background: #34d399;
          box-shadow: 0 0 0 3px rgba(52,211,153,0.2);
        }
        .sig-h1 {
          font-family: 'Space Grotesk',sans-serif; font-size: clamp(3rem, 5vw, 5.5rem);
          font-weight: 700; letter-spacing: -0.06em; line-height: 0.94; color: #f0faf8;
          margin: 0 0 1.5rem;
        }
        .sig-h1 em {
          font-style: normal;
          background: linear-gradient(100deg, #34d399, #22d3ee);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .sig-lede {
          color: #4a7a70; font-size: 1rem; line-height: 1.7; max-width: 28rem; margin-bottom: 2rem;
        }
        .sig-visual-card {
          background: rgba(52,211,153,0.04); border: 1px solid rgba(52,211,153,0.15);
          border-radius: 1.25rem; min-height: 27rem; overflow: hidden; padding: 1.25rem;
          position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        }
        .sig-visual-card::before {
          content: ''; position: absolute; inset: 0;
          background-image: linear-gradient(rgba(52,211,153,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.03) 1px, transparent 1px);
          background-size: 32px 32px; pointer-events: none;
        }
        .sig-vheader, .sig-vfooter {
          display: flex; align-items: center; justify-content: space-between;
          font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase;
          position: relative; z-index: 2;
        }
        .sig-vheader { color: #34d399; font-weight: 700; }
        .sig-vfooter { color: #4a7a70; padding-top: 1rem; border-top: 1px solid rgba(52,211,153,0.08); }

        .sig-metrics-section {
          padding: 5rem 0 7rem; border-top: 1px solid rgba(52,211,153,0.08);
          display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 4rem; align-items: start;
        }
        .sig-section-h2 {
          font-family: 'Space Grotesk',sans-serif; font-size: clamp(2.2rem, 4vw, 4rem);
          font-weight: 600; letter-spacing: -0.05em; color: #f0faf8; margin-bottom: 1.5rem;
          line-height: 0.95;
        }
        .sig-section-h2 em {
          font-style: normal; background: linear-gradient(90deg, #34d399, #22d3ee);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .sig-metric-grid {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;
        }
        .sig-mcard {
          background: rgba(52,211,153,0.03); border: 1px solid rgba(52,211,153,0.1);
          border-radius: 1rem; padding: 1.25rem; transition: all 0.2s;
        }
        .sig-mcard:hover {
          background: rgba(52,211,153,0.07); border-color: rgba(52,211,153,0.2);
          transform: translateY(-2px);
        }
        .sig-bar-bg {
          height: 0.35rem; border-radius: 999px; background: rgba(52,211,153,0.1);
          margin: 1.2rem 0 0.6rem; overflow: hidden;
        }

        .sig-insight-card {
          grid-column: 1 / -1;
          background: linear-gradient(135deg, rgba(52,211,153,0.08), rgba(34,211,238,0.05));
          border: 1px solid rgba(52,211,153,0.2); border-radius: 1rem; padding: 1.5rem;
        }

        .gp-footer {
          border-top: 1px solid rgba(52,211,153,0.08); padding: 2rem 0;
          display: flex; align-items: center; justify-content: space-between;
        }
        .gp-footer-links { display: flex; gap: 1.75rem; }
        .gp-footer-links a { color: #3a5e56; font-size: 0.72rem; transition: color 0.2s; }
        .gp-footer-links a:hover { color: #34d399; }

        @media (max-width: 860px) {
          .sig-hero { grid-template-columns: 1fr; gap: 3rem; }
          .sig-metrics-section { grid-template-columns: 1fr; gap: 3rem; }
          .sig-metric-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Background */}
      <div className="gp-bg" aria-hidden="true">
        <div className="gp-bg-blob gp-bg-blob-1" />
        <div className="gp-bg-blob gp-bg-blob-2" />
      </div>
      <div className="gp-grid" aria-hidden="true" />

      <div className="gp-shell">
        <MarketingHeader active="signal" />

        {/* Hero */}
        <section className="sig-hero">
          <div>
            <div className="sig-eyebrow">
              <span className="sig-dot" />
              Signal Intelligence
            </div>
            <h1 className="sig-h1">
              See what your<br />
              <em>week is saying.</em>
            </h1>
            <p className="sig-lede">
              GitPulse reads the pattern of your commits, pull requests, and code branches, then finds the compelling human story hiding inside the numbers.
            </p>
            <Link
              href="/signup"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.6rem",
                padding: "0.9rem 1.5rem", borderRadius: "0.8rem",
                background: "linear-gradient(135deg, #34d399, #22d3ee)",
                color: "#051a12", fontWeight: 700, fontSize: "0.9rem",
                boxShadow: "0 10px 30px rgba(52,211,153,0.22)",
                transition: "all 0.2s",
              }}
            >
              Read your signal <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className="sig-visual-card">
            <div className="sig-vheader">
              <span>ACTIVITY PULSE</span>
              <span style={{ color: "#4a7a70" }}>LAST 7 DAYS</span>
            </div>
            <div style={{ height: "21rem", position: "relative" }}>
              <ActivityOrbit />
            </div>
            <div className="sig-vfooter">
              <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span className="sig-dot" style={{ width: "0.38rem", height: "0.38rem" }} />
                Live GitHub Source
              </span>
              <strong style={{ color: "#34d399" }}>+18% shipping momentum</strong>
            </div>
          </div>
        </section>

        {/* Metrics Grid */}
        <section className="sig-metrics-section">
          <div>
            <div className="sig-eyebrow">
              <span className="sig-dot" />
              A Clearer Read
            </div>
            <h2 className="sig-section-h2">
              Not every week<br />
              <em>looks the same.</em>
            </h2>
            <p style={{ color: "#4a7a70", fontSize: "0.9rem", lineHeight: 1.65, maxWidth: "22rem" }}>
              GitPulse turns raw technical events into clear story context so your post sounds like an authentic developer update, not a boring change log.
            </p>
          </div>

          <div className="sig-metric-grid">
            {activity.map((item) => (
              <div className="sig-mcard" key={item.label}>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#4a7a70" }}>
                    {item.label}
                  </span>
                  <strong style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "1.75rem", color: "#f0faf8" }}>
                    {item.value}
                  </strong>
                </div>
                <div className="sig-bar-bg">
                  <div style={{ height: "100%", width: item.pct, background: item.color, borderRadius: "999px" }} />
                </div>
                <div style={{ display: "flex", justifyBetween: "space-between", fontSize: "0.65rem", color: "#34d399" }}>
                  <span>Story potential</span>
                  <span style={{ marginLeft: "auto", color: "#4a7a70" }}>{item.tone}</span>
                </div>
              </div>
            ))}

            <div className="sig-insight-card">
              <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#34d399" }}>
                THIS WEEK&apos;S STORY READ
              </span>
              <strong style={{ display: "block", fontFamily: "'Space Grotesk',sans-serif", fontSize: "1.25rem", color: "#f0faf8", marginTop: "0.5rem" }}>
                You are in a high-momentum shipping rhythm.
              </strong>
              <p style={{ color: "#4a7a70", fontSize: "0.82rem", lineHeight: 1.55, marginTop: "0.4rem" }}>
                Three focused pushes, 6 merged PRs, 1 useful narrative: steady progress that compounds into an impressive build-in-public story.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="gp-footer">
          <BrandLogo compact />
          <div className="gp-footer-links">
            <Link href="/workflow">Workflow</Link>
            <Link href="/signal">Signal</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/login">Log in</Link>
          </div>
          <span style={{ color: "#2a4540", fontSize: "0.68rem" }}>© 2026 GitPulse Studio</span>
        </footer>
      </div>
    </main>
  );
}

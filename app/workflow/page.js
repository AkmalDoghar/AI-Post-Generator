import Link from "next/link";
import MarketingHeader from "../../components/MarketingHeader";
import BrandLogo from "../../components/BrandLogo";

const steps = [
  {
    number: "01",
    tag: "SOURCE",
    title: "Connect the work",
    copy: "Link GitHub and choose the repository activity you want to turn into a compelling story.",
    detail: "Supports public and private repos, commits, PRs, and tags.",
  },
  {
    number: "02",
    tag: "SHAPE",
    title: "Find the thread",
    copy: "GitPulse groups commits, pull requests, and releases into a clear weekly narrative signal.",
    detail: "AI identifies key themes like features, refactors, fixes, or milestones.",
  },
  {
    number: "03",
    tag: "CRAFT",
    title: "Make it yours",
    copy: "Choose a platform format, select 1 of 7 story angles, and pick from 3 draft variations.",
    detail: "Custom tone controls let you match your authentic developer voice.",
  },
  {
    number: "04",
    tag: "PUBLISH",
    title: "Review, then share",
    copy: "Nothing publishes without your explicit approval. You stay in 100% control from draft to post.",
    detail: "Copy to clipboard or post via connected LinkedIn account.",
  },
];

export default function WorkflowPage() {
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
          width: 50vw; height: 50vw; background: radial-gradient(circle, #34d399 0%, transparent 70%);
          top: -15%; right: -10%;
        }
        .gp-bg-blob-2 {
          width: 45vw; height: 45vw; background: radial-gradient(circle, #22d3ee 0%, transparent 70%);
          bottom: -15%; left: -10%; animation-delay: -7s;
        }
        @keyframes blob-drift {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-3%, 4%) scale(1.06); }
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

        .wf-hero {
          display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 4rem; align-items: center;
          padding: 4.5rem 0 5rem;
        }
        .wf-eyebrow {
          display: inline-flex; align-items: center; gap: 0.55rem; padding: 0.38rem 0.85rem;
          border-radius: 999px; background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.18);
          color: #34d399; font-size: 0.67rem; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; margin-bottom: 1.5rem;
        }
        .wf-dot {
          width: 0.42rem; height: 0.42rem; border-radius: 50%; background: #34d399;
          box-shadow: 0 0 0 3px rgba(52,211,153,0.2);
        }
        .wf-h1 {
          font-family: 'Space Grotesk',sans-serif; font-size: clamp(3rem, 5vw, 5.5rem);
          font-weight: 700; letter-spacing: -0.06em; line-height: 0.94; color: #f0faf8;
          margin: 0 0 1.5rem;
        }
        .wf-h1 em {
          font-style: normal;
          background: linear-gradient(100deg, #34d399, #22d3ee);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .wf-lede {
          color: #4a7a70; font-size: 1rem; line-height: 1.7; max-width: 28rem; margin-bottom: 2rem;
        }
        .wf-quote-card {
          background: rgba(52,211,153,0.04); border: 1px solid rgba(52,211,153,0.15);
          border-radius: 1.25rem; padding: 2.5rem; position: relative;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        }
        .wf-quote-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #34d399, #22d3ee); border-radius: 1.25rem 1.25rem 0 0;
        }
        .wf-quote-tag {
          color: #34d399; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.15em;
          text-transform: uppercase; margin-bottom: 1rem; display: block;
        }
        .wf-quote-text {
          font-family: Georgia, serif; font-size: clamp(1.8rem, 3vw, 2.5rem);
          color: #f0faf8; line-height: 1.1; margin-bottom: 1.5rem; font-style: italic;
        }
        .wf-quote-sub { color: #4a7a70; font-size: 0.78rem; }

        .wf-steps-section {
          padding: 5rem 0 7rem; border-top: 1px solid rgba(52,211,153,0.08);
        }
        .wf-section-h2 {
          font-family: 'Space Grotesk',sans-serif; font-size: clamp(2.2rem, 4vw, 4rem);
          font-weight: 600; letter-spacing: -0.05em; color: #f0faf8; margin-bottom: 3.5rem;
        }
        .wf-section-h2 em {
          font-style: normal; background: linear-gradient(90deg, #34d399, #22d3ee);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .wf-timeline-grid {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem;
        }
        .wf-step-card {
          background: rgba(52,211,153,0.03); border: 1px solid rgba(52,211,153,0.1);
          border-radius: 1.1rem; padding: 2rem; transition: all 0.25s;
        }
        .wf-step-card:hover {
          background: rgba(52,211,153,0.07); border-color: rgba(52,211,153,0.22);
          transform: translateY(-3px);
        }
        .wf-step-header {
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;
        }
        .wf-step-num {
          width: 2.2rem; height: 2.2rem; border-radius: 0.6rem;
          background: linear-gradient(135deg, #34d399, #22d3ee); color: #051a12;
          font-weight: 800; font-size: 0.82rem; display: flex; align-items: center; justify-content: center;
        }
        .wf-step-badge {
          color: #22d3ee; font-size: 0.62rem; font-weight: 700; letter-spacing: 0.15em;
          padding: 0.25rem 0.6rem; border-radius: 999px; background: rgba(34,211,238,0.08);
          border: 1px solid rgba(34,211,238,0.15);
        }
        .wf-step-title {
          font-family: 'Space Grotesk',sans-serif; font-size: 1.25rem; font-weight: 600;
          color: #c8f0e6; margin-bottom: 0.6rem;
        }
        .wf-step-copy { color: #4a7a70; font-size: 0.88rem; line-height: 1.6; margin-bottom: 1rem; }
        .wf-step-detail {
          color: #34d399; font-size: 0.72rem; padding-top: 0.8rem;
          border-top: 1px solid rgba(52,211,153,0.08); display: flex; align-items: center; gap: 0.4rem;
        }

        .wf-cta-box {
          background: linear-gradient(135deg, rgba(52,211,153,0.08) 0%, rgba(34,211,238,0.04) 100%);
          border: 1px solid rgba(52,211,153,0.2); border-radius: 1.5rem; padding: 4rem 2rem;
          text-align: center; margin-bottom: 5rem;
        }

        .gp-footer {
          border-top: 1px solid rgba(52,211,153,0.08); padding: 2rem 0;
          display: flex; align-items: center; justify-content: space-between;
        }
        .gp-footer-links { display: flex; gap: 1.75rem; }
        .gp-footer-links a { color: #3a5e56; font-size: 0.72rem; transition: color 0.2s; }
        .gp-footer-links a:hover { color: #34d399; }

        @media (max-width: 860px) {
          .wf-hero { grid-template-columns: 1fr; gap: 3rem; }
          .wf-timeline-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Ambient background */}
      <div className="gp-bg" aria-hidden="true">
        <div className="gp-bg-blob gp-bg-blob-1" />
        <div className="gp-bg-blob gp-bg-blob-2" />
      </div>
      <div className="gp-grid" aria-hidden="true" />

      <div className="gp-shell">
        <MarketingHeader active="workflow" />

        {/* Hero */}
        <section className="wf-hero">
          <div>
            <div className="wf-eyebrow">
              <span className="wf-dot" />
              Signal-to-Story Pipeline
            </div>
            <h1 className="wf-h1">
              A calmer way<br />
              <em>to show up.</em>
            </h1>
            <p className="wf-lede">
              A simple 4-step loop for developers building in public — without turning every update into an exhausting content task.
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
              Build your first story <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className="wf-quote-card">
            <span className="wf-quote-tag">THE GITPULSE PHILOSOPHY</span>
            <div className="wf-quote-text">
              &ldquo;Keep the work real.<br />Make the story clear.&rdquo;
            </div>
            <p className="wf-quote-sub">
              Zero fluff. Zero hallucinated metrics. Authentic progress only.
            </p>
          </div>
        </section>

        {/* Timeline Steps */}
        <section className="wf-steps-section">
          <h2 className="wf-section-h2">
            Four small moves.<br /><em>From commit to context.</em>
          </h2>

          <div className="wf-timeline-grid">
            {steps.map((step) => (
              <div className="wf-step-card" key={step.number}>
                <div className="wf-step-header">
                  <div className="wf-step-num">{step.number}</div>
                  <span className="wf-step-badge">{step.tag}</span>
                </div>
                <div className="wf-step-title">{step.title}</div>
                <p className="wf-step-copy">{step.copy}</p>
                <div className="wf-step-detail">
                  <span style={{ fontSize: "0.8rem" }}>✓</span> {step.detail}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Box */}
        <div className="wf-cta-box">
          <h2 style={{
            fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(2rem, 3.5vw, 3.5rem)",
            fontWeight: 700, color: "#f0faf8", marginBottom: "1rem", letterSpacing: "-0.05em",
          }}>
            Ready to streamline your social workflow?
          </h2>
          <p style={{ color: "#4a7a70", fontSize: "0.95rem", maxWidth: "26rem", margin: "0 auto 2rem" }}>
            Start turning your weekly shipping momentum into engaging posts today.
          </p>
          <Link
            href="/signup"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.6rem",
              padding: "0.95rem 1.75rem", borderRadius: "0.8rem",
              background: "linear-gradient(135deg, #34d399, #22d3ee)",
              color: "#051a12", fontWeight: 700, fontSize: "0.95rem",
              boxShadow: "0 10px 30px rgba(52,211,153,0.25)",
            }}
          >
            Create free workspace <span aria-hidden="true">↗</span>
          </Link>
        </div>

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

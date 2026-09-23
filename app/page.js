"use client";

import Link from "next/link";
import BrandLogo from "../components/BrandLogo";
import ActivityOrbit from "../components/ActivityOrbit";
import { useEffect, useRef } from "react";

const stats = [
  { label: "Commits translated", value: "24+", accent: "#34d399" },
  { label: "Drafts generated", value: "08", accent: "#22d3ee" },
  { label: "Platforms supported", value: "04", accent: "#a78bfa" },
  { label: "Time saved weekly", value: "3h+", accent: "#fb923c" },
];

const features = [
  { icon: "🧠", title: "AI Story Detection", desc: "Finds the real narrative hiding in your commits before you even ask." },
  { icon: "✍️", title: "3 Draft Variations", desc: "Story-driven, Technical, Build-in-public — pick what fits." },
  { icon: "🛡️", title: "Zero Hallucinations", desc: "Every claim is traced back to real GitHub evidence." },
  { icon: "🎯", title: "7 Story Angles", desc: "Product update, Milestone, Learning, Debugging & more." },
];

export default function HomePage() {
  const heroRef = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--mx", `${x}%`);
      el.style.setProperty("--my", `${y}%`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

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

        /* ─── Animated Background ─── */
        .gp-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .gp-bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.35;
          animation: blob-drift 12s ease-in-out infinite;
        }
        .gp-bg-blob-1 {
          width: 55vw; height: 55vw;
          background: radial-gradient(circle, #34d399 0%, transparent 70%);
          top: -20%; right: -15%;
          animation-delay: 0s;
        }
        .gp-bg-blob-2 {
          width: 40vw; height: 40vw;
          background: radial-gradient(circle, #22d3ee 0%, transparent 70%);
          bottom: -10%; left: -12%;
          animation-delay: -5s;
        }
        .gp-bg-blob-3 {
          width: 28vw; height: 28vw;
          background: radial-gradient(circle, #a78bfa 0%, transparent 70%);
          top: 40%; left: 40%;
          animation-delay: -8s;
        }
        @keyframes blob-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(3%, 4%) scale(1.06); }
          66% { transform: translate(-4%, -3%) scale(0.95); }
        }

        /* Grid overlay */
        .gp-grid {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(52,211,153,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(52,211,153,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent);
        }

        /* ─── Shell ─── */
        .gp-shell {
          width: min(100% - 2.5rem, 88rem);
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        /* ─── Header ─── */
        .gp-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.75rem 0;
        }
        .gp-nav {
          display: flex;
          gap: 2.25rem;
        }
        .gp-nav a {
          color: #6a9e90;
          font-size: 0.82rem;
          transition: color 0.2s;
        }
        .gp-nav a:hover { color: #e8f5f2; }
        .gp-header-actions {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .gp-login-link {
          color: #6a9e90;
          font-size: 0.82rem;
          transition: color 0.2s;
        }
        .gp-login-link:hover { color: #e8f5f2; }
        .gp-cta-sm {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.55rem 1rem;
          border-radius: 0.6rem;
          background: rgba(52,211,153,0.1);
          border: 1px solid rgba(52,211,153,0.25);
          color: #34d399;
          font-size: 0.78rem;
          font-weight: 600;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
        }
        .gp-cta-sm:hover {
          background: rgba(52,211,153,0.18);
          border-color: rgba(52,211,153,0.45);
          transform: translateY(-1px);
        }

        /* ─── Hero ─── */
        .gp-hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          padding: 5rem 0 4rem;
          --mx: 50%;
          --my: 50%;
        }

        /* Eyebrow */
        .gp-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.38rem 0.85rem;
          border-radius: 999px;
          background: rgba(52,211,153,0.08);
          border: 1px solid rgba(52,211,153,0.18);
          color: #34d399;
          font-size: 0.67rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 1.75rem;
          animation: fade-up 0.7s 0.1s both;
        }
        .gp-dot {
          width: 0.42rem;
          height: 0.42rem;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 0 3px rgba(52,211,153,0.2);
          animation: glow-pulse 2s ease-in-out infinite;
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(52,211,153,0.2); }
          50% { box-shadow: 0 0 0 6px rgba(52,211,153,0.08); }
        }

        /* Headline */
        .gp-h1 {
          font-family: 'Space Grotesk','Inter',sans-serif;
          font-size: clamp(3rem, 5.5vw, 6rem);
          font-weight: 700;
          letter-spacing: -0.065em;
          line-height: 0.93;
          color: #f0faf8;
          margin: 0 0 1.75rem;
          animation: fade-up 0.7s 0.2s both;
        }
        .gp-h1 em {
          font-weight: 700;
          font-style: normal;
          background: linear-gradient(100deg, #34d399 0%, #22d3ee 50%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Sub */
        .gp-lede {
          color: #5a8a80;
          font-size: 1rem;
          line-height: 1.72;
          max-width: 28rem;
          margin-bottom: 2.25rem;
          animation: fade-up 0.7s 0.3s both;
        }

        /* CTA group */
        .gp-cta-group {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          animation: fade-up 0.7s 0.4s both;
        }
        .gp-cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.9rem 1.5rem;
          border-radius: 0.8rem;
          background: linear-gradient(135deg, #34d399 0%, #22d3ee 100%);
          color: #051a12;
          font-weight: 700;
          font-size: 0.9rem;
          box-shadow: 0 0 0 0 rgba(52,211,153,0.4);
          transition: transform 0.2s, box-shadow 0.2s;
          animation: cta-glow 3s ease-in-out infinite;
        }
        .gp-cta-primary:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 16px 40px rgba(52,211,153,0.35);
        }
        @keyframes cta-glow {
          0%, 100% { box-shadow: 0 8px 24px rgba(52,211,153,0.22); }
          50% { box-shadow: 0 8px 38px rgba(52,211,153,0.38); }
        }
        .gp-note {
          color: #3a5e56;
          font-size: 0.72rem;
        }

        /* Trust bar */
        .gp-trust {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-top: 2.5rem;
          color: #3a5e56;
          font-size: 0.68rem;
          animation: fade-up 0.7s 0.5s both;
        }
        .gp-trust-sep { height: 1px; width: 1.5rem; background: #1a3530; }

        /* ─── Orbit panel ─── */
        .gp-orbit-panel {
          position: relative;
          animation: fade-up 0.85s 0.25s both;
        }
        .gp-orbit-glow {
          position: absolute;
          inset: -10%;
          background: radial-gradient(ellipse, rgba(52,211,153,0.1) 0%, transparent 70%);
          pointer-events: none;
          border-radius: 50%;
          filter: blur(30px);
          animation: orbit-glow-pulse 4s ease-in-out infinite;
        }
        @keyframes orbit-glow-pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1.2; transform: scale(1.06); }
        }

        /* ─── Animations ─── */
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ─── Stats Strip ─── */
        .gp-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid rgba(52,211,153,0.1);
          border-bottom: 1px solid rgba(52,211,153,0.1);
          margin-top: 2rem;
        }
        .gp-stat {
          padding: 1.5rem 1.25rem;
          border-right: 1px solid rgba(52,211,153,0.1);
          animation: fade-up 0.6s both;
        }
        .gp-stat:last-child { border-right: 0; }
        .gp-stat strong {
          display: block;
          font-family: 'Space Grotesk',sans-serif;
          font-size: 2rem;
          font-weight: 600;
          line-height: 1;
        }
        .gp-stat span {
          display: block;
          color: #3a5e56;
          font-size: 0.65rem;
          letter-spacing: 0.05em;
          margin-top: 0.4rem;
        }

        /* ─── Features Grid ─── */
        .gp-features {
          padding: 6rem 0 5rem;
        }
        .gp-section-label {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          color: #34d399;
          font-size: 0.67rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 1.25rem;
        }
        .gp-section-label::before {
          content: '';
          width: 1.5rem; height: 1px;
          background: linear-gradient(90deg, #34d399, #22d3ee);
        }
        .gp-features-h2 {
          font-family: 'Space Grotesk',sans-serif;
          font-size: clamp(2.2rem, 4vw, 4rem);
          font-weight: 600;
          letter-spacing: -0.055em;
          line-height: 0.95;
          color: #f0faf8;
          margin-bottom: 3.5rem;
        }
        .gp-features-h2 em {
          font-style: normal;
          background: linear-gradient(90deg, #34d399, #22d3ee);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .gp-cards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        .gp-card {
          background: rgba(52,211,153,0.04);
          border: 1px solid rgba(52,211,153,0.1);
          border-radius: 1rem;
          padding: 1.5rem;
          transition: background 0.25s, border-color 0.25s, transform 0.25s;
        }
        .gp-card:hover {
          background: rgba(52,211,153,0.08);
          border-color: rgba(52,211,153,0.25);
          transform: translateY(-3px);
        }
        .gp-card-icon {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          display: block;
        }
        .gp-card h3 {
          font-family: 'Space Grotesk',sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          color: #c8f0e6;
          margin-bottom: 0.5rem;
        }
        .gp-card p {
          color: #4a7a70;
          font-size: 0.78rem;
          line-height: 1.6;
        }

        /* ─── Workflow ─── */
        .gp-workflow {
          border-top: 1px solid rgba(52,211,153,0.08);
          padding: 6rem 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6rem;
          align-items: center;
        }
        .gp-workflow-h2 {
          font-family: 'Space Grotesk',sans-serif;
          font-size: clamp(2rem, 3.5vw, 3.5rem);
          font-weight: 600;
          letter-spacing: -0.05em;
          line-height: 1;
          color: #f0faf8;
          margin-bottom: 1.5rem;
        }
        .gp-workflow-h2 em {
          font-style: italic;
          background: linear-gradient(90deg, #34d399, #22d3ee);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-family: Georgia, serif;
          font-weight: 400;
        }
        .gp-steps { display: flex; flex-direction: column; gap: 1.25rem; }
        .gp-step {
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
          padding: 1.25rem;
          border-radius: 0.85rem;
          border: 1px solid transparent;
          transition: background 0.2s, border-color 0.2s;
        }
        .gp-step:hover {
          background: rgba(52,211,153,0.05);
          border-color: rgba(52,211,153,0.15);
        }
        .gp-step-num {
          width: 2rem;
          height: 2rem;
          border-radius: 0.5rem;
          background: linear-gradient(135deg, #34d399, #22d3ee);
          color: #051a12;
          font-weight: 700;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .gp-step h4 {
          font-family: 'Space Grotesk',sans-serif;
          font-size: 0.95rem;
          color: #c8f0e6;
          margin-bottom: 0.3rem;
        }
        .gp-step p { color: #4a7a70; font-size: 0.78rem; line-height: 1.5; }

        /* ─── Final CTA ─── */
        .gp-final-cta {
          text-align: center;
          padding: 7rem 0 6rem;
          border-top: 1px solid rgba(52,211,153,0.08);
        }
        .gp-final-cta h2 {
          font-family: 'Space Grotesk',sans-serif;
          font-size: clamp(2.4rem, 4.5vw, 4.5rem);
          font-weight: 700;
          letter-spacing: -0.055em;
          line-height: 1;
          color: #f0faf8;
          margin-bottom: 1.25rem;
        }
        .gp-final-cta p {
          color: #4a7a70;
          font-size: 1rem;
          line-height: 1.7;
          max-width: 30rem;
          margin: 0 auto 2.25rem;
        }
        .gp-final-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          border-radius: 0.85rem;
          background: linear-gradient(135deg, #34d399 0%, #22d3ee 100%);
          color: #051a12;
          font-weight: 700;
          font-size: 1rem;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 10px 30px rgba(52,211,153,0.25);
        }
        .gp-final-cta-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 45px rgba(52,211,153,0.35);
        }

        /* ─── Footer ─── */
        .gp-footer {
          border-top: 1px solid rgba(52,211,153,0.08);
          padding: 2rem 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .gp-footer-links {
          display: flex;
          gap: 1.75rem;
        }
        .gp-footer-links a {
          color: #3a5e56;
          font-size: 0.72rem;
          transition: color 0.2s;
        }
        .gp-footer-links a:hover { color: #34d399; }
        .gp-footer-copy {
          color: #2a4540;
          font-size: 0.68rem;
        }

        /* ─── Responsive ─── */
        @media (max-width: 900px) {
          .gp-hero { grid-template-columns: 1fr; gap: 3rem; padding: 3rem 0 2.5rem; }
          .gp-cards { grid-template-columns: repeat(2, 1fr); }
          .gp-stats { grid-template-columns: repeat(2, 1fr); }
          .gp-workflow { grid-template-columns: 1fr; gap: 3rem; }
        }
        @media (max-width: 580px) {
          .gp-nav { display: none; }
          .gp-cards { grid-template-columns: 1fr; }
          .gp-stats { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      {/* Ambient Background */}
      <div className="gp-bg" aria-hidden="true">
        <div className="gp-bg-blob gp-bg-blob-1" />
        <div className="gp-bg-blob gp-bg-blob-2" />
        <div className="gp-bg-blob gp-bg-blob-3" />
      </div>
      <div className="gp-grid" aria-hidden="true" />

      <div className="gp-shell">
        {/* ── Header ── */}
        <header className="gp-header">
          <BrandLogo />
          <nav className="gp-nav" aria-label="Main navigation">
            <Link href="/workflow">Workflow</Link>
            <Link href="/signal">Signal</Link>
            <Link href="/privacy">Privacy</Link>
          </nav>
          <div className="gp-header-actions">
            <Link href="/login" className="gp-login-link">Log in</Link>
            <Link href="/signup" className="gp-cta-sm">
              Start free <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </header>

        {/* ── Hero ── */}
        <section className="gp-hero" ref={heroRef}>
          <div>
            <div className="gp-eyebrow">
              <span className="gp-dot" />
              GitHub activity, with a point of view
            </div>

            <h1 className="gp-h1">
              Make the work<br />
              <em>worth following.</em>
            </h1>

            <p className="gp-lede">
              GitPulse turns the quiet momentum of building into sharp, human posts you are proud to put your name on. No fluff. No hallucinations.
            </p>

            <div className="gp-cta-group">
              <Link href="/signup" className="gp-cta-primary">
                Start with your GitHub <span style={{ fontSize: "1.05rem" }}>↗</span>
              </Link>
              <span className="gp-note">No auto-publishing. Ever.</span>
            </div>

            <div className="gp-trust">
              <span className="gp-dot" style={{ width: "0.38rem", height: "0.38rem" }} />
              Private workspace
              <span className="gp-trust-sep" />
              Manual review
              <span className="gp-trust-sep" />
              Zero hallucinations
            </div>
          </div>

          {/* Orbit Visual */}
          <div className="gp-orbit-panel">
            <div className="gp-orbit-glow" aria-hidden="true" />
            <div className="orbit-stage" style={{ height: "28rem" }}>
              <div className="orbit-frame" aria-hidden="true" />
              <div className="orbit-label orbit-label-top">
                <span className="orbit-label-dot orbit-label-dot-orange" />
                24 commits detected
              </div>
              <div className="orbit-canvas"><ActivityOrbit /></div>
              <div className="orbit-label orbit-label-bottom">
                <span className="orbit-label-dot" />
                Story signal ready
              </div>
              <div className="orbit-post-preview">
                <span>GENERATED DRAFT</span>
                <strong>Shipping steadily is still shipping.</strong>
                <small>LinkedIn · 12 sec ago</small>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <div className="gp-stats">
          {stats.map((s, i) => (
            <div key={s.label} className="gp-stat" style={{ animationDelay: `${0.1 * i + 0.5}s` }}>
              <strong style={{ color: s.accent }}>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Features ── */}
        <section className="gp-features">
          <div className="gp-section-label">The intelligence</div>
          <h2 className="gp-features-h2">
            Smart enough to<br /><em>find the story.</em>
          </h2>
          <div className="gp-cards">
            {features.map((f) => (
              <div key={f.title} className="gp-card">
                <span className="gp-card-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Workflow ── */}
        <section className="gp-workflow">
          <div>
            <div className="gp-section-label">How it works</div>
            <h2 className="gp-workflow-h2">
              Less dashboard.<br /><em>More momentum.</em>
            </h2>
            <p style={{ color: "#4a7a70", fontSize: "0.88rem", lineHeight: 1.65, maxWidth: "22rem" }}>
              Connect GitHub once. GitPulse handles the heavy lifting — you just review and share when ready.
            </p>
          </div>
          <div className="gp-steps">
            {[
              { n: "01", title: "Connect GitHub", desc: "Pull the commits, PRs, and repos you shipped this week." },
              { n: "02", title: "AI Finds the Story", desc: "GitPulse detects the strongest narrative and suggests the best angle." },
              { n: "03", title: "Choose a Draft", desc: "3 variations — Story-driven, Technical, or Build-in-public." },
              { n: "04", title: "Review & Share", desc: "Edit freely. Nothing posts automatically. You stay in control." },
            ].map((step) => (
              <div key={step.n} className="gp-step">
                <div className="gp-step-num">{step.n}</div>
                <div>
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="gp-final-cta">
          <h2>Ready to share<br />what you&apos;re building?</h2>
          <p>Join developers who turn their GitHub activity into authentic content that actually gets traction.</p>
          <Link href="/signup" className="gp-final-cta-btn">
            Create your workspace <span aria-hidden="true">↗</span>
          </Link>
        </section>

        {/* ── Footer ── */}
        <footer className="gp-footer">
          <BrandLogo compact />
          <div className="gp-footer-links">
            <Link href="/workflow">Workflow</Link>
            <Link href="/signal">Signal</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/login">Log in</Link>
          </div>
          <span className="gp-footer-copy">© 2026 GitPulse Studio</span>
        </footer>
      </div>
    </main>
  );
}

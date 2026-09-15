"use client";

import Link from "next/link";
import ActivityOrbit from "../components/ActivityOrbit";
import BrandLogo from "../components/BrandLogo";

export default function HomePage() {
  const activity = [
    { label: "Commits translated", value: "24", tone: "teal" },
    { label: "Drafts ready", value: "08", tone: "orange" },
    { label: "Time saved", value: "3.4h", tone: "blue" },
  ];

  return (
    <main className="landing-page">
      <div className="landing-noise" aria-hidden="true" />
      <div className="landing-shell">
        <header className="landing-header">
          <BrandLogo />
          <nav className="landing-nav" aria-label="Main navigation">
            <Link href="/workflow">Workflow</Link>
            <Link href="/signal">Signal</Link>
          </nav>
          <div className="landing-actions">
            <Link href="/login" className="landing-login">Log in</Link>
            <Link href="/signup" className="landing-cta landing-cta-small">Create workspace </Link>
          </div>
        </header>

        <section className="landing-hero">
          <div className="landing-copy landing-reveal">
            <p className="landing-kicker"><span /> GitHub activity, with a point of view</p>
            <h1>Make the work<br /><em>worth following.</em></h1>
            <p className="landing-lede">GitPulse turns the quiet momentum of building into sharp, human posts you are proud to put your name on.</p>
            <div className="landing-hero-actions">
              <Link href="/signup" className="landing-cta">Start with your GitHub <span aria-hidden="true">↗</span></Link>
              <span className="landing-note">No auto-publishing. Ever.</span>
            </div>
            <div className="landing-trust"><span className="landing-live-dot" /> Private workspace <span className="landing-divider" /> Review every draft</div>
          </div>

          <div className="orbit-stage landing-reveal landing-reveal-delay" id="signal">
            <div className="orbit-frame" aria-hidden="true" />
            <div className="orbit-label orbit-label-top"><span className="orbit-label-dot orbit-label-dot-orange" /> 24 commits detected</div>
            <div className="orbit-canvas"><ActivityOrbit /></div>
            <div className="orbit-label orbit-label-bottom"><span className="orbit-label-dot" /> Story signal ready</div>
            <div className="orbit-post-preview"><span>GENERATED DRAFT</span><strong>Shipping steadily is still shipping.</strong><small>LinkedIn · 12 sec ago</small></div>
          </div>
        </section>

        <section className="landing-stats" aria-label="GitPulse activity summary">
          {activity.map((item) => <div key={item.label} className={`landing-stat landing-stat-${item.tone}`}><strong>{item.value}</strong><span>{item.label}</span></div>)}
          <div className="landing-stat landing-stat-copy"><span>One clear story from<br />a week of shipping.</span><span className="landing-arrow" aria-hidden="true">→</span></div>
        </section>

        <section className="workflow-section" id="workflow">
          <div><p className="landing-kicker"><span /> The signal-to-story system</p><h2>Less dashboard.<br /><em>More momentum.</em></h2></div>
          <div className="workflow-steps">
            <div className="workflow-step"><b>01</b><span>Connect</span><p>Pull the work you already shipped.</p></div>
            <div className="workflow-step"><b>02</b><span>Shape</span><p>Give the week a human narrative.</p></div>
            <div className="workflow-step"><b>03</b><span>Review</span><p>Edit, approve, and share on your terms.</p></div>
          </div>
        </section>
      </div>
    </main>
  );
}

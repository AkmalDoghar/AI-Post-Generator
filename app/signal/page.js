import Link from "next/link";
import ActivityOrbit from "../../components/ActivityOrbit";
import MarketingHeader from "../../components/MarketingHeader";

const activity = [
  ["Commits", "24", "92%", "signal-bar-teal"],
  ["Pull requests", "06", "68%", "signal-bar-orange"],
  ["New repositories", "02", "44%", "signal-bar-blue"],
];

export default function SignalPage() {
  return (
    <main className="marketing-page">
      <div className="landing-noise" aria-hidden="true" />
      <div className="marketing-shell">
        <MarketingHeader active="signal" />
        <section className="marketing-hero marketing-signal-hero">
          <div className="marketing-copy">
            <p className="landing-kicker"><span /> Signal intelligence</p>
            <h1>See what your<br /><em>week is saying.</em></h1>
            <p className="marketing-lede">GitPulse reads the shape of your GitHub activity, then finds the story hiding inside the numbers.</p>
            <Link href="/signup" className="landing-cta">Read your signal <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="signal-visual">
            <div className="signal-visual-header"><span>ACTIVITY PULSE</span><b>LAST 7 DAYS</b></div>
            <div className="signal-orbit"><ActivityOrbit /></div>
            <div className="signal-visual-footer"><span className="landing-live-dot" /> Live from GitHub <strong>+18% momentum</strong></div>
          </div>
        </section>
        <section className="signal-grid-section">
          <div className="signal-intro"><p className="landing-kicker"><span /> A clearer read</p><h2>Not every week<br /><em>looks the same.</em></h2><p>Signal turns raw activity into useful context, so your update sounds like you, not a changelog.</p></div>
          <div className="signal-metrics">
            {activity.map(([label, value, width, tone]) => <article className="signal-metric" key={label}><div><span>{label}</span><strong>{value}</strong></div><div className="signal-bar"><i className={tone} style={{ width }} /></div><small>story potential</small></article>)}
            <article className="signal-insight"><span>THIS WEEK'S READ</span><strong>You are in a shipping rhythm.</strong><p>Three focused pushes, one useful narrative: steady progress that compounds.</p></article>
          </div>
        </section>
      </div>
    </main>
  );
}

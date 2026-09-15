import Link from "next/link";
import MarketingHeader from "../../components/MarketingHeader";

const steps = [
  { number: "01", title: "Connect the work", copy: "Link GitHub and choose the activity you want to turn into a story.", tag: "SOURCE" },
  { number: "02", title: "Find the thread", copy: "GitPulse groups commits, pull requests, and releases into a clear weekly signal.", tag: "SHAPE" },
  { number: "03", title: "Make it yours", copy: "Choose a platform, adjust the tone, and keep the details that sound like you.", tag: "CRAFT" },
  { number: "04", title: "Review, then share", copy: "Nothing publishes without your approval. You stay in control from draft to post.", tag: "PUBLISH" },
];

export default function WorkflowPage() {
  return (
    <main className="marketing-page">
      <div className="landing-noise" aria-hidden="true" />
      <div className="marketing-shell">
        <MarketingHeader active="workflow" />
        <section className="marketing-hero workflow-hero">
          <div className="marketing-copy">
            <p className="landing-kicker"><span /> Signal to story</p>
            <h1>A calmer way<br /><em>to show up.</em></h1>
            <p className="marketing-lede">A simple loop for developers who are building in public, without turning every update into another task.</p>
            <Link href="/signup" className="landing-cta">Build your first story <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="workflow-quote"><span>THE RULE</span><strong>Keep the work real.<br />Make the story clear.</strong><div className="workflow-quote-line" /><small>GitPulse workflow</small></div>
        </section>
        <section className="workflow-timeline-section">
          <div className="workflow-timeline-heading"><p className="landing-kicker"><span /> Four small moves</p><h2>From commit<br /><em>to context.</em></h2></div>
          <div className="workflow-timeline">
            {steps.map((step) => <article className="workflow-timeline-item" key={step.number}><div className="workflow-number">{step.number}</div><div><span className="workflow-tag">{step.tag}</span><h3>{step.title}</h3><p>{step.copy}</p></div></article>)}
          </div>
        </section>
      </div>
    </main>
  );
}

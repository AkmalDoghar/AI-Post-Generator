import BrandLogo from "./BrandLogo";

export default function AuthIntro({ mode = "login" }) {
  const isSignup = mode === "signup";

  return (
    <section className="login-intro">
      <BrandLogo />
      <div className="login-intro-copy">
        <p className="login-eyebrow">{isSignup ? "A better way to share progress" : "Your work has a story"}</p>
        <h1>{isSignup ? <>Make your work<br /><em>worth following.</em></> : <>Ship the update.<br /><em>Share the momentum.</em></>}</h1>
        <p>{isSignup ? "Create a focused workspace that turns your GitHub activity into clear, human social posts." : "Turn GitHub activity into clear, human social posts without losing the developer behind the work."}</p>
      </div>
      <div className="login-signal"><span className="login-signal-dot" />{isSignup ? "Start in seconds" : "Workspace ready"}<span className="login-signal-line" /> Private by default</div>
    </section>
  );
}

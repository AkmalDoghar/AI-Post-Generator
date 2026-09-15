import Link from "next/link";
import BrandLogo from "./BrandLogo";

export default function MarketingHeader({ active }) {
  return (
    <header className="landing-header">
      <BrandLogo />
      <nav className="landing-nav" aria-label="Main navigation">
        <Link className={active === "workflow" ? "marketing-active" : ""} href="/workflow">Workflow</Link>
        <Link className={active === "signal" ? "marketing-active" : ""} href="/signal">Signal</Link>
      </nav>
      <div className="landing-actions">
        <Link href="/login" className="landing-login">Log in</Link>
        <Link href="/signup" className="landing-cta landing-cta-small">Create workspace <span aria-hidden="true">↗</span></Link>
      </div>
    </header>
  );
}

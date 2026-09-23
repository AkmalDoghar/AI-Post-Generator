import Link from "next/link";
import BrandLogo from "./BrandLogo";

export default function MarketingHeader({ active }) {
  return (
    <header className="gp-header">
      <BrandLogo />
      <nav className="gp-nav" aria-label="Main navigation">
        <Link href="/workflow" style={{ color: active === "workflow" ? "#34d399" : undefined, fontWeight: active === "workflow" ? 600 : undefined }}>
          Workflow
        </Link>
        <Link href="/signal" style={{ color: active === "signal" ? "#34d399" : undefined, fontWeight: active === "signal" ? 600 : undefined }}>
          Signal
        </Link>
        <Link href="/privacy">
          Privacy
        </Link>
      </nav>
      <div className="gp-header-actions">
        <Link href="/login" className="gp-login-link">
          Log in
        </Link>
        <Link href="/signup" className="gp-cta-sm">
          Start free <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </header>
  );
}

import Link from "next/link";

export default function BrandLogo({ href = "/", compact = false }) {
  return (
    <Link href={href} className={`brand-logo ${compact ? "brand-logo-compact" : ""}`} aria-label="GitPulse home">
      <span className="brand-logo-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" role="presentation">
          <path d="M7 21.5 12.5 16l4 4L25 11.5" />
          <path d="M20 11.5h5v5" />
        </svg>
      </span>
      <span className="brand-logo-name">GitPulse</span>
    </Link>
  );
}

import Link from "next/link";

export default function BrandLogo({ href = "/", compact = false }) {
  const iconSize = compact ? 30 : 34;

  return (
    <Link
      href={href}
      className={`brand-logo ${compact ? "brand-logo-compact" : ""}`}
      aria-label="GitPulse home"
    >
      {/* Icon Mark — Pulse line through Git node */}
      <span className="brand-logo-mark" aria-hidden="true" style={{ width: iconSize, height: iconSize }}>
        <svg
          viewBox="0 0 34 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width={iconSize}
          height={iconSize}
        >
          <defs>
            <linearGradient id="gp-icon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
            <linearGradient id="gp-pulse-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
            <filter id="gp-glow">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background rounded square */}
          <rect width="34" height="34" rx="8" fill="#0d1f1a" />

          {/* Git branch node — left dot */}
          <circle cx="8" cy="17" r="2.5" fill="url(#gp-icon-grad)" />

          {/* Pulse / heartbeat line */}
          <polyline
            points="10.5,17 13,17 15,11 17,23 19,14 21,17 25.5,17"
            stroke="url(#gp-pulse-grad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#gp-glow)"
          />

          {/* Git node — right dot */}
          <circle cx="27" cy="17" r="2" fill="url(#gp-icon-grad)" opacity="0.7" />
        </svg>
      </span>

      {/* Wordmark */}
      <span className="brand-logo-name" aria-label="GitPulse">
        <svg
          viewBox="0 0 110 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          height={compact ? 14 : 16}
          aria-hidden="true"
          style={{ display: "block" }}
        >
          <defs>
            <linearGradient id="gp-text-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          {/* "Git" in white */}
          <text
            x="0"
            y="17"
            fontFamily="'Space Grotesk', 'Inter', sans-serif"
            fontWeight="700"
            fontSize="17"
            letterSpacing="-0.5"
            fill="#f8fafc"
          >
            Git
          </text>
          {/* "Pulse" in gradient */}
          <text
            x="33"
            y="17"
            fontFamily="'Space Grotesk', 'Inter', sans-serif"
            fontWeight="700"
            fontSize="17"
            letterSpacing="-0.5"
            fill="url(#gp-text-grad)"
          >
            Pulse
          </text>
        </svg>
      </span>
    </Link>
  );
}

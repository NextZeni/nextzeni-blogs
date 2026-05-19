// Colors come from CSS variables (src/lib/colors.ts → globals.css).
// SVG supports var(--color-*) when rendered inside HTML, so no hex is hardcoded here.

export function VectorBackground() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none select-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Dot grid */}
          <pattern id="nz-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1.1" fill="var(--color-foreground)" opacity="0.045" />
          </pattern>

          {/* Top-right accent glow */}
          <radialGradient id="nz-glow-tr" cx="100%" cy="0%" r="55%" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.07" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </radialGradient>

          {/* Bottom-left dark glow */}
          <radialGradient id="nz-glow-bl" cx="0%" cy="100%" r="45%" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--color-foreground)" stopOpacity="0.04" />
            <stop offset="100%" stopColor="var(--color-foreground)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Dot texture */}
        <rect width="100%" height="100%" fill="url(#nz-dots)" />

        {/* Radial glows */}
        <rect width="100%" height="100%" fill="url(#nz-glow-tr)" />
        <rect width="100%" height="100%" fill="url(#nz-glow-bl)" />

        {/* Top-right concentric rings (accent) */}
        <circle cx="100%" cy="0" r="560" fill="none" stroke="var(--color-accent)" strokeWidth="0.7" opacity="0.10" />
        <circle cx="100%" cy="0" r="430" fill="none" stroke="var(--color-accent)" strokeWidth="0.7" opacity="0.08" />
        <circle cx="100%" cy="0" r="300" fill="none" stroke="var(--color-accent)" strokeWidth="0.7" opacity="0.06" />
        <circle cx="100%" cy="0" r="170" fill="none" stroke="var(--color-accent)" strokeWidth="0.7" opacity="0.04" />

        {/* Bottom-left concentric rings (foreground) */}
        <circle cx="0" cy="100%" r="480" fill="none" stroke="var(--color-foreground)" strokeWidth="0.6" opacity="0.07" />
        <circle cx="0" cy="100%" r="330" fill="none" stroke="var(--color-foreground)" strokeWidth="0.6" opacity="0.05" />
        <circle cx="0" cy="100%" r="180" fill="none" stroke="var(--color-foreground)" strokeWidth="0.6" opacity="0.03" />

        {/* Diagonal dashed accent lines */}
        <line x1="75%" y1="0" x2="100%" y2="30%" stroke="var(--color-accent)" strokeWidth="0.5" opacity="0.08" strokeDasharray="4 14" />
        <line x1="85%" y1="0" x2="100%" y2="20%" stroke="var(--color-accent)" strokeWidth="0.5" opacity="0.05" strokeDasharray="4 14" />

        {/* Corner cross marks */}
        <line x1="calc(100% - 40)" y1="36" x2="calc(100% - 28)" y2="36" stroke="var(--color-accent)"    strokeWidth="0.8" opacity="0.25" />
        <line x1="calc(100% - 34)" y1="30" x2="calc(100% - 34)" y2="42" stroke="var(--color-accent)"    strokeWidth="0.8" opacity="0.25" />
        <line x1="28"              y1="calc(100% - 36)" x2="40"              y2="calc(100% - 36)" stroke="var(--color-foreground)" strokeWidth="0.8" opacity="0.18" />
        <line x1="34"              y1="calc(100% - 42)" x2="34"              y2="calc(100% - 30)" stroke="var(--color-foreground)" strokeWidth="0.8" opacity="0.18" />
      </svg>
    </div>
  );
}

export function ArcReactor() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[320px]">
      <div
        className="absolute inset-0 rounded-full border border-primary/30"
        style={{ animation: "hud-spin 24s linear infinite" }}
      >
        {[0, 90, 180, 270].map((deg) => (
          <span
            key={deg}
            className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-primary"
            style={{ transformOrigin: "50% 160px", transform: `rotate(${deg}deg)` }}
          />
        ))}
      </div>

      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
        <circle
          cx="100"
          cy="100"
          r="92"
          fill="none"
          stroke="currentColor"
          className="text-accent/40"
          strokeWidth="0.6"
          strokeDasharray="4 8"
        />
        <g style={{ animation: "hud-spin-rev 16s linear infinite", transformOrigin: "100px 100px" }}>
          <circle
            cx="100"
            cy="100"
            r="78"
            fill="none"
            stroke="currentColor"
            className="text-primary/70"
            strokeWidth="1"
            strokeDasharray="60 22 12 22"
          />
        </g>
        <g style={{ animation: "hud-spin 9s linear infinite", transformOrigin: "100px 100px" }}>
          <circle
            cx="100"
            cy="100"
            r="60"
            fill="none"
            stroke="currentColor"
            className="text-accent"
            strokeWidth="0.8"
            strokeDasharray="10 6"
          />
        </g>
        <circle
          cx="100"
          cy="100"
          r="42"
          fill="none"
          stroke="currentColor"
          className="text-primary/50"
          strokeWidth="0.8"
        />
        <line x1="8" y1="100" x2="34" y2="100" stroke="currentColor" className="text-primary/60" />
        <line x1="166" y1="100" x2="192" y2="100" stroke="currentColor" className="text-primary/60" />
        <line x1="100" y1="8" x2="100" y2="34" stroke="currentColor" className="text-primary/60" />
        <line x1="100" y1="166" x2="100" y2="192" stroke="currentColor" className="text-primary/60" />
      </svg>

      <div
        className="absolute inset-[32%] rounded-full bg-primary/25"
        style={{ animation: "hud-pulse 2.6s ease-in-out infinite", filter: "blur(6px)" }}
      />
      <div className="absolute inset-[38%] rounded-full border border-primary bg-primary/15" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="hud-glow text-[10px] tracking-[0.35em] text-primary">ARC</span>
      </div>
    </div>
  );
}

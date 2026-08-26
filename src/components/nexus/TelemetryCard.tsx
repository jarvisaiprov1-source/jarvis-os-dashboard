export function TelemetryCard({
  label,
  value,
  hint,
  tone = "cyan",
  progress,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "cyan" | "green" | "violet" | "amber";
  progress?: number;
}) {
  const toneText = {
    cyan: "text-nexus-cyan",
    green: "text-nexus-green",
    violet: "text-nexus-violet",
    amber: "text-nexus-amber",
  }[tone];
  const toneBg = {
    cyan: "bg-nexus-cyan",
    green: "bg-nexus-green",
    violet: "bg-nexus-violet",
    amber: "bg-nexus-amber",
  }[tone];

  return (
    <div className="nexus-glass rounded-lg p-3">
      <p className="font-mono text-[9px] tracking-[0.22em] text-muted-foreground">{label}</p>
      <p className={`mt-1.5 text-lg font-semibold tabular-nums ${toneText}`}>{value}</p>
      {typeof progress === "number" && (
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-secondary/70">
          <div
            className={`h-full rounded-full ${toneBg} transition-[width] duration-700 ease-out`}
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
      )}
      {hint && <p className="mt-2 font-mono text-[10px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

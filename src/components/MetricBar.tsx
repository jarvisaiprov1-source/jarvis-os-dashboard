export function MetricBar({
  label,
  value,
  unit = "%",
}: {
  label: string;
  value: number;
  unit?: string;
}) {
  return (
    <div className="hud-panel px-3 py-2">
      <div className="flex items-baseline justify-between text-[10px] tracking-[0.2em] text-muted-foreground">
        <span>{label}</span>
        <span className="hud-glow text-sm text-primary">
          {value.toFixed(1)}
          {unit}
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-sm bg-secondary">
        <div
          className="h-full bg-primary transition-[width] duration-700 ease-out"
          style={{
            width: `${Math.min(100, value)}%`,
            boxShadow: "0 0 12px var(--color-hud-cyan)",
          }}
        />
      </div>
    </div>
  );
}

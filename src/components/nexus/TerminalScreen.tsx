import { useEffect, useRef } from "react";

export type LogKind = "user" | "system" | "scan" | "success" | "ai";

export type LogLine = {
  id: number;
  kind: LogKind;
  text: string;
  ts: string;
};

const KIND_STYLE: Record<LogKind, { prefix: string; className: string }> = {
  user: { prefix: "USER", className: "text-foreground" },
  system: { prefix: "SYSTEM", className: "text-nexus-cyan" },
  scan: { prefix: "SCAN", className: "text-nexus-amber" },
  success: { prefix: "OK", className: "text-nexus-green" },
  ai: { prefix: "J.A.R.V.I.S.", className: "text-nexus-cyan/90" },
};

export function TerminalScreen({
  lines,
  scanning,
}: {
  lines: LogLine[];
  scanning: boolean;
}) {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" });
  }, [lines, scanning]);

  return (
    <div className="nexus-glass flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg">
      <div className="flex items-center justify-between border-b border-nexus-cyan/15 px-4 py-2 font-mono text-[10px] tracking-[0.22em] text-muted-foreground">
        <span>NEURAL TERMINAL // SECURE CHANNEL</span>
        <span className="text-nexus-green">MCP LINK STABLE</span>
      </div>

      {scanning && (
        <div className="relative overflow-hidden border-b border-nexus-amber/30 bg-nexus-amber/5 px-4 py-2 text-[11px] text-nexus-amber">
          ⚡ RAPID SCAN: Synchronizing Model Context Protocol across 6-brain vector tables...
          <span className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-nexus-amber/25 to-transparent [animation:nexus-sweep_1.4s_linear_infinite]" />
        </div>
      )}

      <div
        ref={boxRef}
        className="min-h-[300px] flex-1 space-y-1.5 overflow-y-auto bg-nexus-panel/60 p-4 font-mono text-[12.5px] leading-relaxed"
      >
        {lines.map((line) => {
          const style = KIND_STYLE[line.kind];
          return (
            <div key={line.id} className="[animation:nexus-fade-in_.25s_ease-out]">
              <span className="text-muted-foreground/60">[{line.ts}]</span>{" "}
              <span className={`${style.className} opacity-80`}>{style.prefix} &gt;</span>{" "}
              <span className={`${style.className} whitespace-pre-wrap`}>{line.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

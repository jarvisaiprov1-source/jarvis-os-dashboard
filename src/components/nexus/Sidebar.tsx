import {
  Activity,
  Bot,
  Boxes,
  BrainCircuit,
  Music4,
  Radio,
  ShieldCheck,
  Terminal,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavKey =
  | "hub"
  | "terminal"
  | "voice"
  | "audio"
  | "enterprise"
  | "cad"
  | "bots"
  | "sandbox"
  | "vector";

export const NAV_ITEMS: { key: NavKey; label: string; icon: LucideIcon }[] = [
  { key: "hub", label: "Command Center Hub", icon: Activity },
  { key: "terminal", label: "AI Neural Terminal", icon: Terminal },
  { key: "voice", label: "Upgraded Voice Nexus", icon: Radio },
  { key: "audio", label: "Audio / Media Hub", icon: Music4 },
  { key: "enterprise", label: "600+ Enterprise Suite", icon: Boxes },
  { key: "cad", label: "Parametric CAD Studio", icon: Wrench },
  { key: "bots", label: "Discord & Telegram Bot Hub", icon: Bot },
  { key: "sandbox", label: "Security Sandbox Audit", icon: ShieldCheck },
  { key: "vector", label: "6-Brain Vector Sync", icon: BrainCircuit },
];

export function Sidebar({
  active,
  onSelect,
}: {
  active: NavKey;
  onSelect: (key: NavKey) => void;
}) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-r border-nexus-cyan/15 bg-nexus-void lg:w-[280px]">
      <div className="border-b border-nexus-cyan/15 px-5 py-5">
        <h1 className="nexus-glow-text font-sans text-2xl font-semibold tracking-[0.18em] text-nexus-cyan">
          J.A.R.V.I.S.
        </h1>
        <p className="mt-1 font-mono text-[10px] tracking-[0.22em] text-muted-foreground">
          MARK-XXIII // CLAUDE-PRIMARY NEXUS
        </p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const isActive = key === active;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              className={`group relative flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left font-sans text-[13px] transition-all duration-200 ${
                isActive
                  ? "bg-nexus-cyan/10 text-nexus-cyan shadow-[0_0_22px_-10px_var(--color-nexus-cyan)]"
                  : "text-muted-foreground hover:bg-nexus-cyan/5 hover:text-nexus-cyan"
              }`}
            >
              <span
                className={`absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-nexus-cyan transition-opacity ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              />
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-3">
        <div className="nexus-glass rounded-lg p-3">
          <p className="font-mono text-[9px] tracking-[0.25em] text-muted-foreground">
            BRAIN ROUTER STATUS
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-nexus-green/60 [animation:nexus-ring_1.8s_ease-out_infinite]" />
              <span className="relative h-2 w-2 rounded-full bg-nexus-green shadow-[0_0_10px_var(--color-nexus-green)]" />
            </span>
            <span className="text-[12px] font-medium text-nexus-green">
              PRIMARY BRAIN: CLAUDE 3.5 Sonnet
            </span>
          </div>
          <p className="mt-2 font-mono text-[10px] leading-relaxed text-muted-foreground">
            Active: Claude + Groq + OpenAI + Mistral + DeepSeek + Local
          </p>
        </div>
      </div>
    </aside>
  );
}

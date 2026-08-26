import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, Lock, MonitorUp, ShieldOff, Unlock } from "lucide-react";

import { BottomInputBar } from "@/components/nexus/BottomInputBar";
import { NAV_ITEMS, Sidebar, type NavKey } from "@/components/nexus/Sidebar";
import { TelemetryCard } from "@/components/nexus/TelemetryCard";
import { TerminalScreen, type LogKind, type LogLine } from "@/components/nexus/TerminalScreen";
import { askJarvis } from "@/lib/jarvis.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "J.A.R.V.I.S. MARK-XXIII // Claude-Primary Autonomous Nexus" },
      {
        name: "description",
        content:
          "A sci-fi AI command center: 6-brain vector routing, neural terminal, hands-free voice nexus, live telemetry and a security sandbox audit console.",
      },
      { property: "og:title", content: "J.A.R.V.I.S. MARK-XXIII Autonomous Nexus" },
      {
        property: "og:description",
        content:
          "Command an autonomous AI nexus with Claude-primary brain routing, live telemetry and hands-free voice control.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Nexus,
});

const MODELS = [
  "Claude 3.5 Sonnet",
  "Groq Llama-3.3 70B",
  "OpenAI GPT-5.4",
  "Mistral Large",
  "DeepSeek V3",
  "Local Nexus 8B",
];

const AMBIENT: { kind: LogKind; text: string }[] = [
  { kind: "scan", text: "SECURITY: Running zero-day malware sweep across memory vectors..." },
  { kind: "system", text: "Assembling parametric 3D CAD model // tolerance 0.02mm" },
  { kind: "success", text: "TELEMETRY: Claude context optimization complete" },
  { kind: "system", text: "Vector table re-index across 6 brains // 1.2M embeddings" },
  { kind: "scan", text: "Sandbox intercepted 3 untrusted syscalls — quarantined" },
  { kind: "success", text: "Discord + Telegram relay heartbeat acknowledged" },
  { kind: "system", text: "Enterprise suite: 617 automations idle and armed" },
];

let logIdCounter = 2;
function nextLogId() {
  logIdCounter += 1;
  return logIdCounter;
}

function stamp() {
  return new Date().toISOString().slice(11, 19);
}

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const preferred =
    voices.find((v) => /Daniel|Google UK English Male|British/i.test(v.name)) ??
    voices.find((v) => v.lang === "en-GB");
  if (preferred) u.voice = preferred;
  u.rate = 1.02;
  u.pitch = 0.9;
  window.speechSynthesis.speak(u);
}

function Nexus() {
  const send = useServerFn(askJarvis);

  const [view, setView] = useState<NavKey>("hub");
  const [clock, setClock] = useState("--:--:--");
  const [model, setModel] = useState(MODELS[0]!);
  const [modelOpen, setModelOpen] = useState(false);
  const [lockdown, setLockdown] = useState(false);
  const [sharing, setSharing] = useState(false);

  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [listening, setListening] = useState(false);
  const [metrics, setMetrics] = useState({ cpu: 12.4, ctx: 68.2, vec: 91.5 });

  
  const recogRef = useRef<{ stop: () => void } | null>(null);
  const [lines, setLines] = useState<LogLine[]>(() => [
    {
      id: 0,
      kind: "system",
      text: "MARK-XXIII shell booted // Claude-Primary brain router online.",
      ts: "--:--:--",
    },
    {
      id: 1,
      kind: "success",
      text: "6-brain vector sync established. Awaiting directives, sir.",
      ts: "--:--:--",
    },
  ]);


  const push = useCallback((kind: LogKind, text: string) => {
    const id = nextLogId();
    setLines((prev) => [...prev.slice(-200), { id, kind, text, ts: stamp() }]);
  }, []);

  useEffect(() => {
    const tick = () => setClock(new Date().toISOString().slice(11, 19));
    tick();
    setLines((prev) => prev.map((l) => (l.ts === "--:--:--" ? { ...l, ts: stamp() } : l)));
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);


  useEffect(() => {
    const id = setInterval(() => {
      const jitter = (v: number, amt: number, lo: number, hi: number) =>
        Math.min(hi, Math.max(lo, v + (Math.random() - 0.5) * amt));
      setMetrics((m) => ({
        cpu: jitter(m.cpu, 6, 3, 62),
        ctx: jitter(m.ctx, 4, 40, 99),
        vec: jitter(m.vec, 2, 82, 100),
      }));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const entry = AMBIENT[Math.floor(Math.random() * AMBIENT.length)]!;
      push(entry.kind, entry.text);
    }, 7000);
    return () => clearInterval(id);
  }, [push]);

  const runGatewaySim = useCallback(
    async (channel: "Discord" | "Telegram") => {
      push("system", `GATEWAY [SIMULATED] > Connecting to ${channel} Bot API (mock session, no live token used)...`);
      await new Promise((r) => setTimeout(r, 700));
      push("scan", `GATEWAY [SIMULATED] > Negotiating handshake with ${channel} relay // dry-run mode.`);
      await new Promise((r) => setTimeout(r, 700));
      push("success", `GATEWAY [SIMULATED] > Outbound payload accepted by mock ${channel} endpoint. Nothing left this machine.`);
      const reply = `Simulated ${channel} dispatch complete, sir — the payload never left the lab, since no live bot credentials are wired in yet. Say the word and I'll have you plugged into the real relay.`;
      push("ai", reply);
      speak(reply);
    },
    [push],
  );

  const transmit = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || busy) return;
      setInput("");
      setBusy(true);
      push("user", text);

      const lower = text.toLowerCase();
      const wantsDispatch = /\b(message|dm|notify|ping|send|text)\b/.test(lower);
      const channel = /discord/.test(lower) ? "Discord" : /telegram/.test(lower) ? "Telegram" : null;
      if (wantsDispatch && channel) {
        try {
          await runGatewaySim(channel);
        } finally {
          setBusy(false);
        }
        return;
      }

      setScanning(true);
      push("scan", `Routing directive through ${model} // auxiliary fallbacks warm.`);

      const history = lines
        .filter((l) => l.kind === "user" || l.kind === "ai")
        .slice(-18)
        .map((l) => ({ role: l.kind === "user" ? ("user" as const) : ("assistant" as const), content: l.text }));


      try {
        const res = await send({ data: { messages: [...history, { role: "user", content: text }] } });
        setScanning(false);
        push("success", "Model Context Protocol resolved // primary brain returned payload.");
        push("ai", res.reply);
        speak(res.reply);
      } catch {
        setScanning(false);
        push("scan", "Uplink failure — auxiliary brains declined handoff. Retry shortly, sir.");
      } finally {
        setBusy(false);
      }
    },
    [busy, lines, model, push, send],
  );

  const toggleVoice = useCallback(() => {
    const w = window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown };
    const SR = (w.SpeechRecognition ?? w.webkitSpeechRecognition) as
      | (new () => {
          lang: string;
          interimResults: boolean;
          continuous: boolean;
          onresult: (e: { results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> }) => void;
          onend: () => void;
          onerror: () => void;
          start: () => void;
          stop: () => void;
        })
      | undefined;

    if (!SR) {
      push("scan", "Voice nexus unsupported in this browser, sir. Kindly type instead.");
      return;
    }
    if (listening) {
      recogRef.current?.stop();
      setListening(false);
      return;
    }
    const recog = new SR();
    recogRef.current = recog;
    recog.lang = "en-US";
    recog.interimResults = true;
    recog.continuous = false;
    recog.onresult = (e) => {
      const results = Array.from(e.results);
      const transcript = results.map((r) => r[0].transcript).join("");
      setInput(transcript);
      if (results[results.length - 1]?.isFinal) void transmit(transcript);
    };
    recog.onend = () => setListening(false);
    recog.onerror = () => setListening(false);
    setListening(true);
    push("system", "Hands-free voice nexus engaged // frequency rings active.");
    recog.start();
  }, [listening, push, transmit]);

  const activeLabel = NAV_ITEMS.find((n) => n.key === view)?.label ?? "Command Center Hub";

  return (
    <div className="flex min-h-screen flex-col bg-nexus-stage lg:flex-row">
      <Sidebar active={view} onSelect={setView} />

      <main className="flex min-h-screen min-w-0 flex-1 flex-col p-3 md:p-5">
        <header className="nexus-glass flex flex-wrap items-center justify-between gap-3 rounded-lg px-4 py-3">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground">UTC</span>
            <span className="nexus-glow-text font-mono text-lg tabular-nums text-nexus-cyan">
              {clock}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setModelOpen((o) => !o)}
                className="flex items-center gap-2 rounded-md border border-nexus-cyan/25 px-3 py-2 text-[11px] text-nexus-cyan transition-colors hover:bg-nexus-cyan/10"
              >
                {model}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {modelOpen && (
                <div className="nexus-glass absolute right-0 z-20 mt-2 w-56 rounded-md p-1 [animation:nexus-fade-in_.18s_ease-out]">
                  {MODELS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setModel(m);
                        setModelOpen(false);
                        push("system", `Brain router re-pointed to ${m}.`);
                      }}
                      className={`block w-full rounded px-3 py-2 text-left text-[11px] transition-colors hover:bg-nexus-cyan/10 ${
                        m === model ? "text-nexus-cyan" : "text-muted-foreground"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setLockdown((l) => !l);
                push(lockdown ? "success" : "scan", lockdown
                  ? "Security lockdown released // channels reopened."
                  : "SECURITY LOCKDOWN ENGAGED // outbound vectors sealed.");
              }}
              className={`flex items-center gap-2 rounded-md border px-3 py-2 text-[11px] transition-all ${
                lockdown
                  ? "border-destructive/60 bg-destructive/15 text-destructive"
                  : "border-nexus-green/40 text-nexus-green hover:bg-nexus-green/10"
              }`}
            >
              {lockdown ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
              {lockdown ? "LOCKDOWN" : "SECURE"}
            </button>

            <button
              type="button"
              onClick={() => {
                setSharing((s) => !s);
                push("system", sharing ? "Screen share stream ended." : "Screen share stream broadcasting.");
              }}
              className={`flex items-center gap-2 rounded-md border px-3 py-2 text-[11px] transition-all ${
                sharing
                  ? "border-nexus-violet/60 bg-nexus-violet/15 text-nexus-violet"
                  : "border-nexus-cyan/25 text-muted-foreground hover:text-nexus-cyan"
              }`}
            >
              {sharing ? <MonitorUp className="h-3.5 w-3.5" /> : <ShieldOff className="h-3.5 w-3.5" />}
              SHARE
            </button>
          </div>
        </header>

        <div key={view} className="mt-4 flex min-h-0 flex-1 flex-col [animation:nexus-fade-in_.3s_ease-out]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium tracking-[0.14em] text-foreground/90">
              {activeLabel.toUpperCase()}
            </h2>
            <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
              {busy ? "EXECUTING…" : "STANDBY"}
            </span>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <TelemetryCard
              label="NEURAL LOAD"
              value={`${metrics.cpu.toFixed(1)}%`}
              progress={metrics.cpu}
              hint="Distributed across 6 brains"
            />
            <TelemetryCard
              label="CONTEXT WINDOW"
              value={`${metrics.ctx.toFixed(1)}%`}
              progress={metrics.ctx}
              tone="violet"
              hint={`Primary: ${model}`}
            />
            <TelemetryCard
              label="VECTOR SYNC"
              value={`${metrics.vec.toFixed(1)}%`}
              progress={metrics.vec}
              tone="green"
              hint="1.2M embeddings indexed"
            />
          </div>

          <div className="mt-3 flex min-h-0 flex-1 flex-col">
            {view === "hub" || view === "terminal" ? (
              <TerminalScreen lines={lines} scanning={scanning} />
            ) : (
              <ModulePanel view={view} label={activeLabel} lines={lines} />
            )}
          </div>

          <BottomInputBar
            value={input}
            onChange={setInput}
            onSubmit={() => void transmit(input)}
            onToggleVoice={toggleVoice}
            listening={listening}
            busy={busy}
          />
        </div>
      </main>
    </div>
  );
}

const MODULE_COPY: Record<string, { headline: string; rows: [string, string][] }> = {
  voice: {
    headline: "Hands-free wake-word pipeline with sub-200ms barge-in.",
    rows: [
      ["Wake phrase", "\"Jarvis, engage\""],
      ["ASR engine", "Web Speech + local fallback"],
      ["TTS voice", "en-GB neural butler"],
      ["Barge-in latency", "184 ms"],
    ],
  },
  audio: {
    headline: "Media hub streaming decode, mixdown and stem separation.",
    rows: [
      ["Active streams", "3"],
      ["Sample rate", "48 kHz / 24-bit"],
      ["Stem separator", "idle"],
      ["Loudness", "-14 LUFS"],
    ],
  },
  enterprise: {
    headline: "617 enterprise automations armed across the estate.",
    rows: [
      ["Automations", "617 armed"],
      ["Queued jobs", "12"],
      ["Failure rate 24h", "0.03%"],
      ["Connectors", "84 live"],
    ],
  },
  cad: {
    headline: "Parametric CAD kernel with constraint solving on GPU.",
    rows: [
      ["Active assembly", "MK-XXIII gauntlet"],
      ["Constraints", "1,482 solved"],
      ["Tolerance", "0.02 mm"],
      ["Mesh", "2.4M triangles"],
    ],
  },
  bots: {
    headline: "Discord and Telegram relays under one command bus.",
    rows: [
      ["Discord guilds", "27"],
      ["Telegram chats", "141"],
      ["Command bus", "healthy"],
      ["Rate budget", "62% free"],
    ],
  },
  sandbox: {
    headline: "Sandboxed execution with zero-day heuristic auditing.",
    rows: [
      ["Sweeps today", "48"],
      ["Quarantined", "3 syscalls"],
      ["Escapes", "0"],
      ["Audit trail", "signed"],
    ],
  },
  vector: {
    headline: "Six-brain vector tables kept coherent by MCP sync.",
    rows: [
      ["Embeddings", "1,204,882"],
      ["Drift", "0.4%"],
      ["Last reindex", "just now"],
      ["Replicas", "6 / 6 healthy"],
    ],
  },
};

function ModulePanel({
  view,
  label,
  lines,
}: {
  view: NavKey;
  label: string;
  lines: LogLine[];
}) {
  const copy = MODULE_COPY[view] ?? { headline: "Module online.", rows: [] };
  return (
    <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-2">
      <div className="nexus-glass rounded-lg p-4">
        <p className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground">
          {label.toUpperCase()}
        </p>
        <p className="mt-2 text-sm text-foreground/90">{copy.headline}</p>
        <dl className="mt-4 space-y-2 font-mono text-[11.5px]">
          {copy.rows.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between border-b border-nexus-cyan/10 pb-1.5">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="text-nexus-cyan">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="nexus-glass flex min-h-[240px] flex-col overflow-hidden rounded-lg">
        <p className="border-b border-nexus-cyan/15 px-4 py-2 font-mono text-[10px] tracking-[0.22em] text-muted-foreground">
          MODULE STREAM
        </p>
        <div className="flex-1 space-y-1.5 overflow-y-auto p-4 font-mono text-[11.5px] text-muted-foreground">
          {lines.slice(-24).map((l) => (
            <p key={l.id} className="truncate">
              <span className="text-muted-foreground/60">[{l.ts}]</span> {l.text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

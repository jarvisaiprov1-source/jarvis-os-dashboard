import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, Send, Square } from "lucide-react";

import { ArcReactor } from "@/components/ArcReactor";
import { MetricBar } from "@/components/MetricBar";
import { askJarvis } from "@/lib/jarvis.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "J.A.R.V.I.S. Mark LXXXV OS // Stark Industries HUD" },
      {
        name: "description",
        content:
          "A tactical Stark Industries heads-up display with a live Arc Reactor core, system telemetry, and a voice-enabled J.A.R.V.I.S. command terminal.",
      },
      { property: "og:title", content: "J.A.R.V.I.S. Mark LXXXV OS" },
      {
        property: "og:description",
        content:
          "Talk to J.A.R.V.I.S. inside a glowing Stark Industries HUD with live telemetry and voice commands.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Hud,
});

type Msg = { role: "user" | "assistant"; content: string };

function useClock() {
  const [now, setNow] = useState<string>("--:--:--");
  useEffect(() => {
    const tick = () => setNow(new Date().toISOString().slice(11, 19));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function useMetrics() {
  const [cpu, setCpu] = useState(5.2);
  const [ram, setRam] = useState(78.7);
  const [pwr, setPwr] = useState(92.4);
  useEffect(() => {
    const id = setInterval(() => {
      const jitter = (v: number, amt: number, lo: number, hi: number) =>
        Math.min(hi, Math.max(lo, v + (Math.random() - 0.5) * amt));
      setCpu((v) => jitter(v, 4, 1.2, 42));
      setRam((v) => jitter(v, 2.2, 61, 93));
      setPwr((v) => jitter(v, 1.4, 78, 100));
    }, 1600);
    return () => clearInterval(id);
  }, []);
  return { cpu, ram, pwr };
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

function Hud() {
  const clock = useClock();
  const { cpu, ram, pwr } = useMetrics();
  const send = useServerFn(askJarvis);

  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Systems online, sir. Mark LXXXV shell initialised, all subroutines nominal. Try not to break anything expensive this time.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const recogRef = useRef<any>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const transmit = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || busy) return;
      const next: Msg[] = [...messages, { role: "user", content: text }];
      setMessages(next);
      setInput("");
      setBusy(true);
      try {
        const res = await send({ data: { messages: next.slice(-20) } });
        setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
        speak(res.reply);
      } catch {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: "Uplink failure, sir. The comms relay declined my request. Try again shortly.",
          },
        ]);
      } finally {
        setBusy(false);
      }
    },
    [busy, messages, send],
  );

  const toggleMic = useCallback(() => {
    const SR =
      (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!SR) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Voice input is unsupported in this browser, sir. Kindly type instead.",
        },
      ]);
      return;
    }
    if (listening) {
      recogRef.current?.stop();
      return;
    }
    const recog = new SR();
    recogRef.current = recog;
    recog.lang = "en-US";
    recog.interimResults = true;
    recog.continuous = false;
    recog.onresult = (e: any) => {
      const transcript = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join("");
      setInput(transcript);
      if (e.results[e.results.length - 1].isFinal) void transmit(transcript);
    };
    recog.onend = () => setListening(false);
    recog.onerror = () => setListening(false);
    setListening(true);
    recog.start();
  }, [listening, transmit]);

  return (
    <main className="min-h-screen px-4 py-4 md:px-8 md:py-6">
      <header className="hud-panel flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <span
            className="h-2.5 w-2.5 rounded-full bg-hud-green"
            style={{ animation: "hud-blink 1.2s steps(2) infinite", boxShadow: "0 0 10px var(--color-hud-green)" }}
          />
          <h1 className="hud-glow text-xs tracking-[0.3em] text-primary md:text-sm">
            STARK INDUSTRIES // MARK LXXXV OS
          </h1>
        </div>
        <div className="flex items-center gap-3 text-[10px] tracking-[0.25em] text-muted-foreground">
          <span className="hidden md:inline">UTC</span>
          <span className="hud-glow text-base text-accent tabular-nums">{clock}</span>
        </div>
      </header>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <section className="hud-panel scanlines flex flex-col gap-4 p-4">
          <div className="flex items-center justify-between text-[10px] tracking-[0.25em] text-muted-foreground">
            <span>TELEMETRY</span>
            <span className="text-primary">RTX-CORE</span>
          </div>
          <ArcReactor />
          <div className="grid gap-2">
            <MetricBar label="CPU LOAD" value={cpu} />
            <MetricBar label="RAM USAGE" value={ram} />
            <MetricBar label="REACTOR OUTPUT" value={pwr} />
          </div>
          <div className="border border-hud-green/40 bg-hud-green/5 px-3 py-2 text-center text-[11px] tracking-[0.3em] text-hud-green">
            STATUS: ONLINE // SECURE
          </div>
        </section>

        <section className="hud-panel scanlines flex min-h-[70vh] flex-col p-4 lg:min-h-[calc(100vh-9rem)]">
          <div className="flex items-center justify-between text-[10px] tracking-[0.25em] text-muted-foreground">
            <span>COMMS CHANNEL // ENCRYPTED</span>
            <span className="text-accent">{busy ? "PROCESSING…" : "IDLE"}</span>
          </div>

          <div ref={logRef} className="mt-3 flex-1 space-y-3 overflow-y-auto pr-2 text-sm leading-relaxed">
            {messages.map((m, i) => (
              <div key={i} className="whitespace-pre-wrap">
                <span
                  className={
                    m.role === "user"
                      ? "text-accent tracking-[0.2em]"
                      : "hud-glow text-primary tracking-[0.2em]"
                  }
                >
                  {m.role === "user" ? "USER >" : "J.A.R.V.I.S. >"}
                </span>{" "}
                <span className={m.role === "user" ? "text-foreground/85" : "text-foreground"}>
                  {m.content}
                </span>
              </div>
            ))}
            {busy && (
              <div className="text-primary/70">
                J.A.R.V.I.S. &gt; <span style={{ animation: "hud-blink 1s infinite" }}>▊</span>
              </div>
            )}
          </div>

          <form
            className="mt-4 flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void transmit(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter command for J.A.R.V.I.S..."
              className="h-11 flex-1 border border-border bg-black/60 px-3 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground/70 focus:border-primary focus:shadow-[0_0_18px_-4px_var(--color-hud-cyan)]"
            />
            <button
              type="button"
              onClick={toggleMic}
              aria-label="Voice command"
              className={`flex h-11 w-11 items-center justify-center border transition-colors ${
                listening
                  ? "border-destructive bg-destructive/20 text-destructive"
                  : "border-border text-accent hover:border-accent hover:bg-accent/10"
              }`}
              style={listening ? { animation: "hud-pulse 1.2s ease-in-out infinite" } : undefined}
            >
              {listening ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="flex h-11 items-center gap-2 border border-primary bg-primary/15 px-4 text-[11px] tracking-[0.25em] text-primary transition-all hover:bg-primary/25 hover:shadow-[0_0_20px_-4px_var(--color-hud-cyan)] disabled:opacity-40 disabled:hover:shadow-none"
            >
              <Send className="h-3.5 w-3.5" />
              TRANSMIT
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

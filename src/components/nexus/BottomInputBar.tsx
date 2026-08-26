import { Ear, Send } from "lucide-react";

export function BottomInputBar({
  value,
  onChange,
  onSubmit,
  onToggleVoice,
  listening,
  busy,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onToggleVoice: () => void;
  listening: boolean;
  busy: boolean;
}) {
  return (
    <form
      className="nexus-glass relative mt-4 flex items-center gap-3 rounded-xl p-2.5"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="relative">
        {listening && (
          <>
            <span className="pointer-events-none absolute inset-0 rounded-full border border-nexus-cyan/60 [animation:nexus-ring_1.6s_ease-out_infinite]" />
            <span className="pointer-events-none absolute inset-0 rounded-full border border-nexus-cyan/40 [animation:nexus-ring_1.6s_ease-out_infinite_.5s]" />
          </>
        )}
        <button
          type="button"
          onClick={onToggleVoice}
          aria-label="Hands-free voice mode"
          aria-pressed={listening}
          className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${
            listening
              ? "border-nexus-cyan bg-nexus-cyan/15 text-nexus-cyan shadow-[0_0_22px_-4px_var(--color-nexus-cyan)]"
              : "border-nexus-cyan/25 text-muted-foreground hover:border-nexus-cyan/60 hover:text-nexus-cyan"
          }`}
        >
          <Ear className="h-4 w-4" />
        </button>
      </div>

      {listening && (
        <div className="flex items-end gap-0.5" aria-hidden>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className="w-0.5 rounded-full bg-nexus-cyan"
              style={{
                height: `${8 + ((i * 7) % 16)}px`,
                animation: `hud-pulse ${0.7 + i * 0.12}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>
      )}

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={listening ? "Listening, sir…" : "Issue a directive to the Nexus…"}
        className="h-10 min-w-0 flex-1 bg-transparent px-2 text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
      />

      <button
        type="submit"
        disabled={busy || !value.trim()}
        className="flex h-10 shrink-0 items-center gap-2 rounded-lg border border-nexus-cyan/60 bg-nexus-cyan/12 px-3 font-mono text-[10px] tracking-[0.2em] text-nexus-cyan transition-all hover:bg-nexus-cyan/25 hover:shadow-[0_0_24px_-6px_var(--color-nexus-cyan)] disabled:opacity-40 disabled:hover:shadow-none md:px-4"
      >
        <Send className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">TRANSMIT SECURE</span>
      </button>
    </form>
  );
}

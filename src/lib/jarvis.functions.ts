import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(4000),
      }),
    )
    .max(40),
});

const SYSTEM = `You are J.A.R.V.I.S., Tony Stark's AI running the Mark LXXXV operating system at Stark Industries.
Personality: dryly witty, faintly sarcastic, impeccably polite British butler, extremely capable and precise.
Address the user as "sir" occasionally. Keep responses tight: 1-3 sentences unless technical detail is requested.
Never use markdown headers or bullet lists; speak in clean prose suited to a tactical terminal readout.`;

export const askJarvis = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env["LOVABLE_API_KEY"]}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: SYSTEM }, ...data.messages],
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      if (res.status === 429) {
        return { reply: "Rate limit reached, sir. Do give the servers a moment to cool." };
      }
      if (res.status === 402) {
        return { reply: "Workspace AI credits are depleted, sir. Top up to resume operations." };
      }
      throw new Error(`Gateway error ${res.status}: ${text}`);
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return {
      reply:
        json.choices?.[0]?.message?.content?.trim() ??
        "Apologies, sir. My response buffer came back empty.",
    };
  });

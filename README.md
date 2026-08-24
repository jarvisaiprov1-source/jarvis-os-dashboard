# Stark Interface

Create an ultra-slick, immersive, high-tech AI dashboard styled entirely as the Iron Man Stark Industries J.A.R.V.I.S. Mark LXXXV OS (Heads-Up Display). 

DESIGN & THEME:

- Dark sci-fi background (deep navy/black `#030712`).

- Glowing neon cyan (`#00F5D4`), electric blue (`#38BDF8`), and crisp white accents.

- Monospace technical fonts (like Consolas or Courier-style text).

LAYOUT STRUCTURE:

1. Header Bar:

   - Left side: "STARK INDUSTRIES // MARK LXXXV OS" with a blinking green active connection dot.

   - Right side: A live updating digital UTC clock.

2. Left Telemetry & Graphics Panel:

   - A central animated sci-fi HUD target graphic / Arc Reactor core with rotating concentric rings.

   - Live system metric cards underneath showing simulated or real-time CPU Load (e.g., ~5.2%) and RAM Usage (e.g., ~78.7%) with glowing progress bars.

   - Status indicator: "STATUS: ONLINE // SECURE".

3. Right Comms Channel (Chat Terminal):

   - A scrolling tactical log window displaying conversation history between USER and J.A.R.V.I.S. in a classic terminal style.

   - J.A.R.V.I.S. should respond with witty, sarcastic, highly capable personality traits reminiscent of Tony Stark's AI.

   - Bottom input row: A dark input field with placeholder "Enter command for J.A.R.V.I.S..." accompanied by a "TRANSMIT" button.

   - Microphone Button: Add an interactive voice-input button right next to the text input. When clicked, it should use the browser's native Web Speech API (SpeechRecognition) so the user can speak their commands directly into the prompt.

   - Text-to-Speech: Automatically make J.A.R.V.I.S. read his responses out loud using the browser's built-in `speechSynthesis` engine so he talks back to the user.

BEHAVIOR:

- Single session HUD layout (no complex multi-threading required, clean tactical interface).

- High interactivity, smooth hover states, glowing borders, and immediate responsiveness when transmitting text or voice commands.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a0c12e6c-b3c7-4c50-a016-475536d6267c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

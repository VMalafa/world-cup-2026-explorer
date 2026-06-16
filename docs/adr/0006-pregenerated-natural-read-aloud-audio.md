# Read-aloud authored lines play pre-generated natural TTS audio; Web Speech is the fallback

## Status

partially superseded — see the correction below.

> Correction (issue #29 implementation): the plan below assumed pre-generated TTS
> could run through the **Vercel AI Gateway**, like the Wonder images (ADR-0004).
> It can't — the installed `@ai-sdk/gateway` exposes only `languageModel` and
> `imageModel`, **no speech**. Natural cloud TTS would need a separate provider
> key (OpenAI / ElevenLabs) that isn't set up, plus a new dependency and a large
> batch of committed audio.
>
> So the **pre-generated-audio path is deferred**, and the immediate #29 fix is an
> **upgraded on-device Web Speech** (`useSpeak`): actively select the best
> available *neural* voice (iOS Siri/Enhanced, desktop Natural/Premium) instead of
> the robotic default, and fix the field reliability bugs — voices loading late
> (`voiceschanged`), long lines truncating (sentence chunking), and the ~15s
> Chrome/iOS pause/cut-off (a `resume()` keepalive). This fixes both halves of #29
> ("robotic" and "doesn't always work") at zero cost and offline. The clip-first
> runtime layer described below can still drop in later behind a real TTS key.

## Context & decision

The on-device Web Speech voice chosen in ADR-0001 sounded robotic and was flaky in
the field — specifically on Chrome for iOS (CriOS), the parent's actual browser:
voices load async, long utterances cut off, playback needs a user gesture (issue
#29). "Robotic" is inherent to the engine; only a different voice source fixes it.

The read-aloud copy is **authored and finite** (station prompts, **Wonders**,
native-language greetings), just like Wonder illustrations (ADR-0004) and match
data (ADR-0005). So we **pre-generate high-quality TTS clips at authoring/build
time** for every authored line — including correct native-language voices for
greetings — and bundle them as static audio. The app plays the static clip;
**Web Speech remains the graceful fallback** for any text without a clip (and
where audio fails to load). This is the recorded-audio fast-follow ADR-0001
explicitly anticipated, expanded from greetings-only to all authored lines.

What changed since ADR-0001 rejected this: the project now has an established
**build-time generation pipeline** pattern, so "regenerate on every copy change"
is just re-running a script (`scripts/`) — no longer the manual burden it was.

## Considered options

- **Runtime cloud TTS**: natural and handles any text, but adds an API key,
  per-play cost, latency, network dependency, and a mid-journey failure mode a
  child would hit. Rejected — breaks the offline/calm promise.
- **Only fix Web Speech reliability** (await voices, resume hack, chunk long
  text, gesture handling): cheap and keeps it free/offline, but the voice stays
  robotic — solves only half of #29. Adopted *as the fallback path*, not the
  primary fix.

## Consequences

- Generation has a matrix: line × reading level × (native language for greetings).
  A finite, automatable set; clips are small static audio.
- A TTS provider/voice is chosen at generation time only — swapping it is a
  re-run, not an app change (no runtime lock-in). Pick a warm, child-friendly,
  multilingual voice consistent with the "beautifully made children's atlas" brand.
- The audio affordance no longer depends on device voices being installed, so it
  works consistently across phones/tablets; fallback still degrades gracefully.
- Clips must be keyed to stable line text; a copy edit invalidates that line's
  clip and the generator re-renders it.

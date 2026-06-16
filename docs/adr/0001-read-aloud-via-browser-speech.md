# Read-aloud via the browser Web Speech API, not recorded audio files

## Status

amended by ADR-0006 — Web Speech is now the *fallback*; authored lines play
pre-generated natural audio. The hybrid upgrade this ADR anticipated was expanded
from greetings-only to all authored read-aloud, because the robotic default voice
(issue #29) hurt every line, not just greetings.

## Context & decision

The primary audience includes a non-reader (4) and an early reader (6), so every
**Station** of a **Match Day Journey** must be usable by listening, not reading.
We decided read-aloud is a must-have for v1 and will be produced by the browser's
**Web Speech API** (`speechSynthesis`), which reads any text aloud on-device,
per-language, at zero content cost and with no per-line network calls — so it
covers all 48 countries instantly, works offline-ish, and keeps a kids' app free
of streaming-TTS cost and third-party data sharing.

## Considered options

- **Pre-recorded / generated audio files** — best quality and pronunciation, but
  would mean producing and hosting audio for every line × 2 reading levels × 48
  countries and regenerating on every copy change. Rejected as too heavy for v1.
- **Hybrid (chosen direction)** — Web Speech for all journey text now; upgrade
  only the native-language greetings ("say hello") to recorded clips later, since
  that is the one place robotic mispronunciation is most noticeable.

## Consequences

- Voice quality and available languages vary by device/OS; the UI must degrade
  gracefully when a voice or the API is unavailable (show text, hide the audio
  affordance rather than break).
- Greetings may mispronounce until the recorded-clip fast-follow lands.

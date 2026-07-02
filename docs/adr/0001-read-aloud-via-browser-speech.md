# Read-aloud via the browser Web Speech API, not recorded audio files

## Status

accepted — and now upgraded for issue #29. Web Speech remains the primary
read-aloud engine, but `useSpeak` was hardened: it actively selects the best
on-device *neural* voice (not the robotic default) and fixes the field
reliability bugs (late voice loading, long-line truncation, the ~15s Chrome/iOS
pause). The pre-generated natural-audio upgrade (ADR-0006) is deferred — the AI
Gateway can't do TTS, so it needs a separate provider key not yet set up.

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

/**
 * Tiny synthesised sound effects — no audio files, so the APK stays small and
 * the game works completely offline.
 */

type Ctor = typeof AudioContext;

let audio: AudioContext | null = null;
let soundEnabled = true;
let hapticsEnabled = true;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audio) {
    const Ctor: Ctor | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: Ctor }).webkitAudioContext;
    if (!Ctor) return null;
    try {
      audio = new Ctor();
    } catch {
      return null;
    }
  }
  if (audio.state === "suspended") void audio.resume().catch(() => undefined);
  return audio;
}

function tone(
  frequency: number,
  delay: number,
  duration: number,
  gain = 0.05,
  type: OscillatorType = "sine",
): void {
  const ctx = getContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const envelope = ctx.createGain();
  const start = ctx.currentTime + delay;

  oscillator.type = type;
  oscillator.frequency.value = frequency;

  envelope.gain.setValueAtTime(0.0001, start);
  envelope.gain.exponentialRampToValueAtTime(gain, start + 0.012);
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(envelope);
  envelope.connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.03);
}

function vibrate(pattern: number | number[]): void {
  if (!hapticsEnabled) return;
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    try {
      navigator.vibrate(pattern);
    } catch {
      // ignore
    }
  }
}

export const sfx = {
  setSoundEnabled(enabled: boolean): void {
    soundEnabled = enabled;
  },
  setHapticsEnabled(enabled: boolean): void {
    hapticsEnabled = enabled;
  },
  pick(): void {
    if (soundEnabled) tone(560, 0, 0.06, 0.025, "triangle");
  },
  found(): void {
    if (soundEnabled) {
      tone(660, 0, 0.12, 0.05);
      tone(880, 0.08, 0.16, 0.045);
    }
    vibrate(12);
  },
  bonus(): void {
    if (soundEnabled) {
      tone(740, 0, 0.1, 0.045);
      tone(988, 0.07, 0.1, 0.04);
      tone(1319, 0.14, 0.18, 0.035);
    }
    vibrate([10, 30, 10]);
  },
  error(): void {
    if (soundEnabled) tone(170, 0, 0.16, 0.04, "sawtooth");
    vibrate(40);
  },
  win(): void {
    if (soundEnabled) {
      [523.25, 659.25, 783.99, 1046.5].forEach((frequency, i) =>
        tone(frequency, i * 0.1, 0.24, 0.05),
      );
    }
    vibrate([15, 40, 15, 40, 25]);
  },
};

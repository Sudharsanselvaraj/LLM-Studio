// Minimal WebAudio sound cues — synthesized, no assets. Muted by default;
// the AudioContext is created lazily on the first (post-gesture) play so it
// respects browser autoplay policy and stays SSR-safe (no window at import).

let ctx: AudioContext | null = null;
let muted = true;

export function setMuted(m: boolean): void {
  muted = m;
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    try {
      ctx = new AC();
    } catch {
      return null;
    }
  }
  return ctx;
}

export function playTone(
  freq: number,
  durMs = 120,
  type: OscillatorType = "sine",
  gain = 0.05,
): void {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") c.resume().catch(() => {});

  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(g);
  g.connect(c.destination);

  const now = c.currentTime;
  g.gain.setValueAtTime(gain, now);
  g.gain.exponentialRampToValueAtTime(0.0001, now + durMs / 1000);
  osc.start(now);
  osc.stop(now + durMs / 1000);
}

/** Short cue for switching districts. */
export const cueDistrict = () => playTone(300, 180, "triangle", 0.05);
/** Tiny blip per generated token; frequency nudged by token index. */
export const cueToken = (i: number) =>
  playTone(480 + (i % 8) * 40, 55, "sine", 0.03);

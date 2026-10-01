import { soundEnabled } from "@/store/settings";

let ctx: AudioContext | null = null;

type Ctor = typeof AudioContext;

export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const Ctx: Ctor | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: Ctor }).webkitAudioContext;
    if (!Ctx) return null;
    ctx ??= new Ctx();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

export function primeAudio(): void {
  getAudioContext();
}

function blip(freq: number, dur: number, delay = 0, type: OscillatorType = "sine", vol = 0.22) {
  if (!soundEnabled()) return;
  const ac = getAudioContext();
  if (!ac) return;
  const start = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(vol, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(start);
  osc.stop(start + dur + 0.02);
}

/** Quick noise burst for celebration texture (cymbal-like shimmer). */
function shimmer(dur: number, delay: number, vol = 0.06) {
  if (!soundEnabled()) return;
  const ac = getAudioContext();
  if (!ac) return;
  const start = ac.currentTime + delay;
  const bufLen = Math.round(ac.sampleRate * dur);
  const buf = ac.createBuffer(1, bufLen, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
  const src = ac.createBufferSource();
  src.buffer = buf;
  // Band-pass to make it sparkly, not harsh
  const filter = ac.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(6000, start);
  filter.Q.setValueAtTime(2, start);
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(vol, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  src.connect(filter).connect(gain).connect(ac.destination);
  src.start(start);
  src.stop(start + dur + 0.02);
}

export const sfx = {
  tap(): void {
    blip(680, 0.06, 0, "triangle");
  },
  pick(): void {
    blip(880, 0.08, 0, "triangle");
  },
  win(): void {
    [523, 659, 784, 1047].forEach((f, i) => blip(f, 0.14, i * 0.085));
  },
  star(): void {
    [880, 1175, 1568].forEach((f, i) => blip(f, 0.1, i * 0.06));
  },
  /** Rich celebratory hooray fanfare — plays when a full stage is completed. */
  hooray(): void {
    // Triumphant ascending arpeggio (C major → high C) with layered harmonics
    const fanfare = [523, 659, 784, 880, 1047, 1319, 1568];
    fanfare.forEach((f, i) => {
      blip(f, 0.22, i * 0.07, "triangle", 0.18);
      // Harmonic layer for richness
      blip(f * 1.5, 0.16, i * 0.07 + 0.01, "sine", 0.06);
    });
    // Final triumphant chord (C-E-G-C at top)
    const chordDelay = fanfare.length * 0.07 + 0.04;
    [1047, 1319, 1568, 2093].forEach((f) => {
      blip(f, 0.45, chordDelay, "triangle", 0.12);
    });
    // Sparkle shimmer on top
    shimmer(0.5, chordDelay + 0.05, 0.04);
    shimmer(0.3, chordDelay + 0.2, 0.03);
  },
  /** Short ascending chime when advancing to next level. */
  levelUp(): void {
    blip(660, 0.09, 0, "triangle", 0.16);
    blip(880, 0.09, 0.06, "triangle", 0.16);
    blip(1100, 0.12, 0.12, "triangle", 0.13);
  },
  oops(): void {
    blip(300, 0.18, 0, "sine");
    blip(220, 0.2, 0.08, "sine");
  },
  whoosh(): void {
    blip(420, 0.09, 0, "sawtooth");
  },
};

export const NOTES: Record<string, number> = {
  do: 262,
  re: 293,
  mi: 330,
  fa: 349,
  sol: 392,
  la: 440,
  si: 494,
  do2: 523,
};

export function playNote(name: keyof typeof NOTES): void {
  blip(NOTES[name] ?? 440, 0.3, 0, "sine");
}

export function playMelody(names: (keyof typeof NOTES)[], step = 0.18): void {
  names.forEach((n, i) => blip(NOTES[n] ?? 440, 0.26, i * step, "sine"));
}

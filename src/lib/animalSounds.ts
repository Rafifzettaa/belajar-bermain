import { getAudioContext } from "./audio";
import { soundEnabled } from "@/store/settings";

export type AnimalId =
  | "dog"
  | "cat"
  | "cow"
  | "duck"
  | "bird"
  | "frog"
  | "sheep"
  | "horse"
  | "elephant"
  | "chicken"
  | "bee"
  | "chick";

export const ANIMAL_LABEL: Record<AnimalId, { emoji: string; label: string }> = {
  dog: { emoji: "🐶", label: "anjing" },
  cat: { emoji: "🐱", label: "kucing" },
  cow: { emoji: "🐮", label: "sapi" },
  duck: { emoji: "🦆", label: "bebek" },
  bird: { emoji: "🐦", label: "burung" },
  frog: { emoji: "🐸", label: "katak" },
  sheep: { emoji: "🐑", label: "domba" },
  horse: { emoji: "🐴", label: "kuda" },
  elephant: { emoji: "🐘", label: "gajah" },
  chicken: { emoji: "🐔", label: "ayam" },
  bee: { emoji: "🐝", label: "lebah" },
  chick: { emoji: "🐤", label: "anak ayam" },
};

interface ToneOpts {
  f0: number;
  f1?: number;
  at?: number;
  dur: number;
  peak?: number;
  attack?: number;
  type?: OscillatorType;
  filter?: { type: BiquadFilterType; freq: number; q?: number };
  am?: { rate: number; depth: number };
  vibrato?: { rate: number; depth: number };
}

function tone(ac: AudioContext, o: ToneOpts): void {
  const t0 = ac.currentTime + (o.at ?? 0);
  const peak = o.peak ?? 0.2;
  const atk = o.attack ?? 0.02;

  const osc = ac.createOscillator();
  osc.type = o.type ?? "sine";
  osc.frequency.setValueAtTime(Math.max(20, o.f0), t0);
  if (o.f1 && o.f1 !== o.f0) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, o.f1), t0 + o.dur);
  }

  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(peak, t0 + atk);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);

  let head: AudioNode = osc;
  if (o.filter) {
    const f = ac.createBiquadFilter();
    f.type = o.filter.type;
    f.frequency.value = o.filter.freq;
    if (o.filter.q) f.Q.value = o.filter.q;
    head.connect(f);
    head = f;
  }
  head.connect(gain);

  if (o.am) {
    const lfo = ac.createOscillator();
    lfo.frequency.value = o.am.rate;
    const depth = ac.createGain();
    depth.gain.value = peak * o.am.depth;
    lfo.connect(depth).connect(gain.gain);
    lfo.start(t0);
    lfo.stop(t0 + o.dur + 0.05);
  }
  if (o.vibrato) {
    const lfo = ac.createOscillator();
    lfo.frequency.value = o.vibrato.rate;
    const depth = ac.createGain();
    depth.gain.value = o.vibrato.depth;
    lfo.connect(depth).connect(osc.frequency);
    lfo.start(t0);
    lfo.stop(t0 + o.dur + 0.05);
  }

  gain.connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + o.dur + 0.04);
}

function noiseBurst(
  ac: AudioContext,
  o: { at?: number; dur: number; peak?: number; filter?: { type: BiquadFilterType; freq: number } },
): void {
  const t0 = ac.currentTime + (o.at ?? 0);
  const len = Math.max(1, Math.floor(ac.sampleRate * o.dur));
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);

  const src = ac.createBufferSource();
  src.buffer = buf;
  const gain = ac.createGain();
  gain.gain.setValueAtTime(o.peak ?? 0.1, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);

  let head: AudioNode = src;
  if (o.filter) {
    const f = ac.createBiquadFilter();
    f.type = o.filter.type;
    f.frequency.value = o.filter.freq;
    head.connect(f);
    head = f;
  }
  head.connect(gain).connect(ac.destination);
  src.start(t0);
  src.stop(t0 + o.dur + 0.02);
}

const VOICES: Record<AnimalId, (ac: AudioContext) => void> = {
  dog: (ac) => {
    tone(ac, { type: "sawtooth", f0: 300, f1: 140, dur: 0.14, peak: 0.24, filter: { type: "lowpass", freq: 1100 } });
    noiseBurst(ac, { dur: 0.06, peak: 0.09, filter: { type: "bandpass", freq: 900 } });
    tone(ac, { type: "sawtooth", f0: 285, f1: 130, dur: 0.16, at: 0.28, peak: 0.24, filter: { type: "lowpass", freq: 1100 } });
    noiseBurst(ac, { at: 0.28, dur: 0.06, peak: 0.09, filter: { type: "bandpass", freq: 900 } });
  },
  cat: (ac) => {
    tone(ac, { type: "sawtooth", f0: 620, f1: 900, dur: 0.18, peak: 0.16, filter: { type: "bandpass", freq: 1300, q: 3 }, vibrato: { rate: 14, depth: 24 } });
    tone(ac, { type: "sawtooth", f0: 900, f1: 470, dur: 0.36, at: 0.18, peak: 0.16, filter: { type: "bandpass", freq: 1200, q: 3 }, vibrato: { rate: 18, depth: 30 } });
  },
  cow: (ac) => {
    tone(ac, { type: "sawtooth", f0: 140, f1: 118, dur: 0.85, peak: 0.22, filter: { type: "lowpass", freq: 700 }, vibrato: { rate: 6, depth: 7 } });
  },
  duck: (ac) => {
    tone(ac, { type: "sawtooth", f0: 420, f1: 300, dur: 0.18, peak: 0.19, filter: { type: "bandpass", freq: 1500, q: 2 }, am: { rate: 28, depth: 0.8 } });
  },
  bird: (ac) => {
    [0, 0.13, 0.26].forEach((at, i) =>
      tone(ac, { type: "sine", f0: 2100 + i * 120, f1: 3300, dur: 0.07, at, peak: 0.15 }),
    );
  },
  frog: (ac) => {
    tone(ac, { type: "square", f0: 150, f1: 130, dur: 0.32, peak: 0.15, filter: { type: "lowpass", freq: 900 }, am: { rate: 22, depth: 0.9 } });
  },
  sheep: (ac) => {
    tone(ac, { type: "sawtooth", f0: 520, f1: 430, dur: 0.65, peak: 0.18, filter: { type: "bandpass", freq: 1200, q: 2 }, vibrato: { rate: 12, depth: 40 } });
  },
  horse: (ac) => {
    tone(ac, { type: "sawtooth", f0: 460, f1: 240, dur: 0.7, peak: 0.18, filter: { type: "bandpass", freq: 1000, q: 2 }, vibrato: { rate: 26, depth: 70 } });
    noiseBurst(ac, { dur: 0.5, peak: 0.045, filter: { type: "highpass", freq: 800 } });
  },
  elephant: (ac) => {
    tone(ac, { type: "sawtooth", f0: 220, f1: 420, dur: 0.4, peak: 0.2, filter: { type: "lowpass", freq: 1200 }, vibrato: { rate: 16, depth: 12 } });
    tone(ac, { type: "sawtooth", f0: 420, f1: 260, dur: 0.45, at: 0.4, peak: 0.2, filter: { type: "lowpass", freq: 1200 }, vibrato: { rate: 18, depth: 14 } });
  },
  chicken: (ac) => {
    tone(ac, { type: "square", f0: 620, f1: 380, dur: 0.09, peak: 0.15, filter: { type: "bandpass", freq: 1600, q: 2 } });
    tone(ac, { type: "square", f0: 700, f1: 420, dur: 0.11, at: 0.16, peak: 0.15, filter: { type: "bandpass", freq: 1700, q: 2 } });
  },
  bee: (ac) => {
    tone(ac, { type: "sawtooth", f0: 200, f1: 215, dur: 0.9, peak: 0.12, filter: { type: "lowpass", freq: 1500 }, am: { rate: 42, depth: 0.7 }, vibrato: { rate: 5, depth: 10 } });
  },
  chick: (ac) => {
    [0, 0.16].forEach((at) =>
      tone(ac, { type: "sine", f0: 3000, f1: 3600, dur: 0.07, at, peak: 0.14 }),
    );
  },
};

const fileCache = new Map<AnimalId, HTMLAudioElement>();

export function playAnimal(id: AnimalId): void {
  if (!soundEnabled() || typeof window === "undefined") return;

  let a = fileCache.get(id);
  if (!a) {
    a = new Audio(`/sounds/animals/${id}.mp3`);
    a.preload = "auto";
    fileCache.set(id, a);
  }
  try {
    a.currentTime = 0;
  } catch {
    /* noop */
  }
  const p = a.play();
  if (p) void p.catch(() => synthAnimal(id));
}

function synthAnimal(id: AnimalId): void {
  if (!soundEnabled()) return;
  const ac = getAudioContext();
  if (!ac) return;
  const voice = VOICES[id];
  if (!voice) return;
  voice(ac);
}

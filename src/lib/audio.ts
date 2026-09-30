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

function blip(freq: number, dur: number, delay = 0, type: OscillatorType = "sine") {
  if (!soundEnabled()) return;
  const ac = getAudioContext();
  if (!ac) return;
  const start = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.22, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(start);
  osc.stop(start + dur + 0.02);
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

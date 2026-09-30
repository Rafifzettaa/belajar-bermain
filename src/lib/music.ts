import { useSettings } from "@/store/settings";

const SRC = "/sounds/bgm.mp3";
const VOLUME = 0.24;

let el: HTMLAudioElement | null = null;
let armed = false;

function ensure(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!el) {
    el = new Audio(SRC);
    el.loop = true;
    el.preload = "auto";
    el.volume = VOLUME;
  }
  return el;
}

export function startMusic(): void {
  if (!useSettings.getState().soundOn) return;
  const a = ensure();
  if (!a) return;
  void a.play().catch(() => {});
}

export function pauseMusic(): void {
  el?.pause();
}

export function syncMusic(): void {
  if (useSettings.getState().soundOn) startMusic();
  else pauseMusic();
}

export function armMusic(): void {
  if (typeof window === "undefined" || armed) return;
  armed = true;

  startMusic();

  const kick = () => {
    startMusic();
    window.removeEventListener("pointerdown", kick);
    window.removeEventListener("keydown", kick);
    window.removeEventListener("touchstart", kick);
  };
  window.addEventListener("pointerdown", kick);
  window.addEventListener("keydown", kick);
  window.addEventListener("touchstart", kick, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pauseMusic();
    else startMusic();
  });
}

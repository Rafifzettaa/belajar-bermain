"use client";

import { useSettings } from "@/store/settings";
import { syncMusic } from "@/lib/music";
import { sfx } from "@/lib/audio";

export function SoundToggle({ className = "" }: { className?: string }) {
  const soundOn = useSettings((s) => s.soundOn);
  const toggleSound = useSettings((s) => s.toggleSound);

  return (
    <button
      type="button"
      aria-label={soundOn ? "Matikan suara" : "Nyalakan suara"}
      aria-pressed={soundOn}
      onClick={() => {
        toggleSound();
        syncMusic();
        if (useSettings.getState().soundOn) sfx.pick();
      }}
      className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/85 text-3xl shadow-sm active:translate-y-0.5 ${className}`}
    >
      <span aria-hidden="true">{soundOn ? "🔊" : "🔇"}</span>
    </button>
  );
}

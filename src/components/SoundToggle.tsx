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
      className={`group relative flex h-24 w-24 shrink-0 items-center justify-center rounded-[1.75rem] border-2 border-white bg-white/95 text-4xl shadow-[0_5px_0_rgba(0,0,0,0.08)] active:translate-y-1 active:shadow-none sm:h-28 sm:w-28 sm:rounded-[2rem] ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-2 right-2 top-1 h-2 rounded-full bg-white/60"
      />
      <span className="transition-transform group-hover:scale-110 group-active:scale-90">
        {soundOn ? "🔊" : "🔇"}
      </span>
    </button>
  );
}

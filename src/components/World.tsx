"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useProgress } from "@/store/progress";
import type { GameMeta } from "@/games/_shared/types";
import { GAMES, randomGameId } from "@/games/registry";
import { sfx } from "@/lib/audio";
import { haptic } from "@/lib/haptics";
import { SoundToggle } from "./SoundToggle";

const TINT: Record<GameMeta["color"], { bg: string; edge: string; text: string }> = {
  sky: { bg: "bg-sky/60", edge: "border-sky-deep", text: "text-sky-deep" },
  sun: { bg: "bg-sun/60", edge: "border-sun-deep", text: "text-sun-deep" },
  grass: { bg: "bg-grass/60", edge: "border-grass-deep", text: "text-grass-deep" },
  bubble: { bg: "bg-bubble/60", edge: "border-bubble-deep", text: "text-bubble-deep" },
};

export function World() {
  const games = useProgress((s) => s.games);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const totalStars = Object.values(games).reduce((a, g) => a + g.stars, 0);
  const maxStars = GAMES.length * 3;

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-4xl flex-col gap-6 px-4 py-7 safe-bottom sm:px-6">
      <SoundToggle className="absolute right-4 top-4 sm:right-6" />
      <header className="flex flex-col items-center gap-3 text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          className="text-7xl leading-none sm:text-8xl"
        >
          🎈
        </motion.div>
        <h1 className="text-4xl sm:text-5xl">Bermain Belajar</h1>
        <div className="flex items-center gap-2 rounded-full bg-white/80 px-5 py-2 text-2xl shadow-sm">
          <span aria-hidden="true">⭐</span>
          <span className="tabular-nums">
            {mounted ? totalStars : 0}
            <span className="text-ink/40">/{maxStars}</span>
          </span>
        </div>
      </header>

      <button
        onClick={() => {
          sfx.pick();
          haptic.tap();
          window.location.assign(`/main/${randomGameId()}/`);
        }}
        className="mx-auto flex min-h-24 items-center gap-3 rounded-[2rem] bg-ink px-8 text-2xl text-paper shadow-[0_6px_0_rgba(0,0,0,0.35)] active:translate-y-1 active:shadow-none"
      >
        <span aria-hidden="true" className="text-3xl">
          🎲
        </span>
        Kejutkan aku!
      </button>

      <nav className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map(({ meta: game }, i) => {
          const rec = mounted ? games[game.id] : undefined;
          const tint = TINT[game.color];
          return (
            <motion.div
              key={game.id}
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05 * i, type: "spring", stiffness: 240, damping: 20 }}
              className="h-full"
            >
              <a
                href={`/main/${game.id}/`}
                aria-label={`${game.title}. ${game.blurb}. ${rec?.stars ?? 0} bintang`}
                className={`group relative flex h-full min-h-[170px] flex-col items-center justify-center gap-2 rounded-[2.5rem] border-4 p-5 ${tint.bg} ${tint.edge} shadow-[0_6px_0_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none`}
              >
                {rec && rec.stars > 0 && (
                  <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-base tabular-nums">
                    ⭐ {rec.stars}
                  </span>
                )}
                <span className="text-6xl leading-none transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
                  {game.emoji}
                </span>
                <span className="line-clamp-2 text-2xl leading-tight sm:text-[1.6rem]">{game.title}</span>
                <span className={`line-clamp-2 text-base ${tint.text}`}>{game.blurb}</span>
              </a>
            </motion.div>
          );
        })}
      </nav>

      <footer className="mt-auto pt-4 text-center text-base text-ink/60">
        Tanpa akun · Tanpa iklan · Data tersimpan di perangkat ini
      </footer>
    </div>
  );
}

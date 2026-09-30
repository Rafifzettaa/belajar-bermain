"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useProgress } from "@/store/progress";
import type { GameMeta } from "@/games/_shared/types";
import { GAMES, randomGameId } from "@/games/registry";
import { sfx } from "@/lib/audio";
import { haptic } from "@/lib/haptics";
import { SoundToggle } from "./SoundToggle";

const TINT: Record<GameMeta["color"], { bg: string; edge: string; shadow: string; text: string }> = {
  sky: {
    bg: "bg-sky/70",
    edge: "border-sky-deep",
    shadow: "shadow-[0_8px_0_oklch(0.5_0.13_232)]",
    text: "text-sky-deep",
  },
  sun: {
    bg: "bg-sun/70",
    edge: "border-sun-deep",
    shadow: "shadow-[0_8px_0_oklch(0.56_0.16_62)]",
    text: "text-sun-deep",
  },
  grass: {
    bg: "bg-grass/70",
    edge: "border-grass-deep",
    shadow: "shadow-[0_8px_0_oklch(0.44_0.13_145)]",
    text: "text-grass-deep",
  },
  bubble: {
    bg: "bg-bubble/70",
    edge: "border-bubble-deep",
    shadow: "shadow-[0_8px_0_oklch(0.49_0.15_330)]",
    text: "text-bubble-deep",
  },
};

// Dekorasi awan mengambang — pure visual, tidak ganggu interaksi
const CLOUDS = [
  { left: "6%", top: "9%", size: "text-5xl", delay: "0s", dur: "7s" },
  { left: "82%", top: "6%", size: "text-6xl", delay: "1.2s", dur: "8.5s" },
  { left: "12%", top: "72%", size: "text-4xl", delay: "0.6s", dur: "9s" },
  { left: "88%", top: "64%", size: "text-5xl", delay: "2s", dur: "7.5s" },
];

export function World() {
  const games = useProgress((s) => s.games);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const totalStars = Object.values(games).reduce((a, g) => a + g.stars, 0);
  const maxStars = GAMES.length * 3;

  return (
    <div className="paper-grain relative mx-auto flex min-h-dvh w-full max-w-4xl flex-col gap-6 overflow-hidden px-4 py-7 safe-bottom sm:px-6">
      {/* Latar awan */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {CLOUDS.map((c, i) => (
          <span
            key={i}
            className={`absolute ${c.size} opacity-60 animate-floaty`}
            style={{
              left: c.left,
              top: c.top,
              animationDelay: c.delay,
              animationDuration: c.dur,
            }}
          >
            ☁️
          </span>
        ))}
      </div>

      <SoundToggle className="absolute right-4 top-4 z-10 sm:right-6" />

      <header className="relative flex flex-col items-center gap-3 text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          className="text-7xl leading-none sm:text-8xl"
        >
          🎈
        </motion.div>
        <h1 className="text-4xl sm:text-5xl">Bermain Belajar</h1>
        <motion.div
          key={totalStars}
          initial={{ scale: 1.25 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="flex items-center gap-2 rounded-full border-4 border-sun-deep bg-sun/70 px-5 py-2 text-2xl shadow-[0_5px_0_oklch(0.56_0.16_62)]"
        >
          <span aria-hidden="true">⭐</span>
          <span className="tabular-nums">
            {mounted ? totalStars : 0}
            <span className="text-ink/40">/{maxStars}</span>
          </span>
        </motion.div>
      </header>

      <motion.button
        whileTap={{ scale: 0.94, y: 6 }}
        transition={{ type: "spring", stiffness: 600, damping: 25 }}
        onClick={() => {
          sfx.pick();
          haptic.tap();
          window.location.assign(`/main/${randomGameId()}/`);
        }}
        className="relative mx-auto flex min-h-24 items-center gap-3 rounded-[2rem] border-4 border-sun-deep bg-sun px-8 text-2xl text-ink shadow-[0_8px_0_oklch(0.56_0.16_62)] active:shadow-none"
      >
        <span aria-hidden="true" className="text-3xl">
          🎲
        </span>
        Kejutkan aku!
      </motion.button>

      <nav className="relative grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map(({ meta: game }, i) => {
          const rec = mounted ? games[game.id] : undefined;
          const tint = TINT[game.color];
          // Kemiringan kecil bergantian biar ga kaku kayak template
          const tilt = [-1.2, 0.8, -0.6, 1.1, -0.9, 0.7][i % 6];
          const emojiSize = ["text-6xl", "text-[4.2rem]", "text-6xl", "text-[3.8rem]"][i % 4];
          return (
            <motion.div
              key={game.id}
              initial={{ y: 24, opacity: 0, rotate: 0 }}
              animate={{ y: 0, opacity: 1, rotate: tilt }}
              transition={{ delay: 0.05 * i, type: "spring", stiffness: 240, damping: 20 }}
              className="h-full"
            >
              <motion.a
                href={`/main/${game.id}/`}
                aria-label={`${game.title}. ${game.blurb}. ${rec?.stars ?? 0} bintang`}
                whileTap={{ scale: 0.96, y: 6 }}
                transition={{ type: "spring", stiffness: 600, damping: 25 }}
                className={`group relative flex h-full min-h-[170px] flex-col items-center justify-center gap-2 rounded-[2.5rem] border-4 p-5 ${tint.bg} ${tint.edge} ${tint.shadow} active:shadow-none`}
              >
                {rec && rec.stars > 0 && (
                  <span className="absolute right-4 top-4 rounded-full border-2 border-sun-deep bg-white/95 px-3 py-1 text-base tabular-nums">
                    ⭐ {rec.stars}
                  </span>
                )}
                <span className={`${emojiSize} leading-none transition-transform duration-200 group-hover:scale-110 group-active:scale-95`}>
                  {game.emoji}
                </span>
                <span className="line-clamp-2 text-2xl leading-tight sm:text-[1.6rem]">{game.title}</span>
                <span className={`line-clamp-2 text-base ${tint.text}`}>{game.blurb}</span>
              </motion.a>
            </motion.div>
          );
        })}
      </nav>

      <footer className="relative mt-auto pt-4 text-center text-base text-ink/60">
        Tanpa akun · Tanpa iklan · Data tersimpan di perangkat ini
      </footer>
    </div>
  );
}

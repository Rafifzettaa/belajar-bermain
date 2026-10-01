"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useProgress } from "@/store/progress";
import type { GameMeta } from "@/games/_shared/types";
import { GAMES, randomGameId } from "@/games/registry";
import { sfx } from "@/lib/audio";
import { haptic } from "@/lib/haptics";
import { SoundToggle } from "./SoundToggle";

const TINT: Record<
  GameMeta["color"],
  {
    bg: string;
    edge: string;
    shadow: string;
    text: string;
    medallion: string;
    badge: string;
  }
> = {
  sky: {
    bg: "bg-sky/40",
    edge: "border-sky-deep/60",
    shadow: "shadow-[0_8px_0_oklch(0.62_0.13_232)] active:shadow-[0_2px_0_oklch(0.62_0.13_232)]",
    text: "text-sky-deep",
    medallion: "bg-gradient-to-b from-white to-sky/50",
    badge: "bg-sky/50 border-sky-deep/40 text-sky-deep",
  },
  sun: {
    bg: "bg-sun/40",
    edge: "border-sun-deep/60",
    shadow: "shadow-[0_8px_0_oklch(0.68_0.16_62)] active:shadow-[0_2px_0_oklch(0.68_0.16_62)]",
    text: "text-sun-deep",
    medallion: "bg-gradient-to-b from-white to-sun/50",
    badge: "bg-sun/50 border-sun-deep/40 text-sun-deep",
  },
  grass: {
    bg: "bg-grass/40",
    edge: "border-grass-deep/60",
    shadow: "shadow-[0_8px_0_oklch(0.55_0.14_145)] active:shadow-[0_2px_0_oklch(0.55_0.14_145)]",
    text: "text-grass-deep",
    medallion: "bg-gradient-to-b from-white to-grass/50",
    badge: "bg-grass/50 border-grass-deep/40 text-grass-deep",
  },
  bubble: {
    bg: "bg-bubble/40",
    edge: "border-bubble-deep/60",
    shadow: "shadow-[0_8px_0_oklch(0.6_0.16_330)] active:shadow-[0_2px_0_oklch(0.6_0.16_330)]",
    text: "text-bubble-deep",
    medallion: "bg-gradient-to-b from-white to-bubble/50",
    badge: "bg-bubble/50 border-bubble-deep/40 text-bubble-deep",
  },
};

export function World() {
  const games = useProgress((s) => s.games);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const totalStars = Object.values(games).reduce((a, g) => a + g.stars, 0);
  const maxStars = GAMES.length * 3;

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-4xl flex-col gap-6 px-4 py-6 safe-bottom sm:px-6">
      {/* Sound toggle at top right */}
      <SoundToggle className="absolute right-4 top-4 z-10 sm:right-6" />

      {/* Decorative Floating Clouds */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-2 text-4xl opacity-50 sm:text-5xl animate-cloud-drift"
      >
        ☁️
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-24 top-6 text-3xl opacity-40 sm:text-4xl animate-cloud-drift"
        style={{ animationDelay: "3s" }}
      >
        ☁️
      </div>

      {/* Header: Playground Welcome Banner */}
      <header className="flex flex-col items-center gap-2 pt-2 text-center">
        {/* Animated Hot Air Balloon Mascot */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          className="relative"
        >
          <span className="animate-floaty inline-block text-7xl leading-none drop-shadow-md sm:text-8xl">
            🎈
          </span>
        </motion.div>

        {/* Welcome Tag */}
        <div className="flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-100/90 px-4 py-1 text-sm font-extrabold text-amber-900 shadow-xs sm:text-base">
          <span>🎪</span>
          <span>TAMAN PETUALANGAN</span>
          <span>🎪</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-ink drop-shadow-xs">
          Bermain Belajar
        </h1>

        {/* Golden Star Treasure Badge */}
        <div className="flex items-center gap-2 rounded-full border-2 border-amber-300 bg-gradient-to-r from-amber-100 to-amber-200/90 px-6 py-2 text-2xl font-black text-amber-950 shadow-[0_4px_0_#d97706]">
          <span aria-hidden="true" className="animate-bounce-subtle inline-block text-2xl">
            ⭐
          </span>
          <span className="tabular-nums">
            {mounted ? totalStars : 0}
            <span className="text-amber-950/40 font-bold">/{maxStars} Bintang</span>
          </span>
        </div>
      </header>

      {/* 3D Tactile Surprise / Random Game Button (>= 96px) */}
      <button
        onClick={() => {
          sfx.pick();
          haptic.tap();
          window.location.assign(`/main/${randomGameId()}/`);
        }}
        className="group relative mx-auto flex min-h-24 w-full max-w-sm select-none items-center justify-center gap-3 overflow-hidden rounded-[2.25rem] border-4 border-white bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 px-8 text-2xl font-black text-white shadow-[0_8px_0_#c2410c] transition-all active:translate-y-1.5 active:shadow-[0_2px_0_#c2410c]"
      >
        {/* Glossy top pill highlight */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-6 right-6 top-1.5 h-3 rounded-full bg-white/35"
        />
        <span
          aria-hidden="true"
          className="text-4xl transition-transform duration-200 group-hover:scale-125 group-hover:rotate-12"
        >
          🎲
        </span>
        <div className="flex flex-col text-left">
          <span className="text-2xl leading-tight font-black">Petualangan Acak!</span>
          <span className="text-sm font-semibold text-amber-100">Kejutkan aku</span>
        </div>
        <span aria-hidden="true" className="text-3xl">
          ✨
        </span>
      </button>

      {/* Adventure Stations Grid */}
      <nav aria-label="Daftar Wahana Permainan" className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map(({ meta: game }, i) => {
          const rec = mounted ? games[game.id] : undefined;
          const tint = TINT[game.color];
          const starsEarned = rec?.stars ?? 0;

          return (
            <motion.div
              key={game.id}
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.04 * i, type: "spring", stiffness: 240, damping: 20 }}
              className="h-full"
            >
              <a
                href={`/main/${game.id}/`}
                aria-label={`${game.title}. ${game.blurb}. ${starsEarned} dari 3 bintang`}
                className={`group relative flex h-full min-h-[190px] flex-col items-center justify-center gap-2 overflow-hidden rounded-[2.75rem] border-4 p-5 transition-all duration-150 active:translate-y-1.5 ${tint.bg} ${tint.edge} ${tint.shadow}`}
              >
                {/* Glossy top highlight strip */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-8 right-8 top-1.5 h-3 rounded-full bg-white/40"
                />

                {/* Station Pin Badge */}
                <div
                  className={`absolute left-4 top-3.5 flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-black uppercase tracking-wider ${tint.badge}`}
                >
                  <span aria-hidden="true">🚩</span>
                  <span>Pos {i + 1}</span>
                </div>

                {/* Star Slots Display */}
                <div className="absolute right-4 top-3.5 flex items-center gap-1 rounded-full border border-white/80 bg-white/90 px-2.5 py-1 shadow-xs">
                  {[1, 2, 3].map((star) => (
                    <span
                      key={star}
                      className={`text-base sm:text-lg ${
                        starsEarned >= star ? "text-amber-400" : "opacity-25 grayscale"
                      }`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>

                {/* Mascot Medallion */}
                <div
                  className={`mt-4 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white ${tint.medallion} shadow-[0_4px_0_rgba(0,0,0,0.06)] sm:h-28 sm:w-28`}
                >
                  <span className="text-5xl leading-none transition-transform duration-200 group-hover:scale-115 group-active:scale-95 sm:text-6xl">
                    {game.emoji}
                  </span>
                </div>

                {/* Station Title */}
                <span className="line-clamp-2 text-2xl font-black leading-tight sm:text-[1.7rem] text-ink">
                  {game.title}
                </span>

                {/* Station Blurb */}
                <span className={`line-clamp-2 text-center text-base font-bold ${tint.text}`}>
                  {game.blurb}
                </span>
              </a>
            </motion.div>
          );
        })}
      </nav>

      {/* Friendly Playground Footer */}
      <footer className="mt-auto pt-4 text-center text-sm font-semibold text-ink/60">
        🏕️ Taman Petualangan · Tanpa akun · Tanpa iklan · Aman untuk anak
      </footer>
    </div>
  );
}

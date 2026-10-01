"use client";

import { useEffect, useMemo } from "react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useGame } from "./useGame";
import { RewardOverlay, StarRow } from "@/components/RewardOverlay";
import { BigButton } from "@/components/BigButton";
import { SoundToggle } from "@/components/SoundToggle";
import { starsFor, useProgress } from "@/store/progress";
import type { GameMeta } from "./types";

interface Props {
  game: GameMeta;
  onHome: () => void;
  children: (ctx: ReturnType<typeof useGame>) => ReactNode;
}

const ACCENT = {
  sky: {
    bg: "bg-sky",
    deep: "bg-sky-deep",
    text: "text-sky-deep",
    shadow: "shadow-[0_6px_0_oklch(0.5_0.13_232)]",
    gradient: "from-sky to-sky-deep",
    light: "bg-sky/20",
    badge: "border-sky-deep/30 bg-sky/20 text-sky-deep",
  },
  sun: {
    bg: "bg-sun",
    deep: "bg-sun-deep",
    text: "text-sun-deep",
    shadow: "shadow-[0_6px_0_oklch(0.56_0.16_62)]",
    gradient: "from-sun to-sun-deep",
    light: "bg-sun/20",
    badge: "border-sun-deep/30 bg-sun/20 text-sun-deep",
  },
  grass: {
    bg: "bg-grass",
    deep: "bg-grass-deep",
    text: "text-grass-deep",
    shadow: "shadow-[0_6px_0_oklch(0.44_0.13_145)]",
    gradient: "from-grass to-grass-deep",
    light: "bg-grass/20",
    badge: "border-grass-deep/30 bg-grass/20 text-grass-deep",
  },
  bubble: {
    bg: "bg-bubble",
    deep: "bg-bubble-deep",
    text: "text-bubble-deep",
    shadow: "shadow-[0_6px_0_oklch(0.49_0.15_330)]",
    gradient: "from-bubble to-bubble-deep",
    light: "bg-bubble/20",
    badge: "border-bubble-deep/30 bg-bubble/20 text-bubble-deep",
  },
} as const;

export function GameShell({ game, onHome, children }: Props) {
  const ctx = useGame(game.levels, ({ score, total }) => {
    useProgress.getState().save(game.id, starsFor(score / total), score, total);
  });
  const accent = ACCENT[game.color];

  useEffect(() => {
    if (ctx.phase === "playing" && ctx.index > 0) {
      document.documentElement.scrollTop = 0;
    }
  }, [ctx.phase, ctx.index]);

  const pct = useMemo(
    () => (ctx.phase === "complete" ? 100 : (ctx.index / ctx.total) * 100),
    [ctx.index, ctx.total, ctx.phase],
  );

  return (
    <div className="paper-grain flex min-h-dvh flex-col safe-bottom">
      {/* Adventure Top Nav */}
      <header className="flex flex-wrap items-center gap-3 px-3 pt-3 sm:flex-nowrap sm:px-5">
        {/* 3D Toy Home Button (>= 96px) */}
        <button
          onClick={onHome}
          aria-label="Kembali ke beranda"
          className="group relative flex h-24 w-24 shrink-0 items-center justify-center rounded-[2rem] border-4 border-white bg-amber-400 text-4xl text-amber-950 shadow-[0_6px_0_#d97706] transition-transform active:translate-y-1.5 active:shadow-[0_1px_0_#d97706] sm:h-28 sm:w-28"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 right-3 top-1.5 h-2.5 rounded-full bg-white/40"
          />
          <span className="transition-transform group-hover:scale-110 group-active:scale-90">
            🏠
          </span>
        </button>

        {/* Adventure Track & Game Title */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl" aria-hidden="true">
              {game.emoji}
            </span>
            <div className={`${accent.text} text-xl font-extrabold leading-tight sm:text-2xl`}>
              {game.title}
            </div>
          </div>

          {/* Rel Petualangan Bintang (Adventure Progress Track) */}
          <div className="relative mt-1.5 flex h-8 w-full items-center rounded-full border-2 border-white/80 bg-white/70 p-1 shadow-inner backdrop-blur-xs">
            {/* Milestone Dots */}
            <div className="pointer-events-none absolute inset-x-3 inset-y-0 flex items-center justify-between">
              {Array.from({ length: Math.min(ctx.total, 8) }).map((_, i) => (
                <span
                  key={i}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    (i / (Math.min(ctx.total, 8) - 1 || 1)) * 100 <= pct
                      ? "bg-amber-400 shadow-xs"
                      : "bg-black/10"
                  }`}
                />
              ))}
            </div>

            {/* Glowing Progress Fill */}
            <div
              className={`h-full rounded-full bg-gradient-to-r ${accent.gradient} shadow-sm transition-all duration-400 ease-out`}
              style={{ width: `${Math.max(pct, 5)}%` }}
            />

            {/* Moving Traveler Star Marker */}
            <div
              className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-2xl transition-all duration-400 ease-out drop-shadow-sm"
              style={{ left: `calc(${Math.min(Math.max(pct, 5), 94)}% - 13px)` }}
            >
              <span className="inline-block animate-bounce-subtle">
                ⭐
              </span>
            </div>
          </div>
        </div>

        {/* Checkpoint / Question Counter Badge */}
        <div
          className="flex h-16 shrink-0 items-center justify-center gap-1.5 rounded-[1.5rem] border-2 border-white bg-white/95 px-3.5 text-lg font-black text-amber-900 shadow-[0_5px_0_rgba(0,0,0,0.06)] tabular-nums sm:h-20 sm:text-xl"
          aria-live="polite"
        >
          <span className="text-xl sm:text-2xl" aria-hidden="true">🚩</span>
          <span>{Math.min(ctx.index + 1, ctx.total)}</span>
          <span className="text-amber-900/40">/{ctx.total}</span>
        </div>

        <SoundToggle />
      </header>

      {/* Main Play Area */}
      <main className="flex flex-1 flex-col items-center justify-center gap-5 px-4 py-5 sm:gap-7 sm:py-8">
        {ctx.phase === "ready" ? (
          <StartCard game={game} onStart={ctx.start} />
        ) : (
          <div
            className={`w-full max-w-2xl ${
              ctx.phase === "feedback" && !ctx.lastCorrect ? "animate-wiggle" : ""
            }`}
          >
            {children(ctx)}
          </div>
        )}
      </main>

      {/* Cheerful Starburst Feedback */}
      {ctx.phase === "feedback" && ctx.lastCorrect && (
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1.1, opacity: 1 }}
          exit={{ scale: 0.3, opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center"
        >
          <div className="animate-bounce-subtle text-[9rem] leading-none drop-shadow-lg sm:text-[13rem]">
            🌟
          </div>
        </motion.div>
      )}

      {/* Adventure Completion Overlay */}
      {ctx.phase === "complete" && (
        <RewardOverlay
          score={ctx.score}
          total={ctx.total}
          emoji={game.emoji}
          onReplay={ctx.start}
          onHome={onHome}
        />
      )}
    </div>
  );
}

function StartCard({
  game,
  onStart,
}: {
  game: GameMeta;
  onStart: () => void;
}) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 24 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 240, damping: 18 }}
      className="relative flex w-full max-w-md flex-col items-center gap-6 rounded-[3rem] border-4 border-white bg-white/95 p-7 text-center shadow-[0_16px_36px_rgba(0,0,0,0.08),0_8px_0_rgba(0,0,0,0.06)] backdrop-blur-xs sm:p-9"
    >
      {/* Top Adventure Pill */}
      <div className="flex items-center gap-2 rounded-full border border-amber-300 bg-amber-100 px-4 py-1.5 text-base font-bold text-amber-900 shadow-xs">
        <span aria-hidden="true">🏕️</span>
        <span>Pos Petualangan</span>
      </div>

      {/* Mascot Toy Medallion */}
      <div className="relative">
        <div className="flex h-36 w-36 items-center justify-center rounded-full border-4 border-white bg-gradient-to-b from-white to-amber-100/70 shadow-[0_8px_0_rgba(0,0,0,0.08)] sm:h-44 sm:w-44">
          <span className="animate-floaty text-7xl leading-none sm:text-8xl">
            {game.emoji}
          </span>
        </div>
      </div>

      {/* Title & Blurb */}
      <div>
        <h1 className="text-4xl font-extrabold sm:text-5xl">{game.title}</h1>
        <p className="mt-1 text-xl font-semibold text-ink/70">{game.blurb}</p>
      </div>

      {/* Stars preview */}
      <div className="flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-5 py-2">
        <StarRow />
      </div>

      {/* Chunky 3D Start Button */}
      <BigButton
        onClick={onStart}
        color="grass"
        className="w-full text-3xl font-black shadow-[0_8px_0_oklch(0.44_0.13_145)] active:translate-y-1.5"
      >
        <span className="text-4xl" aria-hidden="true">
          🚀
        </span>
        <span>Ayo Mulai!</span>
      </BigButton>
    </motion.div>
  );
}

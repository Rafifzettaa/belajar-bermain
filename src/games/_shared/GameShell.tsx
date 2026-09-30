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
  sky: { bg: "bg-sky", deep: "bg-sky-deep", text: "text-sky-deep" },
  sun: { bg: "bg-sun", deep: "bg-sun-deep", text: "text-sun-deep" },
  grass: { bg: "bg-grass", deep: "bg-grass-deep", text: "text-grass-deep" },
  bubble: { bg: "bg-bubble", deep: "bg-bubble-deep", text: "text-bubble-deep" },
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
    <div className="flex min-h-dvh flex-col safe-bottom">
      <header className="flex items-center gap-3 px-3 pt-3 sm:px-5">
        <button
          onClick={onHome}
          aria-label="Kembali ke beranda"
          className={`${accent.deep} flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl text-4xl text-white shadow-[0_5px_0_rgba(0,0,0,0.16)] active:translate-y-1 active:shadow-none sm:h-28 sm:w-28`}
        >
          🏠
        </button>
        <div className="flex-1">
          <div className={`${accent.text} text-xl leading-tight sm:text-2xl`}>
            {game.title}
          </div>
          <div className="mt-1 h-5 w-full overflow-hidden rounded-full bg-black/10">
            <div
              className={`h-full origin-left rounded-full ${accent.deep}`}
              style={{
                width: `${pct}%`,
                transition: "width 420ms cubic-bezier(0.22,1,0.36,1)",
              }}
            />
          </div>
        </div>
        <div
          className={`${accent.text} shrink-0 text-lg tabular-nums sm:text-xl`}
          aria-live="polite"
        >
          {Math.min(ctx.index + 1, ctx.total)}/{ctx.total}
        </div>
        <SoundToggle />
      </header>

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

      {ctx.phase === "feedback" && ctx.lastCorrect && (
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center"
        >
          <div className="animate-floaty text-[9rem] leading-none sm:text-[13rem]">
            🌟
          </div>
        </motion.div>
      )}

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
    <div className="animate-pop-in flex flex-col items-center gap-6 text-center">
      <div className="text-[8rem] leading-none sm:text-[11rem]">{game.emoji}</div>
      <h1 className="text-4xl sm:text-5xl">{game.title}</h1>
      <StarRow />
      <BigButton onClick={onStart} color={game.color} className="px-14">
        <span className="text-5xl">▶</span>{" "}
        <span className="text-3xl">Mulai</span>
      </BigButton>
    </div>
  );
}

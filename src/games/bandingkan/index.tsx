"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { GameShell } from "../_shared/GameShell";
import { sfx } from "@/lib/audio";
import { haptic } from "@/lib/haptics";
import type { CompareLevel } from "../_shared/types";
import { levels } from "./levels";

const GAME = {
  id: "bandingkan",
  title: "Bandingkan",
  emoji: "⚖️",
  color: "sun" as const,
  blurb: "Mana yang lebih banyak",
  levels,
};

export default function Bandingkan({ onHome }: { onHome: () => void }) {
  return (
    <GameShell game={GAME} onHome={onHome}>
      {(ctx) => (
        <Board
          key={ctx.level.id}
          level={ctx.level as CompareLevel}
          answer={ctx.answer}
          locked={ctx.phase !== "playing"}
        />
      )}
    </GameShell>
  );
}

function Board({
  level,
  answer,
  locked,
}: {
  level: CompareLevel;
  answer: (c: boolean) => void;
  locked: boolean;
}) {
  const [chosen, setChosen] = useState<"left" | "right" | null>(null);
  const leftMore = level.left.length > level.right.length;
  const correctSide = level.pickMore === leftMore ? "left" : "right";

  const tap = (side: "left" | "right") => {
    if (locked || chosen) return;
    setChosen(side);
    haptic.tap();
    if (side === correctSide) sfx.win();
    else sfx.oops();
    answer(side === correctSide);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-2 rounded-full bg-white/85 px-6 py-2 text-xl">
        <span aria-hidden="true">{level.pickMore ? "📈" : "📉"}</span>
        <span>{level.pickMore ? "Yang lebih banyak" : "Yang lebih sedikit"}</span>
      </div>

      <div className="grid w-full grid-cols-2 gap-4 sm:gap-6">
        {(["left", "right"] as const).map((side) => {
          const items = level[side];
          const label = side === "left" ? level.leftLabel : level.rightLabel;
          const isCorrect = side === correctSide;
          const isChosen = chosen === side;
          return (
            <motion.button
              key={side}
              whileTap={{ scale: 0.96 }}
              onClick={() => tap(side)}
              aria-label={`${items.length} ${label}`}
              className={`flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-[2rem] border-4 p-4 ${
                isChosen && isCorrect
                  ? "border-grass-deep bg-grass/40"
                  : isChosen
                    ? "border-sun-deep bg-sun/30"
                    : "border-white bg-white/70"
              }`}
            >
              <span className="flex max-w-full flex-wrap items-center justify-center gap-1 text-3xl sm:text-4xl">
                {items.map((e, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.05, type: "spring", stiffness: 380 }}
                    aria-hidden="true"
                  >
                    {e}
                  </motion.span>
                ))}
              </span>
              <span className="text-3xl tabular-nums text-ink/50" aria-hidden="true">
                {items.length}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export { GAME as bandingkanMeta };

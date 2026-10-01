"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { GameShell } from "../_shared/GameShell";
import { sfx } from "@/lib/audio";
import { haptic } from "@/lib/haptics";
import { shuffle } from "@/lib/shuffle";
import type { BubbleLevel } from "../_shared/types";
import { levels } from "./levels";

const COLS = 3;
const ROWS = 3;

const GAME = {
  id: "bubble-pop",
  title: "Gelembung",
  emoji: "🫧",
  color: "sky" as const,
  blurb: "Pecahkan yang cocok",
  levels,
};

export default function BubblePop({ onHome }: { onHome: () => void }) {
  return (
    <GameShell game={GAME} onHome={onHome}>
      {(ctx) => (
        <Board
          key={ctx.level.id}
          level={ctx.level as BubbleLevel}
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
  level: BubbleLevel;
  answer: (c: boolean) => void;
  locked: boolean;
}) {
  const [popped, setPopped] = useState<number[]>([]);
  const [wrongIndex, setWrongIndex] = useState<number | null>(null);

  const slots = useMemo(() => {
    const cells = shuffle(Array.from({ length: COLS * ROWS }, (_, i) => i));
    return level.bubbles.map((b, i) => ({ ...b, cell: cells[i % cells.length], key: i }));
  }, [level]);

  const pop = (i: number, emoji: string) => {
    if (locked || popped.includes(i)) return;
    const hit = emoji === level.target.emoji;
    setPopped((p) => [...p, i]);
    haptic.tap();
    if (hit) sfx.win();
    else {
      sfx.oops();
      setWrongIndex(i);
    }
    answer(hit);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center gap-3 rounded-full bg-white/85 px-6 py-2 text-2xl">
        <span className="text-lg text-ink/60">Cari</span>
        <span className="text-5xl" aria-hidden="true">
          {level.target.emoji}
        </span>
        <span className="sr-only">{level.target.label}</span>
      </div>

      <div
        className="relative grid h-[340px] w-full max-w-lg grid-cols-3 grid-rows-3 gap-4 sm:h-[380px]"
        aria-label="gelembung"
      >
        {slots.map((b, i) => {
          const col = b.cell % COLS;
          const row = Math.floor(b.cell / COLS);
          const gone = popped.includes(i);
          return (
            <motion.button
              key={b.key}
              initial={{ scale: 0 }}
              animate={{
                scale: gone ? [1, 1.3, 0] : 1,
                opacity: gone ? 0 : 1,
              }}
              transition={{ delay: gone ? 0 : i * 0.05, duration: 0.3 }}
              onClick={() => pop(i, b.emoji)}
              disabled={gone}
              aria-label={b.label}
              style={{ gridColumn: col + 1, gridRow: row + 1 }}
              className={`flex items-center justify-center rounded-full text-5xl sm:text-6xl ${
                wrongIndex === i ? "bg-bubble/60" : "bg-sky/60"
              } ${gone ? "pointer-events-none" : "animate-floaty"}`}
            >
              {gone ? "" : b.emoji}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export { GAME as bubblePopMeta };

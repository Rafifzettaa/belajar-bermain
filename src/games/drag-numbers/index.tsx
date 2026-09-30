"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { GameShell } from "../_shared/GameShell";
import { sfx } from "@/lib/audio";
import { haptic } from "@/lib/haptics";
import { levels } from "./levels";
import type { DragLevel } from "../_shared/types";

const OPTIONS = [1, 2, 3, 4, 5];

export default function DragNumbers({ onHome }: { onHome: () => void }) {
  return (
    <GameShell game={GAME} onHome={onHome}>
      {(ctx) => (
        <Board
          key={ctx.level.id}
          level={ctx.level as DragLevel}
          answer={ctx.answer}
          locked={ctx.phase !== "playing"}
        />
      )}
    </GameShell>
  );
}

const GAME = {
  id: "drag-numbers",
  title: "Angka",
  emoji: "🔢",
  color: "sky" as const,
  blurb: "Hitung dan pilih jumlahnya",
  levels,
};

function Board({ level, answer, locked }: { level: DragLevel; answer: (c: boolean) => void; locked: boolean }) {
  const [picked, setPicked] = useState<number[]>([]);

  const toggle = (i: number) => {
    if (locked) return;
    sfx.pick();
    haptic.tap();
    setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="animate-pop-in flex flex-wrap items-center justify-center gap-2 rounded-[2rem] bg-white/70 p-4 sm:gap-3 sm:p-6">
        {level.items.map((it, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.86 }}
            onClick={() => toggle(i)}
            aria-label={`${level.promptLabel} ${i + 1}`}
            aria-pressed={picked.includes(i)}
            className={`flex h-24 w-24 items-center justify-center rounded-3xl text-5xl transition-all duration-150 sm:h-28 sm:w-28 sm:text-6xl ${
              picked.includes(i)
                ? "bg-grass/70 ring-4 ring-grass-deep"
                : "bg-sky/50 ring-4 ring-white/70"
            }`}
          >
            {it}
          </motion.button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {OPTIONS.map((n) => (
          <motion.button
            key={n}
            whileTap={{ scale: 0.9 }}
            onClick={() => answer(n === level.answer)}
            aria-label={`pilih angka ${n}`}
            className="flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-sun text-5xl text-ink shadow-[0_6px_0_oklch(0.66_0.16_72)] active:translate-y-1 active:shadow-none sm:h-28 sm:w-28 sm:text-6xl"
          >
            {n}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export { GAME as dragNumbersMeta };

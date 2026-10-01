"use client";

import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { GameShell } from "../_shared/GameShell";
import { OptionButton } from "@/components/BigButton";
import { sfx } from "@/lib/audio";
import { haptic } from "@/lib/haptics";
import { shuffleOptions } from "@/lib/shuffle";
import type { PickLevel } from "../_shared/types";
import { levels } from "./levels";

const GAME = {
  id: "pattern-next",
  title: "Pola",
  emoji: "🧩",
  color: "grass" as const,
  blurb: "Lanjutkan polanya",
  levels,
};

export default function PatternNext({ onHome }: { onHome: () => void }) {
  return (
    <GameShell game={GAME} onHome={onHome}>
      {(ctx) => (
        <Board
          key={ctx.level.id}
          level={ctx.level as PickLevel}
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
  level: PickLevel;
  answer: (c: boolean) => void;
  locked: boolean;
}) {
  const [chosen, setChosen] = useState<number | null>(null);
  const { options, answer: correctIndex } = useMemo(() => shuffleOptions(level), [level]);
  const sequence = useMemo(() => Array.from(level.prompt), [level.prompt]);

  return (
    <div className="flex flex-col items-center gap-7">
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-[2rem] bg-white/70 p-4 sm:gap-3 sm:p-5">
        {sequence.map((c, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 320 }}
            className="text-4xl sm:text-5xl"
            aria-hidden="true"
          >
            {c}
          </motion.span>
        ))}
        <span className="text-4xl sm:text-5xl" aria-hidden="true">
          ❓
        </span>
      </div>

      <div className="flex w-full flex-wrap items-stretch justify-center gap-4 sm:gap-5">
        {options.map((opt, i) => (
          <OptionButton
            key={`${opt.label}-${i}`}
            label={opt.label}
            correct={chosen !== null && i === correctIndex}
            chosen={chosen === i}
            onClick={() => {
              if (locked) return;
              sfx.pick();
              haptic.tap();
              setChosen(i);
              answer(i === correctIndex);
            }}
          >
            {opt.emoji}
          </OptionButton>
        ))}
      </div>
    </div>
  );
}

export { GAME as patternNextMeta };

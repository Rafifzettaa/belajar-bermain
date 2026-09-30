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
  id: "color-mix",
  title: "Warna",
  emoji: "🎨",
  color: "bubble" as const,
  blurb: "Cocokkan gambar yang sama",
  levels,
};

export default function ColorMix({ onHome }: { onHome: () => void }) {
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

  return (
    <div className="flex flex-col items-center gap-7">
      <div key={level.id} className="animate-pop-in text-[8rem] leading-none sm:text-[11rem]">
        {level.prompt}
      </div>

      <div className="flex w-full flex-wrap items-stretch justify-center gap-3 sm:gap-5">
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
            <motion.span
              animate={chosen === i ? { scale: [1, 1.18, 1] } : {}}
              transition={{ duration: 0.28 }}
              className="block"
            >
              {opt.emoji}
            </motion.span>
          </OptionButton>
        ))}
      </div>
    </div>
  );
}

export { GAME as colorMixMeta };

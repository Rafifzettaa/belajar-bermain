"use client";

import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { GameShell } from "../_shared/GameShell";
import { OptionButton } from "@/components/BigButton";
import { primeAudio, sfx } from "@/lib/audio";
import { playAnimal } from "@/lib/animalSounds";
import { haptic } from "@/lib/haptics";
import { shuffleOptions } from "@/lib/shuffle";
import type { ListenLevel } from "../_shared/types";
import { levels } from "./levels";

const GAME = {
  id: "hear-choose",
  title: "Suara Hewan",
  emoji: "👂",
  color: "sun" as const,
  blurb: "Tebak suara hewannya",
  levels,
};

export default function HearChoose({ onHome }: { onHome: () => void }) {
  return (
    <GameShell game={GAME} onHome={onHome}>
      {(ctx) => (
        <Board
          key={ctx.level.id}
          level={ctx.level as ListenLevel}
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
  level: ListenLevel;
  answer: (c: boolean) => void;
  locked: boolean;
}) {
  const [chosen, setChosen] = useState<number | null>(null);
  const { options, answer: correctIndex } = useMemo(() => shuffleOptions(level), [level]);
  const [replays, setReplays] = useState(0);

  useEffect(() => {
    primeAudio();
    const t = window.setTimeout(() => playAnimal(level.animal), 420);
    return () => window.clearTimeout(t);
  }, [level.animal]);

  const listen = () => {
    sfx.tap();
    haptic.tap();
    playAnimal(level.animal);
    setReplays((r) => r + 1);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.button
        onClick={listen}
        whileTap={{ scale: 0.92 }}
        aria-label="Putar suara hewan lagi"
        className="flex h-36 w-36 flex-col items-center justify-center gap-1 rounded-full bg-sun-deep text-6xl text-white shadow-[0_8px_0_oklch(0.58_0.16_62)] active:translate-y-2 active:shadow-none sm:h-40 sm:w-40 sm:text-7xl"
      >
        <motion.span
          aria-hidden="true"
          animate={replays > 0 ? { scale: [1, 1.18, 1] } : {}}
          key={replays}
        >
          🔊
        </motion.span>
        <span className="text-lg">Dengar</span>
      </motion.button>

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
            {opt.emoji}
          </OptionButton>
        ))}
      </div>
    </div>
  );
}

export { GAME as hearChooseMeta };

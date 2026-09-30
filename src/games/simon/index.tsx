"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { GameShell } from "../_shared/GameShell";
import { playNote, sfx } from "@/lib/audio";
import { haptic } from "@/lib/haptics";
import type { SimonLevel } from "../_shared/types";
import { levels } from "./levels";

const PADS = [
  { id: 0, note: "do" as const, cls: "bg-bubble-deep", ring: "ring-bubble-deep" },
  { id: 1, note: "mi" as const, cls: "bg-sky-deep", ring: "ring-sky-deep" },
  { id: 2, note: "sol" as const, cls: "bg-sun-deep", ring: "ring-sun-deep" },
  { id: 3, note: "do2" as const, cls: "bg-grass-deep", ring: "ring-grass-deep" },
];

const GAP = 560;
const GAME = {
  id: "simon",
  title: "Urutan",
  emoji: "🎵",
  color: "bubble" as const,
  blurb: "Ulangi urutannya",
  levels,
};

export default function Simon({ onHome }: { onHome: () => void }) {
  return (
    <GameShell game={GAME} onHome={onHome}>
      {(ctx) => (
        <Board
          key={ctx.level.id}
          level={ctx.level as SimonLevel}
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
  level: SimonLevel;
  answer: (c: boolean) => void;
  locked: boolean;
}) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [lit, setLit] = useState<number | null>(null);
  const [stage, setStage] = useState<"demo" | "input">("demo");
  const [step, setStep] = useState(0);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  useEffect(() => {
    clearTimers();
    const seq = Array.from({ length: level.steps }, () =>
      Math.floor(Math.random() * PADS.length),
    );
    setSequence(seq);
    setStage("demo");
    setStep(0);
    setLit(null);

    seq.forEach((pad, i) => {
      timers.current.push(
        window.setTimeout(() => {
          setLit(pad);
          playNote(PADS[pad].note);
        }, 700 + i * GAP),
      );
      timers.current.push(window.setTimeout(() => setLit(null), 700 + i * GAP + 340));
    });
    timers.current.push(
      window.setTimeout(() => setStage("input"), 760 + seq.length * GAP),
    );
    return clearTimers;
  }, [level, clearTimers]);

  const tap = (pad: number) => {
    if (locked || stage !== "input") return;
    playNote(PADS[pad].note);
    setLit(pad);
    window.setTimeout(() => setLit(null), 220);
    haptic.tap();

    if (pad !== sequence[step]) {
      sfx.oops();
      answer(false);
      return;
    }
    const next = step + 1;
    setStep(next);
    if (next === sequence.length) answer(true);
  };

  return (
    <div className="flex flex-col items-center gap-7">
      <div className="flex items-center gap-2 rounded-full bg-white/85 px-6 py-2 text-xl">
        <span aria-hidden="true">{stage === "demo" ? "🎧" : "👆"}</span>
        <span>
          {stage === "demo"
            ? "Dengarkan…"
            : `Ulangi · ${step}/${sequence.length}`}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {PADS.map((pad) => (
          <motion.button
            key={pad.id}
            whileTap={{ scale: 0.93 }}
            onClick={() => tap(pad.id)}
            disabled={stage !== "input"}
            aria-label={`nada ${pad.note}`}
            className={`h-32 w-32 rounded-[2rem] sm:h-36 sm:w-36 ${pad.cls} ${
              lit === pad.id ? `ring-8 ${pad.ring} brightness-125` : "opacity-85"
            } transition-[filter,opacity] duration-100`}
          />
        ))}
      </div>
    </div>
  );
}

export { GAME as simonMeta };

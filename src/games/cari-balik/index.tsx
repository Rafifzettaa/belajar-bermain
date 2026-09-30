"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { GameShell } from "../_shared/GameShell";
import { sfx } from "@/lib/audio";
import { haptic } from "@/lib/haptics";
import { shuffle } from "@/lib/shuffle";
import type { ShellLevel } from "../_shared/types";
import { levels } from "./levels";

const PEEK_MS = 1000;
const SWAP_MS = 460;

const GAME = {
  id: "cari-balik",
  title: "Cari",
  emoji: "🙈",
  color: "sky" as const,
  blurb: "Ingat, ada di bawah mana",
  levels,
};

export default function CariBalik({ onHome }: { onHome: () => void }) {
  return (
    <GameShell game={GAME} onHome={onHome}>
      {(ctx) => (
        <Board
          key={ctx.level.id}
          level={ctx.level as ShellLevel}
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
  level: ShellLevel;
  answer: (c: boolean) => void;
  locked: boolean;
}) {
  const [order, setOrder] = useState<number[]>(() =>
    shuffle(Array.from({ length: level.cups }, (_, i) => i)),
  );
  const [hideCup, setHideCup] = useState(() =>
    Math.floor(Math.random() * level.cups),
  );
  const [stage, setStage] = useState<"peek" | "shuffle" | "pick">("peek");
  const [picked, setPicked] = useState<number | null>(null);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  useEffect(() => {
    clearTimers();
    const cups = Array.from({ length: level.cups }, (_, i) => i);
    setOrder(shuffle(cups));
    const hidden = Math.floor(Math.random() * level.cups);
    setHideCup(hidden);
    setStage("peek");
    setPicked(null);

    let t = PEEK_MS;

    for (let s = 0; s < level.shuffles; s++) {
      const at = t + s * SWAP_MS;
      timers.current.push(
        window.setTimeout(() => {
          setOrder((cur) => {
            const a = Math.floor(Math.random() * cur.length);
            let b = Math.floor(Math.random() * cur.length);
            if (b === a) b = (b + 1) % cur.length;
            const next = [...cur];
            [next[a], next[b]] = [next[b], next[a]];
            return next;
          });
          sfx.whoosh();
        }, at),
      );
    }

    t += level.shuffles * SWAP_MS;
    timers.current.push(window.setTimeout(() => setStage("shuffle"), PEEK_MS));
    timers.current.push(window.setTimeout(() => setStage("pick"), t));
    return clearTimers;
  }, [level, clearTimers]);

  const pick = (slot: number) => {
    if (locked || stage !== "pick" || picked !== null) return;
    setPicked(slot);
    haptic.tap();
    const hit = order[slot] === hideCup;
    if (hit) sfx.win();
    else sfx.oops();
    answer(hit);
  };

  return (
    <div className="flex flex-col items-center gap-7">
      <div className="flex items-center gap-3 rounded-full bg-white/80 px-5 py-2 text-2xl">
        <span aria-hidden="true">{level.hide.emoji}</span>
        <span className="text-lg text-ink/70">
          {stage === "pick" ? "Di mana sekarang?" : "Lihat baik-baik…"}
        </span>
      </div>

      <div className="flex items-end justify-center gap-3 sm:gap-5">
        {order.map((cupId, slot) => {
          const revealed = stage === "peek" && cupId === hideCup;
          const isPicked = picked === slot;
          const wasHidden = picked !== null && cupId === hideCup;
          return (
            <motion.button
              key={cupId}
              layout
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              onClick={() => pick(slot)}
              aria-label={
                revealed ? `cangkir berisi ${level.hide.label}` : "cangkir"
              }
              className={`relative flex h-28 w-24 items-end justify-center rounded-b-[2rem] rounded-t-xl pb-2 text-5xl transition-colors sm:h-32 sm:w-28 sm:text-6xl ${
                revealed
                  ? "bg-sun/50"
                  : wasHidden
                    ? "bg-grass/60"
                    : isPicked
                      ? "bg-sun/70"
                      : "bg-sky-deep/85"
              }`}
            >
              {revealed && (
                <motion.span
                  initial={{ y: -26, opacity: 0 }}
                  animate={{ y: -34, opacity: 1 }}
                  className="absolute -top-6 text-4xl"
                  aria-hidden="true"
                >
                  {level.hide.emoji}
                </motion.span>
              )}
              {!revealed && (
                <span aria-hidden="true" className="drop-shadow">
                  🥤
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export { GAME as cariBalikMeta };

"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { BigButton } from "./BigButton";
import { pickRandom, shuffle } from "@/lib/shuffle";
import { starsFor, useProgress } from "@/store/progress";

const COLORS = ["#FFD166", "#06D6A0", "#EF476F", "#4D96FF", "#FF9F1C", "#B56576"];

const PRAISE = ["Hebat!", "Keren!", "Pintar!", "Yeay!", "Wah, bagus!", "Mantap!"];
const PARTY = ["🎉", "🎊", "🌈", "🏆", "🎈", "✨", "🌟"];

export function StarRow({ n = 3, filled = true }: { n?: number; filled?: boolean }) {
  return (
    <div className="flex gap-2" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className={filled ? "text-5xl" : "text-5xl opacity-25 grayscale"}>
          ⭐
        </span>
      ))}
    </div>
  );
}

export function RewardOverlay({
  score,
  total,
  emoji,
  onReplay,
  onHome,
}: {
  score: number;
  total: number;
  emoji: string;
  onReplay: () => void;
  onHome: () => void;
}) {
  const stars = starsFor(total ? score / total : 0);
  const praise = useMemo(() => pickRandom(PRAISE), []);
  const party = useMemo(() => pickRandom(PARTY), []);
  const particles = useMemo(
    () =>
      Array.from({ length: 32 }, (_, i) => ({
        left: `${(i * 31) % 100}%`,
        delay: `${(i % 10) * 0.08}s`,
        dur: `${1.8 + ((i * 7) % 12) / 10}s`,
        drift: `${((i % 5) - 2) * 46}px`,
        color: COLORS[i % COLORS.length],
        size: 9 + ((i * 3) % 9),
      })),
    [],
  );
  const sparkles = useMemo(
    () => shuffle(["✨", "⭐", "🌟", "💫", "🎈"]).slice(0, 4),
    [],
  );

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-ink/60 p-4">
      {particles.map((p, i) => (
        <span
          key={i}
          className="pointer-events-none absolute top-0 rounded-sm"
          style={{
            left: p.left,
            width: p.size,
            height: p.size * 0.55,
            background: p.color,
            animation: `confetti-fall ${p.dur} linear ${p.delay} forwards`,
            ["--drift" as string]: p.drift,
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0.7, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="relative flex w-full max-w-sm flex-col items-center gap-5 rounded-[2.5rem] bg-paper p-8 text-center shadow-[0_18px_50px_-12px_rgba(0,0,0,0.45)]"
      >
        <div className="animate-floaty text-7xl leading-none">{emoji}</div>

        <div className="flex items-center gap-2">
          <span className="text-3xl" aria-hidden="true">
            {party}
          </span>
          <h2 className="text-4xl">{praise}</h2>
          <span className="text-3xl" aria-hidden="true">
            {party}
          </span>
        </div>

        <div className="flex gap-1" aria-label={`${stars} dari 3 bintang`}>
          {Array.from({ length: 3 }, (_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: i < stars ? 1 : 0.8 }}
              transition={{ delay: 0.25 + i * 0.18, type: "spring", stiffness: 400 }}
              className={`text-6xl ${i < stars ? "" : "opacity-20 grayscale"}`}
            >
              ⭐
            </motion.span>
          ))}
        </div>

        <p className="text-xl text-ink/70">
          {score} dari {total} benar
        </p>

        <p className="text-3xl" aria-hidden="true">
          {sparkles.join(" ")}
        </p>

        <div className="mt-1 flex w-full flex-col gap-3 sm:flex-row">
          <BigButton onClick={onReplay} color="grass" className="flex-1">
            <span className="text-3xl">🔁</span>
            <span className="text-2xl">Lagi</span>
          </BigButton>
          <BigButton onClick={onHome} color="sky" className="flex-1">
            <span className="text-3xl">🏠</span>
            <span className="text-2xl">Home</span>
          </BigButton>
        </div>
      </motion.div>
    </div>
  );
}

export function StarBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-sm tabular-nums">
      ⭐ {count}
    </span>
  );
}

export function useGameStars() {
  return useProgress((s) => s.games);
}

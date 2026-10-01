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
      Array.from({ length: 18 }, (_, i) => ({
        left: `${(i * 53) % 100}%`,
        delay: `${(i % 7) * 0.1}s`,
        dur: `${2.0 + ((i * 7) % 10) / 10}s`,
        drift: `${((i % 5) - 2) * 50}px`,
        color: COLORS[i % COLORS.length],
        size: 10 + ((i * 3) % 8),
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
            willChange: "transform, opacity",
            contain: "strict",
            ["--drift" as string]: p.drift,
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0.7, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="relative flex w-full max-w-sm flex-col items-center gap-5 rounded-[3rem] border-4 border-white bg-white/95 p-7 text-center shadow-[0_20px_50px_rgba(0,0,0,0.2),0_8px_0_rgba(0,0,0,0.06)]"
      >
        {/* Celebration Header Ribbon */}
        <div className="flex items-center gap-2 rounded-full border border-amber-300 bg-amber-100 px-4 py-1.5 text-base font-extrabold text-amber-900 shadow-xs">
          <span>🏆</span>
          <span>Misi Selesai!</span>
        </div>

        {/* Mascot Medallion */}
        <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-gradient-to-b from-amber-50 to-amber-100 shadow-[0_6px_0_rgba(0,0,0,0.08)]">
          <div className="animate-floaty text-6xl leading-none">{emoji}</div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-3xl" aria-hidden="true">
            {party}
          </span>
          <h2 className="text-4xl font-extrabold">{praise}</h2>
          <span className="text-3xl" aria-hidden="true">
            {party}
          </span>
        </div>

        {/* Golden Star Badges */}
        <div
          className="flex items-center justify-center gap-2 rounded-[2rem] border border-amber-200 bg-amber-50/80 px-6 py-2"
          aria-label={`${stars} dari 3 bintang`}
        >
          {Array.from({ length: 3 }, (_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: i < stars ? 1 : 0.8 }}
              transition={{ delay: 0.25 + i * 0.18, type: "spring", stiffness: 400 }}
              className={`text-6xl drop-shadow-sm ${i < stars ? "" : "opacity-20 grayscale"}`}
            >
              ⭐
            </motion.span>
          ))}
        </div>

        <div className="rounded-full bg-slate-100 px-4 py-1 text-lg font-bold text-ink/80">
          {score} dari {total} benar!
        </div>

        <p className="text-3xl" aria-hidden="true">
          {sparkles.join(" ")}
        </p>

        <div className="mt-1 flex w-full flex-col gap-3 sm:flex-row">
          <BigButton onClick={onReplay} color="grass" className="flex-1 text-2xl font-black">
            <span className="text-3xl">🔁</span>
            <span>Lagi</span>
          </BigButton>
          <BigButton onClick={onHome} color="sun" className="flex-1 text-2xl font-black">
            <span className="text-3xl">🏠</span>
            <span>Peta</span>
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

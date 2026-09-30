"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { GameShell } from "../_shared/GameShell";
import { sfx } from "@/lib/audio";
import { haptic } from "@/lib/haptics";
import type { TraceLevel } from "../_shared/types";

const SIZE = 300;
const TOLERANCE = 46;

type Pt = { x: number; y: number };

function getPath(shape: TraceLevel["shape"]): Pt[] {
  const c = SIZE / 2;
  const r = SIZE / 2 - 34;
  switch (shape) {
    case "line":
      return [{ x: 50, y: c }, { x: SIZE - 50, y: c }];
    case "circle": {
      const pts: Pt[] = [];
      for (let i = 0; i <= 44; i++) {
        const a = (i / 44) * Math.PI * 2;
        pts.push({ x: c + r * Math.cos(a), y: c + r * Math.sin(a) });
      }
      return pts;
    }
    case "square":
      return [
        { x: c - r, y: c - r },
        { x: c + r, y: c - r },
        { x: c + r, y: c + r },
        { x: c - r, y: c + r },
        { x: c - r, y: c - r },
      ];
    case "triangle":
      return [
        { x: c, y: c - r },
        { x: c + r, y: c + r },
        { x: c - r, y: c + r },
        { x: c, y: c - r },
      ];
    case "zigzag":
      return [
        { x: 44, y: c + r * 0.6 },
        { x: c - r * 0.5, y: c - r * 0.6 },
        { x: c + r * 0.5, y: c + r * 0.6 },
        { x: SIZE - 44, y: c - r * 0.6 },
      ];
  }
}

export const levels: TraceLevel[] = [
  { id: "t1", kind: "trace", prompt: "📏", promptLabel: "garis lurus", shape: "line" },
  { id: "t2", kind: "trace", prompt: "🔺", promptLabel: "segitiga", shape: "triangle" },
  { id: "t3", kind: "trace", prompt: "🟦", promptLabel: "persegi", shape: "square" },
  { id: "t4", kind: "trace", prompt: "⚡", promptLabel: "zig zag", shape: "zigzag" },
  { id: "t5", kind: "trace", prompt: "⚪", promptLabel: "lingkaran", shape: "circle" },
  { id: "t6", kind: "trace", prompt: "⬜", promptLabel: "persegi panjang", shape: "square" },
  { id: "t7", kind: "trace", prompt: "🌟", promptLabel: "zig zag", shape: "zigzag" },
  { id: "t8", kind: "trace", prompt: "🔵", promptLabel: "lingkaran", shape: "circle" },
  { id: "t9", kind: "trace", prompt: "📐", promptLabel: "segitiga", shape: "triangle" },
  { id: "t10", kind: "trace", prompt: "➖", promptLabel: "garis lurus", shape: "line" },
  { id: "t11", kind: "trace", prompt: "🟩", promptLabel: "persegi", shape: "square" },
  { id: "t12", kind: "trace", prompt: "🌈", promptLabel: "lingkaran", shape: "circle" },
];

const GAME = {
  id: "shape-trace",
  title: "Gambar Bentuk",
  emoji: "✏️",
  color: "grass" as const,
  blurb: "Jelajahi garis putus-putus",
  levels,
};

export default function ShapeTrace({ onHome }: { onHome: () => void }) {
  return (
    <GameShell game={GAME} onHome={onHome}>
      {(ctx) => (
        <Board
          key={ctx.level.id}
          level={ctx.level as TraceLevel}
          answer={ctx.answer}
          locked={ctx.phase !== "playing"}
        />
      )}
    </GameShell>
  );
}

function Board({ level, answer, locked }: { level: TraceLevel; answer: (c: boolean) => void; locked: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const liveRef = useRef<SVGPolylineElement>(null);
  const drawing = useRef<Pt[]>([]);
  const raf = useRef<number | null>(null);
  const [progress, setProgress] = useState<number[]>([]);
  const path = getPath(level.shape);
  const d = path.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

  useEffect(
    () => () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    },
    [],
  );

  const paint = useCallback(() => {
    raf.current = null;
    const el = liveRef.current;
    if (!el) return;
    el.setAttribute("points", drawing.current.map((q) => `${q.x},${q.y}`).join(" "));
  }, []);

  const schedule = useCallback(() => {
    if (raf.current === null) raf.current = requestAnimationFrame(paint);
  }, [paint]);

  const toLocal = useCallback((e: React.PointerEvent): Pt | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * SIZE,
      y: ((e.clientY - rect.top) / rect.height) * SIZE,
    };
  }, []);

  const onDown = (e: React.PointerEvent) => {
    if (locked) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    sfx.tap();
    haptic.tap();
    const p = toLocal(e);
    drawing.current = p ? [p] : [];
    setProgress([]);
    paint();
  };

  const onMove = (e: React.PointerEvent) => {
    if (locked || drawing.current.length === 0) return;
    const p = toLocal(e);
    if (!p) return;
    drawing.current.push(p);
    schedule();
  };

  const onUp = () => {
    if (raf.current !== null) {
      cancelAnimationFrame(raf.current);
      raf.current = null;
    }
    if (locked || drawing.current.length === 0) return;
    const strokes = drawing.current;
    drawing.current = [];
    liveRef.current?.setAttribute("points", "");

    const covered = path.filter((target) => strokes.some((q) => dist(q, target) <= TOLERANCE));
    const near = covered.length / path.length >= 0.8;
    if (!near) {
      answer(false);
      return;
    }
    setProgress(path.map((_, i) => i));
    sfx.win();
    answer(true);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="text-7xl" aria-hidden="true">
        {level.prompt}
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="tap-none h-[300px] w-[300px] touch-none sm:h-[360px] sm:w-[360px]"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        role="img"
        aria-label={`Jejak ${level.promptLabel}`}
      >
        <rect width={SIZE} height={SIZE} rx={32} fill="#FDF6E3" stroke="#E7D9B0" strokeWidth={4} />
        <path d={d} fill="none" stroke="#EFE0B8" strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 22" />
        {progress.length > 0 && (
          <path d={d} fill="none" stroke="#55C08A" strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
        )}
        <polyline
          ref={liveRef}
          points=""
          fill="none"
          stroke="#4D96FF"
          strokeWidth={14}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <motion.div whileTap={{ scale: 0.94 }}>
        <button
          onClick={() => answer(false)}
          disabled={locked}
          className="min-h-24 min-w-24 rounded-[2rem] bg-sun px-10 text-3xl text-ink shadow-[0_6px_0_oklch(0.66_0.16_72)] active:translate-y-1 active:shadow-none disabled:opacity-40"
        >
          ✋ Lewati
        </button>
      </motion.div>
    </div>
  );
}

function dist(a: Pt, b: Pt): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export { GAME as shapeTraceMeta };

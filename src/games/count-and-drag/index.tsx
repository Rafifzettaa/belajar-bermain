"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { GameShell } from "../_shared/GameShell";
import { sfx } from "@/lib/audio";
import { haptic } from "@/lib/haptics";
import type { DragLevel } from "../_shared/types";
import { levels } from "./levels";

export { levels };

const GAME = {
  id: "count-and-drag",
  title: "Keranjang",
  emoji: "🧺",
  color: "sun" as const,
  blurb: "Seret isinya ke keranjang",
  levels,
};

export default function CountAndDrag({ onHome }: { onHome: () => void }) {
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

type DragState = { id: number; x: number; y: number };

function Board({ level, answer, locked }: { level: DragLevel; answer: (c: boolean) => void; locked: boolean }) {
  const areaRef = useRef<HTMLDivElement>(null);
  const basketRef = useRef<HTMLDivElement>(null);
  const drag = useRef<DragState | null>(null);
  const areaRect = useRef<DOMRect | null>(null);
  const target = useRef<{ x: number; y: number; r: number } | null>(null);
  const raf = useRef<number | null>(null);
  const [dragging, setDragging] = useState<DragState | null>(null);
  const [basketed, setBasketed] = useState<number[]>([]);
  const [flash, setFlash] = useState(false);

  useEffect(
    () => () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    },
    [],
  );

  const paint = () => {
    raf.current = null;
    setDragging(drag.current);
  };

  const schedule = () => {
    if (raf.current === null) raf.current = requestAnimationFrame(paint);
  };

  const onDown = (id: number) => (e: React.PointerEvent<HTMLButtonElement>) => {
    if (locked || basketed.includes(id)) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    sfx.whoosh();
    haptic.tap();
    const ar = areaRef.current?.getBoundingClientRect() ?? null;
    areaRect.current = ar;
    const br = basketRef.current?.getBoundingClientRect();
    target.current = br
      ? { x: br.left + br.width / 2, y: br.top + br.height / 2, r: br.width * 0.62 }
      : null;
    drag.current = {
      id,
      x: ar ? e.clientX - ar.left : 0,
      y: ar ? e.clientY - ar.top : 0,
    };
    paint();
  };

  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const ar = areaRect.current;
    if (!drag.current || !ar) return;
    drag.current = { ...drag.current, x: e.clientX - ar.left, y: e.clientY - ar.top };
    schedule();
  };

  const onUp = () => {
    if (raf.current !== null) {
      cancelAnimationFrame(raf.current);
      raf.current = null;
    }
    const d = drag.current;
    drag.current = null;
    setDragging(null);
    if (!d || locked) return;

    const bc = target.current;
    const ar = areaRect.current;
    if (!bc || !ar) return;
    const px = d.x + ar.left;
    const py = d.y + ar.top;

    if (Math.hypot(px - bc.x, py - bc.y) < bc.r) {
      sfx.pick();
      haptic.correct();
      setFlash(true);
      window.setTimeout(() => setFlash(false), 420);
      setBasketed((b) => {
        const next = [...b, d.id];
        if (next.length > level.answer) {
          window.setTimeout(() => answer(false), 200);
          return b;
        }
        if (next.length === level.answer) {
          window.setTimeout(() => answer(true), 480);
        }
        return next;
      });
    } else {
      haptic.wrong();
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-7xl" aria-hidden="true">
        {level.prompt}
      </div>

      <div
        ref={areaRef}
        className="relative flex min-h-[220px] w-full max-w-xl flex-wrap content-start items-start justify-center gap-3 rounded-[2.5rem] bg-white/60 p-5 sm:min-h-[260px] sm:gap-4"
      >
        {level.items.map((item, i) => (
          <button
            key={i}
            onPointerDown={onDown(i)}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            disabled={locked || basketed.includes(i)}
            aria-label={`seret ${item} ke keranjang`}
            className={`tap-none flex h-24 w-24 items-center justify-center rounded-3xl bg-white text-5xl shadow-[0_4px_0_rgba(0,0,0,0.08)] select-none sm:h-28 sm:w-28 sm:text-6xl ${
              basketed.includes(i) ? "pointer-events-none opacity-0" : ""
            } ${dragging?.id === i ? "opacity-30" : ""}`}
          >
            {item}
          </button>
        ))}

        {dragging && (
          <div
            className="pointer-events-none absolute left-0 top-0 z-30 text-6xl drop-shadow-lg"
            style={{
              transform: `translate3d(${dragging.x - 30}px, ${dragging.y - 30}px, 0)`,
              width: 60,
              textAlign: "center",
            }}
          >
            {level.items[dragging.id]}
          </div>
        )}
      </div>

      <motion.div
        ref={basketRef}
        animate={flash ? { scale: [1, 1.16, 1] } : {}}
        transition={{ duration: 0.4 }}
        className="flex min-h-28 min-w-[190px] items-center justify-center gap-2 rounded-[2.5rem] border-4 border-dashed border-sun-deep bg-sun/40 px-8 text-6xl"
        aria-label={`keranjang, ${basketed.length} isi`}
      >
        <span aria-hidden="true">🧺</span>
        <span className="text-4xl tabular-nums text-ink/60">{basketed.length}</span>
      </motion.div>
    </div>
  );
}

export { GAME as countAndDragMeta };

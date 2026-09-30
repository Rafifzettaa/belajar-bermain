"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { GameShell } from "../_shared/GameShell";
import { sfx } from "@/lib/audio";
import { haptic } from "@/lib/haptics";
import { shuffle } from "@/lib/shuffle";
import type { MatchLevel } from "../_shared/types";
import { levels } from "./levels";

const GAME = {
  id: "cocokkan",
  title: "Cocokkan",
  emoji: "🚚",
  color: "sky" as const,
  blurb: "Tarik garis ke pasangannya",
  levels,
};

export default function Cocokkan({ onHome }: { onHome: () => void }) {
  return (
    <GameShell game={GAME} onHome={onHome}>
      {(ctx) => (
        <Board
          key={ctx.level.id}
          level={ctx.level as MatchLevel}
          answer={ctx.answer}
          locked={ctx.phase !== "playing"}
        />
      )}
    </GameShell>
  );
}

type Pt = { x: number; y: number };

function Board({
  level,
  answer,
  locked,
}: {
  level: MatchLevel;
  answer: (c: boolean) => void;
  locked: boolean;
}) {
  const boardRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rightRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const raf = useRef<number | null>(null);
  const rect = useRef<DOMRect | null>(null);
  const missed = useRef(false);
  const finished = useRef(false);

  const [order] = useState<number[]>(() => shuffle(level.pairs.map((_, i) => i)));
  const [links, setLinks] = useState<Record<number, number>>({});
  const [from, setFrom] = useState<number | null>(null);
  const [tip, setTip] = useState<Pt | null>(null);
  const [bad, setBad] = useState<number | null>(null);
  const [geom, setGeom] = useState<{ left: Pt[]; right: Pt[] }>({ left: [], right: [] });

  const measure = useCallback(() => {
    const board = boardRef.current;
    if (!board) return;
    const br = board.getBoundingClientRect();
    const read = (els: (HTMLButtonElement | null)[], side: "l" | "r") =>
      els.map((el) => {
        if (!el) return { x: 0, y: 0 };
        const r = el.getBoundingClientRect();
        return side === "l"
          ? { x: r.right - br.left, y: r.top + r.height / 2 - br.top }
          : { x: r.left - br.left, y: r.top + r.height / 2 - br.top };
      });
    setGeom({ left: read(leftRefs.current, "l"), right: read(rightRefs.current, "r") });
  }, []);

  useLayoutEffect(() => {
    measure();
    const t = window.setTimeout(measure, 350);
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(() => measure());
    if (boardRef.current) ro.observe(boardRef.current);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, [measure]);

  useEffect(
    () => () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    },
    [],
  );

  const toBoard = (clientX: number, clientY: number): Pt | null => {
    const r = rect.current;
    return r ? { x: clientX - r.left, y: clientY - r.top } : null;
  };

  const onDown = (i: number) => (e: React.PointerEvent<HTMLButtonElement>) => {
    if (locked || links[i] !== undefined || finished.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    rect.current = boardRef.current?.getBoundingClientRect() ?? null;
    sfx.tap();
    haptic.tap();
    setFrom(i);
    setTip(geom.left[i] ?? null);
  };

  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (from === null) return;
    const cx = e.clientX;
    const cy = e.clientY;
    if (raf.current !== null) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = null;
      setTip(toBoard(cx, cy));
    });
  };

  const hitRight = (clientX: number, clientY: number): number | null => {
    for (let p = 0; p < rightRefs.current.length; p++) {
      const el = rightRefs.current[p];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (
        clientX >= r.left - 14 &&
        clientX <= r.right + 14 &&
        clientY >= r.top - 14 &&
        clientY <= r.bottom + 14
      ) {
        return p;
      }
    }
    return null;
  };

  const onUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (raf.current !== null) {
      cancelAnimationFrame(raf.current);
      raf.current = null;
    }
    const i = from;
    setFrom(null);
    setTip(null);
    if (i === null || locked || finished.current) return;

    const p = hitRight(e.clientX, e.clientY);
    if (p === null) return;

    const used = Object.values(links).includes(p);
    const ok = !used && level.pairs[i].key === level.pairs[order[p]].key;

    if (!ok) {
      missed.current = true;
      setBad(p);
      sfx.oops();
      haptic.wrong();
      window.setTimeout(() => setBad((b) => (b === p ? null : b)), 420);
      return;
    }

    sfx.win();
    haptic.correct();
    const next = { ...links, [i]: p };
    setLinks(next);
    if (Object.keys(next).length === level.pairs.length && !finished.current) {
      finished.current = true;
      window.setTimeout(() => answer(!missed.current), 560);
    }
  };

  const linked = Object.keys(links).length;
  const usedRight = Object.values(links);

  return (
    <div ref={boardRef} className="relative w-full max-w-2xl px-1 select-none">
      <div className="text-center text-5xl sm:text-6xl" aria-hidden="true">
        {level.prompt}
      </div>

      <div className="mt-5 flex items-stretch justify-between gap-4 sm:mt-6 sm:gap-8">
        <div className="flex flex-1 flex-col gap-4 sm:gap-5">
          {level.pairs.map((pair, i) => {
            const done = links[i] !== undefined;
            return (
              <button
                key={pair.key}
                ref={(el) => {
                  leftRefs.current[i] = el;
                }}
                onPointerDown={onDown(i)}
                onPointerMove={onMove}
                onPointerUp={onUp}
                onPointerCancel={onUp}
                disabled={locked}
                aria-label={`kartu ${pair.left.label}`}
                className={`tap-none relative flex min-h-[6.25rem] items-center justify-center gap-2 rounded-3xl border-4 px-3 sm:px-4 ${
                  done
                    ? "border-grass-deep bg-grass/50"
                    : "border-white bg-white/85 shadow-[0_4px_0_rgba(0,0,0,0.06)]"
                } ${from === i ? "ring-4 ring-sky-deep" : ""}`}
              >
                <span aria-hidden="true" className="text-3xl sm:text-4xl">
                  🚚
                </span>
                <span
                  className={
                    level.mode === "word"
                      ? "text-2xl uppercase tracking-wide sm:text-3xl"
                      : "text-4xl tabular-nums leading-none sm:text-[2.75rem]"
                  }
                >
                  {pair.left.emoji}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-1 flex-col gap-4 sm:gap-5">
          {order.map((pairIdx, p) => {
            const pair = level.pairs[pairIdx];
            const done = usedRight.includes(p);
            return (
              <button
                key={pair.key}
                ref={(el) => {
                  rightRefs.current[p] = el;
                }}
                disabled={locked}
                aria-label={`gambar ${pair.right.label}`}
                className={`relative flex min-h-[6.25rem] items-center justify-center gap-1 rounded-3xl border-4 px-3 sm:px-4 ${
                  done
                    ? "border-grass-deep bg-grass/50"
                    : bad === p
                      ? "animate-wiggle border-bubble-deep bg-bubble/40"
                      : "border-white bg-white/85 shadow-[0_4px_0_rgba(0,0,0,0.06)]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="flex flex-wrap items-center justify-center gap-0.5 text-2xl leading-tight sm:text-3xl"
                >
                  {pair.right.emoji}
                </span>
                <span aria-hidden="true" className="text-3xl sm:text-4xl">
                  🚚
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        {Object.entries(links).map(([l, p]) => {
          const a = geom.left[Number(l)];
          const b = geom.right[p];
          if (!a || !b) return null;
          return (
            <line
              key={`${l}-${p}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="oklch(0.55 0.14 145)"
              strokeWidth={10}
              strokeLinecap="round"
            />
          );
        })}
        {from !== null && tip && geom.left[from] && (
          <line
            x1={geom.left[from].x}
            y1={geom.left[from].y}
            x2={tip.x}
            y2={tip.y}
            stroke="oklch(0.62 0.13 232)"
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray="2 14"
          />
        )}
      </svg>

      <p className="sr-only" aria-live="polite">
        {linked} dari {level.pairs.length} pasangan tersambung
      </p>
    </div>
  );
}

export { GAME as cocokkanMeta };

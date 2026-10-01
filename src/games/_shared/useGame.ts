"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { haptic } from "@/lib/haptics";
import { sfx } from "@/lib/audio";
import { randomSession } from "@/lib/shuffle";
import type { GameResult, Level, Phase } from "./types";

const CORRECT_MS = 900;
const WRONG_MS = 1350;

export const SESSION_SIZE = 8;

export function useGame(
  levels: Level[],
  onDone: (r: GameResult) => void,
  perSession: number = SESSION_SIZE,
) {
  const makeSession = useCallback(
    () => randomSession(levels, perSession),
    [levels, perSession],
  );

  const [session, setSession] = useState<Level[]>(makeSession);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [lastCorrect, setLastCorrect] = useState(false);
  const timer = useRef<number | null>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  const start = useCallback(() => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    setSession(makeSession());
    setIndex(0);
    setScore(0);
    setLastCorrect(false);
    setPhase("playing");
    sfx.tap();
  }, [makeSession]);

  const answer = useCallback(
    (correct: boolean) => {
      if (phase !== "playing") return;
      if (timer.current !== null) window.clearTimeout(timer.current);

      if (correct) {
        sfx.win();
        haptic.correct();
        setScore((s) => s + 1);
      } else {
        sfx.oops();
        haptic.wrong();
      }

      setLastCorrect(correct);
      setPhase("feedback");

      timer.current = window.setTimeout(
        () => {
          const next = index + 1;
          if (next >= session.length) {
            setPhase("complete");
            sfx.hooray();
            haptic.win();
            doneRef.current({ score: score + (correct ? 1 : 0), total: session.length });
          } else {
            sfx.levelUp();
            setIndex(next);
            setLastCorrect(false);
            setPhase("playing");
          }
        },
        correct ? CORRECT_MS : WRONG_MS,
      );
    },
    [phase, index, session.length, score],
  );

  const total = session.length;
  const level = useMemo(
    () => session[Math.min(index, Math.max(0, total - 1))] as Level,
    [session, index, total],
  );

  return {
    level,
    index,
    total,
    phase,
    score,
    lastCorrect,
    start,
    answer,
  };
}

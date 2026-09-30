"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeStorage } from "@/lib/storage";

export interface GameProgress {
  stars: number;
  best: number;
  total: number;
  lastPlayed: number;
}

interface ProgressState {
  games: Record<string, GameProgress>;
  save: (gameId: string, stars: number, score: number, total: number) => void;
}

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      games: {},
      save: (gameId, stars, score, total) =>
        set((state) => {
          const prev = state.games[gameId];
          return {
            games: {
              ...state.games,
              [gameId]: {
                stars: Math.max(prev?.stars ?? 0, stars),
                best: Math.max(prev?.best ?? 0, score),
                total,
                lastPlayed: Date.now(),
              },
            },
          };
        }),
    }),
    {
      name: "belajar-kecil-v1",
      storage: createJSONStorage(() => safeStorage()),
    },
  ),
);

export function starsFor(ratio: number): number {
  if (ratio >= 0.99) return 3;
  if (ratio >= 0.6) return 2;
  if (ratio > 0) return 1;
  return 0;
}

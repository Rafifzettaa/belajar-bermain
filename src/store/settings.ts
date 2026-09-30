"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeStorage } from "@/lib/storage";

interface SettingsState {
  soundOn: boolean;
  toggleSound: () => void;
  setSound: (on: boolean) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      soundOn: true,
      toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),
      setSound: (on) => set({ soundOn: on }),
    }),
    {
      name: "belajar-kecil-sound-v1",
      storage: createJSONStorage(() => safeStorage()),
    },
  ),
);

export function soundEnabled(): boolean {
  return useSettings.getState().soundOn;
}

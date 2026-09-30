import type { ShellLevel } from "../_shared/types";

const HIDE: { emoji: string; label: string }[] = [
  { emoji: "🐣", label: "anak ayam" },
  { emoji: "🍬", label: "permen" },
  { emoji: "⭐", label: "bintang" },
  { emoji: "🐞", label: "kepik" },
  { emoji: "🍀", label: "daun" },
  { emoji: "❤️", label: "hati" },
];

export const levels: ShellLevel[] = HIDE.flatMap((hide, i) => [
  { id: `cb-${i}-mudah`, kind: "shell" as const, hide, cups: 3, shuffles: 2 },
  { id: `cb-${i}-sedang`, kind: "shell" as const, hide, cups: 3, shuffles: 4 },
  { id: `cb-${i}-sulit`, kind: "shell" as const, hide, cups: 4, shuffles: 5 },
]);

import type { DragLevel } from "../_shared/types";

const ITEMS = ["🍓", "🍇", "🥕", "🐰", "🌻", "🍒", "🍄", "🐥"];

const LABELS: Record<string, string> = {
  "🍓": "stroberi",
  "🍇": "anggur",
  "🥕": "wortel",
  "🐰": "kelinci",
  "🌻": "bunga matahari",
  "🍒": "ceri",
  "🍄": "jamur",
  "🐥": "anak ayam",
};

export const levels: DragLevel[] = ITEMS.flatMap((emoji) =>
  [1, 2, 3, 4, 5].map((n) => ({
    id: `cd-${emoji}-${n}`,
    kind: "drag" as const,
    prompt: emoji,
    promptLabel: `${n} ${LABELS[emoji]}`,
    items: Array.from({ length: n }, () => emoji),
    answer: n,
  })),
);

import type { DragLevel } from "../_shared/types";

const ITEMS = ["🍎", "🍌", "🐟", "⭐", "🦋", "🍓", "🐞", "🌼"];

const LABELS: Record<string, string> = {
  "🍎": "apel",
  "🍌": "pisang",
  "🐟": "ikan",
  "⭐": "bintang",
  "🦋": "kupu-kupu",
  "🍓": "stroberi",
  "🐞": "kepik",
  "🌼": "bunga",
};

export const levels: DragLevel[] = ITEMS.flatMap((emoji) =>
  [1, 2, 3, 4, 5].map((n) => ({
    id: `dn-${emoji}-${n}`,
    kind: "drag" as const,
    prompt: emoji,
    promptLabel: `${n} ${LABELS[emoji]}`,
    items: Array.from({ length: n }, () => emoji),
    answer: n,
  })),
);

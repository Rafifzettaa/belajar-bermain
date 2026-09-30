import type { CompareLevel } from "../_shared/types";

const NAMES: Record<string, string> = {
  "🍪": "biskuit",
  "🍬": "permen",
  "🐟": "ikan",
  "🌸": "bunga",
  "🐝": "lebah",
  "🍓": "stroberi",
  "⭐": "bintang",
  "🐥": "anak ayam",
};

const EMOJI = Object.keys(NAMES);

export const levels: CompareLevel[] = EMOJI.flatMap((emoji, i) => {
  const other = EMOJI[(i + 3) % EMOJI.length];
  return [
    {
      id: `bg-${i}-a`,
      kind: "compare" as const,
      left: Array.from({ length: 2 + (i % 3) }, () => emoji),
      right: Array.from({ length: 4 + (i % 2) }, () => other),
      leftLabel: NAMES[emoji],
      rightLabel: NAMES[other],
      pickMore: i % 2 === 0,
    },
    {
      id: `bg-${i}-b`,
      kind: "compare" as const,
      left: Array.from({ length: 5 - (i % 2) }, () => other),
      right: Array.from({ length: 1 + (i % 3) }, () => emoji),
      leftLabel: NAMES[other],
      rightLabel: NAMES[emoji],
      pickMore: i % 3 !== 0,
    },
  ];
});

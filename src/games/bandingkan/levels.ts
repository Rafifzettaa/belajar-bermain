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
  "🍎": "apel",
  "🥕": "wortel",
  "🐰": "kelinci",
  "🎈": "balon",
};

const EMOJI = Object.keys(NAMES);

// Pasangan jumlah item yang dijamin tidak pernah sama (selisih minimal 1)
const PAIRS_MORE: [number, number][] = [
  [1, 3], [2, 5], [4, 2], [3, 1], [5, 3], [2, 4],
  [6, 3], [1, 4], [5, 2], [3, 6], [4, 1], [2, 6],
];

const PAIRS_LESS: [number, number][] = [
  [4, 2], [1, 5], [3, 1], [5, 2], [2, 6], [6, 4],
  [3, 5], [2, 1], [1, 3], [5, 4], [2, 3], [4, 6],
];

export const levels: CompareLevel[] = EMOJI.flatMap((emoji, i) => {
  const other = EMOJI[(i + 4) % EMOJI.length];
  const [leftMore, rightMore] = PAIRS_MORE[i];
  const [leftLess, rightLess] = PAIRS_LESS[i];

  return [
    {
      id: `bg-${i}-a`,
      kind: "compare" as const,
      left: Array.from({ length: leftMore }, () => emoji),
      right: Array.from({ length: rightMore }, () => other),
      leftLabel: NAMES[emoji],
      rightLabel: NAMES[other],
      pickMore: true,
    },
    {
      id: `bg-${i}-b`,
      kind: "compare" as const,
      left: Array.from({ length: leftLess }, () => other),
      right: Array.from({ length: rightLess }, () => emoji),
      leftLabel: NAMES[other],
      rightLabel: NAMES[emoji],
      pickMore: false,
    },
  ];
});

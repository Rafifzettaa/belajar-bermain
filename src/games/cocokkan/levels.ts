import type { MatchLevel, MatchPair } from "../_shared/types";

const NUM_ITEMS = ["🍎", "🍌", "⭐", "🐟", "🫐", "🍓", "🐞", "🌼"];
const NUM_SETS = [
  [1, 2, 3],
  [2, 3, 4],
  [3, 4, 5],
  [1, 3, 5],
  [1, 2, 4],
  [2, 4, 5],
  [1, 4, 5],
  [1, 2, 5],
  [2, 3, 5],
  [1, 3, 4],
];

const WORDS: { w: string; e: string }[] = [
  { w: "BOLA", e: "⚽" },
  { w: "BUKU", e: "📚" },
  { w: "SAPI", e: "🐮" },
  { w: "AYAM", e: "🐔" },
  { w: "BUNGA", e: "🌼" },
  { w: "IKAN", e: "🐟" },
  { w: "APEL", e: "🍎" },
  { w: "SUSU", e: "🥛" },
  { w: "KUCING", e: "🐱" },
  { w: "RUMAH", e: "🏠" },
  { w: "BEBEK", e: "🦆" },
  { w: "PISANG", e: "🍌" },
  { w: "MOBIL", e: "🚗" },
  { w: "BINTANG", e: "⭐" },
];
const WORD_SETS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [9, 10, 11],
  [12, 13, 0],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [6, 9, 12],
  [3, 8, 13],
  [1, 6, 11],
  [4, 9, 13],
  [5, 10, 13],
  [0, 7, 12],
];

const NUMBER_LEVELS: MatchLevel[] = NUM_SETS.map((nums, i) => {
  const pairs: MatchPair[] = nums.map((n, k) => {
    const item = NUM_ITEMS[(i + k) % NUM_ITEMS.length];
    return {
      key: `n${n}-${i}`,
      left: { emoji: String(n), label: String(n) },
      right: { emoji: item.repeat(n), label: `${n} benda` },
    };
  });
  return {
    id: `mc-num-${i}`,
    kind: "match",
    mode: "number",
    prompt: "🖍️",
    promptLabel: "hubungkan angka dengan jumlah benda",
    pairs,
  };
});

const WORD_LEVELS: MatchLevel[] = WORD_SETS.map((idx, i) => {
  const pairs: MatchPair[] = idx.map((w) => {
    const word = WORDS[w];
    return {
      key: `w${w}-${i}`,
      left: { emoji: word.w, label: word.w },
      right: { emoji: word.e, label: word.w },
    };
  });
  return {
    id: `mc-word-${i}`,
    kind: "match",
    mode: "word",
    prompt: "🔤",
    promptLabel: "hubungkan kata dengan gambarnya",
    pairs,
  };
});

export const levels: MatchLevel[] = [...NUMBER_LEVELS, ...WORD_LEVELS];

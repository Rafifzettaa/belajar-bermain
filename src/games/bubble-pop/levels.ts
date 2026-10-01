import type { BubbleLevel, Sprite } from "../_shared/types";

const POOL: Sprite[] = [
  { emoji: "🐟", label: "ikan" },
  { emoji: "🐠", label: "ikan warna" },
  { emoji: "🐡", label: "ikan buntal" },
  { emoji: "🐙", label: "gurita" },
  { emoji: "🦀", label: "kepiting" },
  { emoji: "🐚", label: "kerang" },
  { emoji: "⭐", label: "bintang laut" },
  { emoji: "🦑", label: "cumi" },
  { emoji: "🐢", label: "kura-kura" },
  { emoji: "🦐", label: "udang" },
  { emoji: "🐬", label: "lumba-lumba" },
  { emoji: "🐋", label: "paus" },
];

function build(i: number, count: number): BubbleLevel {
  const target = POOL[i];
  const others = POOL.filter((p) => p.emoji !== target.emoji);
  const bubbles: Sprite[] = [target];
  for (let k = 0; k < count - 1; k++) bubbles.push(others[(i + k) % others.length]);
  return {
    id: `bp-${i}-${count}`,
    kind: "bubble",
    target,
    bubbles,
  };
}

export const levels: BubbleLevel[] = POOL.flatMap((_, i) => [
  build(i, 6),
  build(i, 9),
]);

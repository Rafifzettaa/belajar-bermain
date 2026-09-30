import type { PickLevel } from "../_shared/types";

const POOL: { emoji: string; label: string }[] = [
  { emoji: "🍎", label: "apel merah" },
  { emoji: "🍏", label: "apel hijau" },
  { emoji: "🍋", label: "jeruk kuning" },
  { emoji: "🍊", label: "jeruk jingga" },
  { emoji: "🫐", label: "beri biru" },
  { emoji: "🍇", label: "anggur ungu" },
  { emoji: "🍓", label: "stroberi merah" },
  { emoji: "🥝", label: "kiwi hijau" },
  { emoji: "🍅", label: "tomat merah" },
  { emoji: "🌽", label: "jagung kuning" },
  { emoji: "🍆", label: "terong ungu" },
  { emoji: "🥦", label: "brokoli hijau" },
];

function build(offset: number): PickLevel[] {
  return POOL.map((target, i) => {
    const others = [1, 2, 3].map((k) => POOL[(i + offset + k) % POOL.length]);
    const options = [target, ...others];
    return {
      id: `cm-${offset}-${i}`,
      kind: "pick" as const,
      prompt: target.emoji,
      promptLabel: target.label,
      options,
      answer: 0,
    } satisfies PickLevel;
  });
}

export const levels: PickLevel[] = [...build(3), ...build(5)];

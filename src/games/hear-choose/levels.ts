import type { ListenLevel } from "../_shared/types";
import { ANIMAL_LABEL, type AnimalId } from "@/lib/animalSounds";

const IDS = Object.keys(ANIMAL_LABEL) as AnimalId[];

export const levels: ListenLevel[] = IDS.map((id, i) => {
  const target = ANIMAL_LABEL[id];
  const others = [1, 2, 3].map((k) => IDS[(i + k) % IDS.length]);
  return {
    id: `hc-${id}`,
    kind: "listen" as const,
    prompt: target.emoji,
    promptLabel: target.label,
    animal: id,
    options: [id, ...others].map((o) => ({ emoji: ANIMAL_LABEL[o].emoji, label: ANIMAL_LABEL[o].label })),
    answer: 0,
  } satisfies ListenLevel;
});

import type { GameMeta } from "./_shared/types";
import DragNumbers, { dragNumbersMeta } from "./drag-numbers";
import CountAndDrag, { countAndDragMeta } from "./count-and-drag";
import ColorMix, { colorMixMeta } from "./color-mix";
import PatternNext, { patternNextMeta } from "./pattern-next";
import HearChoose, { hearChooseMeta } from "./hear-choose";
import ShapeTrace, { shapeTraceMeta } from "./shape-trace";
import CariBalik, { cariBalikMeta } from "./cari-balik";
import BubblePop, { bubblePopMeta } from "./bubble-pop";
import Bandingkan, { bandingkanMeta } from "./bandingkan";
import Simon, { simonMeta } from "./simon";
import Cocokkan, { cocokkanMeta } from "./cocokkan";

export interface GameEntry {
  meta: GameMeta;
  Component: (props: { onHome: () => void }) => React.ReactNode;
}

export const GAMES: GameEntry[] = [
  { meta: dragNumbersMeta, Component: DragNumbers },
  { meta: countAndDragMeta, Component: CountAndDrag },
  { meta: colorMixMeta, Component: ColorMix },
  { meta: patternNextMeta, Component: PatternNext },
  { meta: hearChooseMeta, Component: HearChoose },
  { meta: shapeTraceMeta, Component: ShapeTrace },
  { meta: cariBalikMeta, Component: CariBalik },
  { meta: bubblePopMeta, Component: BubblePop },
  { meta: bandingkanMeta, Component: Bandingkan },
  { meta: simonMeta, Component: Simon },
  { meta: cocokkanMeta, Component: Cocokkan },
];

export function getGame(id: string): GameEntry | undefined {
  return GAMES.find((g) => g.meta.id === id);
}

export function randomGameId(exclude?: string): string {
  const pool = GAMES.filter((g) => g.meta.id !== exclude).map((g) => g.meta.id);
  return pool[Math.floor(Math.random() * pool.length)];
}

export const GAME_IDS: string[] = GAMES.map((g) => g.meta.id);

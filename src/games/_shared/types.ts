export type LevelKind = "pick" | "drag" | "trace" | "listen" | "shell" | "bubble" | "compare" | "simon" | "match";

import type { AnimalId } from "@/lib/animalSounds";

export interface BaseLevel {
  id: string;
  kind: LevelKind;
}

export interface Sprite {
  emoji: string;
  label: string;
}

export interface PickLevel extends BaseLevel {
  kind: "pick";
  prompt: string;
  /** teks pendek untuk screen reader, mis. "apel" */
  promptLabel: string;
  options: Sprite[];
  answer: number;
}

export interface DragLevel extends BaseLevel {
  kind: "drag";
  prompt: string;
  promptLabel: string;
  items: string[];
  answer: number;
  hint?: string;
}

export interface TraceLevel extends BaseLevel {
  kind: "trace";
  prompt: string;
  promptLabel: string;
  shape: "line" | "circle" | "square" | "triangle" | "zigzag" | "diamond" | "star" | "heart";
}

export interface ListenLevel extends BaseLevel {
  kind: "listen";
  prompt: string;
  promptLabel: string;
  animal: AnimalId;
  options: Sprite[];
  answer: number;
}

/** Barang disembunyikan di bawah satu cangkir, lalu cangkir diacak. */
export interface ShellLevel extends BaseLevel {
  kind: "shell";
  hide: Sprite;
  cups: number;
  shuffles: number;
}

/** Gelembung tersebar; pecahkan yang cocok dengan target. */
export interface BubbleLevel extends BaseLevel {
  kind: "bubble";
  target: Sprite;
  bubbles: Sprite[];
}

/** Pilih kelompok yang lebih banyak / lebih sedikit. */
export interface CompareLevel extends BaseLevel {
  kind: "compare";
  left: string[];
  right: string[];
  leftLabel: string;
  rightLabel: string;
  pickMore: boolean;
}

/** Ulangi urutan warna + nada yang tadi diputar. */
export interface SimonLevel extends BaseLevel {
  kind: "simon";
  steps: number;
}

/** Tarik garis dari kartu kiri ke kartu kanan yang cocok. */
export interface MatchPair {
  key: string;
  left: Sprite;
  right: Sprite;
}

export interface MatchLevel extends BaseLevel {
  kind: "match";
  mode: "number" | "word";
  prompt: string;
  promptLabel: string;
  pairs: MatchPair[];
}

export type Level =
  | PickLevel
  | DragLevel
  | TraceLevel
  | ListenLevel
  | ShellLevel
  | BubbleLevel
  | CompareLevel
  | SimonLevel
  | MatchLevel;

export type Phase = "ready" | "playing" | "feedback" | "complete";

export interface GameResult {
  score: number;
  total: number;
}

export interface GameMeta {
  id: string;
  title: string;
  emoji: string;
  color: "sky" | "sun" | "grass" | "bubble";
  blurb: string;
  levels: Level[];
}

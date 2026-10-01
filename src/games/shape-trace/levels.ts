import type { TraceLevel } from "../_shared/types";

export const levels: TraceLevel[] = [
  // --- garis lurus (3) ---
  { id: "t1", kind: "trace", prompt: "📏", promptLabel: "garis lurus", shape: "line" },
  { id: "t2", kind: "trace", prompt: "➖", promptLabel: "garis lurus", shape: "line" },
  { id: "t3", kind: "trace", prompt: "🖊️", promptLabel: "garis lurus", shape: "line" },
  // --- segitiga (3) ---
  { id: "t4", kind: "trace", prompt: "🔺", promptLabel: "segitiga", shape: "triangle" },
  { id: "t5", kind: "trace", prompt: "📐", promptLabel: "segitiga", shape: "triangle" },
  { id: "t6", kind: "trace", prompt: "🏔️", promptLabel: "segitiga", shape: "triangle" },
  // --- persegi (3) ---
  { id: "t7", kind: "trace", prompt: "🟦", promptLabel: "persegi", shape: "square" },
  { id: "t8", kind: "trace", prompt: "🟩", promptLabel: "persegi", shape: "square" },
  { id: "t9", kind: "trace", prompt: "⬜", promptLabel: "persegi", shape: "square" },
  // --- lingkaran (3) ---
  { id: "t10", kind: "trace", prompt: "⚪", promptLabel: "lingkaran", shape: "circle" },
  { id: "t11", kind: "trace", prompt: "🔵", promptLabel: "lingkaran", shape: "circle" },
  { id: "t12", kind: "trace", prompt: "🌈", promptLabel: "lingkaran", shape: "circle" },
  // --- zig zag (3) ---
  { id: "t13", kind: "trace", prompt: "⚡", promptLabel: "zig zag", shape: "zigzag" },
  { id: "t14", kind: "trace", prompt: "🌟", promptLabel: "zig zag", shape: "zigzag" },
  { id: "t15", kind: "trace", prompt: "〰️", promptLabel: "zig zag", shape: "zigzag" },
  // --- belah ketupat / wajik (3) ---
  { id: "t16", kind: "trace", prompt: "🔷", promptLabel: "wajik", shape: "diamond" },
  { id: "t17", kind: "trace", prompt: "💎", promptLabel: "wajik", shape: "diamond" },
  { id: "t18", kind: "trace", prompt: "🔶", promptLabel: "wajik", shape: "diamond" },
  // --- bintang (3) ---
  { id: "t19", kind: "trace", prompt: "⭐", promptLabel: "bintang", shape: "star" },
  { id: "t20", kind: "trace", prompt: "🌟", promptLabel: "bintang", shape: "star" },
  { id: "t21", kind: "trace", prompt: "✨", promptLabel: "bintang", shape: "star" },
  // --- hati (3) ---
  { id: "t22", kind: "trace", prompt: "❤️", promptLabel: "hati", shape: "heart" },
  { id: "t23", kind: "trace", prompt: "💖", promptLabel: "hati", shape: "heart" },
  { id: "t24", kind: "trace", prompt: "💕", promptLabel: "hati", shape: "heart" },
];

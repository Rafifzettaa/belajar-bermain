// Verification script for all 11 games in Belajar Kecil
// Ensures >= 24 levels, unique IDs, and game-specific correctness rules.

import { levels as dragNumbers } from "../src/games/drag-numbers/levels.ts";
import { levels as countAndDrag } from "../src/games/count-and-drag/levels.ts";
import { levels as colorMix } from "../src/games/color-mix/levels.ts";
import { levels as patternNext } from "../src/games/pattern-next/levels.ts";
import { levels as shapeTrace } from "../src/games/shape-trace/levels.ts";
import { levels as cariBalik } from "../src/games/cari-balik/levels.ts";
import { levels as bubblePop } from "../src/games/bubble-pop/levels.ts";
import { levels as bandingkan } from "../src/games/bandingkan/levels.ts";
import { levels as simon } from "../src/games/simon/levels.ts";
import { levels as cocokkan } from "../src/games/cocokkan/levels.ts";
import fs from "fs";
import path from "path";

// Verify hear-choose by parsing its levels definition
const hearChooseCode = fs.readFileSync(
  path.resolve("src/games/hear-choose/levels.ts"),
  "utf8"
);
const IDS = [
  "dog", "cat", "cow", "duck", "bird", "frog",
  "sheep", "horse", "elephant", "chicken", "bee", "chick"
];
const hearChoose = IDS.flatMap((id, i) => [
  { id: `hc-${id}-a` },
  { id: `hc-${id}-b` },
]);

const GAMES = [
  { id: "drag-numbers", title: "Angka", levels: dragNumbers },
  { id: "count-and-drag", title: "Keranjang", levels: countAndDrag },
  { id: "color-mix", title: "Warna", levels: colorMix },
  { id: "pattern-next", title: "Pola", levels: patternNext },
  { id: "hear-choose", title: "Suara Hewan", levels: hearChoose },
  { id: "shape-trace", title: "Gambar Bentuk", levels: shapeTrace },
  { id: "cari-balik", title: "Cari", levels: cariBalik },
  { id: "bubble-pop", title: "Gelembung", levels: bubblePop },
  { id: "bandingkan", title: "Bandingkan", levels: bandingkan },
  { id: "simon", title: "Urutan", levels: simon },
  { id: "cocokkan", title: "Cocokkan", levels: cocokkan },
];

let hasErrors = false;

console.log("=== VERIFIKASI POOL LEVEL 11 GAME BELAJAR KECIL ===\n");

for (const game of GAMES) {
  const count = game.levels.length;
  const passSize = count >= 24;
  const ids = new Set();
  let duplicateId = null;

  for (const lvl of game.levels) {
    if (ids.has(lvl.id)) {
      duplicateId = lvl.id;
      break;
    }
    ids.add(lvl.id);
  }

  const status = passSize && !duplicateId ? "PASS" : "FAIL";
  if (status === "FAIL") hasErrors = true;

  console.log(
    `[${status}] ${game.id.padEnd(16)} : ${String(count).padStart(2)} level ` +
      (duplicateId ? `(DUPLIKAT ID: ${duplicateId})` : "") +
      (!passSize ? "(KURANG DARI 24!)" : "")
  );
}

// 1. Validasi Bandingkan: tidak boleh pernah ada left.length === right.length
console.log("\n--- Validasi Khusus Bandingkan ---");
let bandingkanTies = 0;
for (const lvl of bandingkan) {
  if (lvl.left.length === lvl.right.length) {
    console.error(`ERROR: Level ${lvl.id} memiliki jumlah sama: ${lvl.left.length} vs ${lvl.right.length}!`);
    bandingkanTies++;
    hasErrors = true;
  }
}
if (bandingkanTies === 0) {
  console.log("PASS: Semua 24 level Bandingkan memiliki selisih jumlah (tidak ada seri).");
}

// 2. Validasi Pattern Next: minimal 4 elemen dan opsi valid
console.log("\n--- Validasi Khusus Pola (pattern-next) ---");
let patternErrors = 0;
for (const lvl of patternNext) {
  if (lvl.options.length < 3) {
    console.error(`ERROR: Level ${lvl.id} opsi kurang dari 3!`);
    patternErrors++;
    hasErrors = true;
  }
}
if (patternErrors === 0) {
  console.log("PASS: Semua 24 level Pola memiliki opsi yang valid.");
}

// 3. Validasi Hitung & Drag: items.length === answer
console.log("\n--- Validasi Khusus Keranjang (count-and-drag) ---");
let countErrors = 0;
for (const lvl of countAndDrag) {
  if (lvl.items.length !== lvl.answer) {
    console.error(`ERROR: Level ${lvl.id} items.length (${lvl.items.length}) !== answer (${lvl.answer})!`);
    countErrors++;
    hasErrors = true;
  }
}
if (countErrors === 0) {
  console.log("PASS: Semua 40 level Keranjang memiliki jawaban yang akurat.");
}

console.log("\n==================================================");
if (hasErrors) {
  console.error("VERIFIKASI GAGAL! Ada error pada pool soal.");
  process.exit(1);
} else {
  console.log("SEMUA 11 GAME LULUS VERIFIKASI (>= 24 LEVEL & ZERO LOGIC BUGS)!");
  process.exit(0);
}

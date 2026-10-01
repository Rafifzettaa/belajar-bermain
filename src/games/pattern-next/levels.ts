import type { PickLevel } from "../_shared/types";

const NAME: Record<string, string> = {
  "🔴": "merah",
  "🔵": "biru",
  "🟡": "kuning",
  "🟢": "hijau",
  "🟣": "ungu",
  "🟠": "jingga",
};

const EMOJI = ["🔴", "🔵", "🟡", "🟢", "🟣", "🟠"];

/**
 * Setiap pola menyimpan jawabannya EKSPLISIT, dan menampilkan minimal DUA siklus penuh.
 *
 * Kenapa: pola 3 elemen seperti "merah biru merah" itu ambigu secara logika —
 * lanjutannya bisa "biru" (selang-seling 2) atau "merah" (siklus 3). Anak jadi bingung,
 * dan jawaban yang dianggap "salah" sebenarnya juga masuk akal. Dengan menampilkan
 * dua siklus penuh, jawabannya jadi tunggal.
 *
 * Tiga keluarga:
 *   A B A B        -> selang-seling   (jawaban A)
 *   A A B B        -> dobel           (jawaban A)
 *   A B C A B C    -> siklus tiga     (jawaban A)
 */
const CARDS: { seq: string[]; next: string }[] = [
  { seq: ["🔴", "🔵", "🔴", "🔵"], next: "🔴" },
  { seq: ["🔵", "🔴", "🔵", "🔴"], next: "🔵" },
  { seq: ["🟡", "🟢", "🟡", "🟢"], next: "🟡" },
  { seq: ["🟢", "🟡", "🟢", "🟡"], next: "🟢" },
  { seq: ["🟣", "🟠", "🟣", "🟠"], next: "🟣" },
  { seq: ["🟠", "🟣", "🟠", "🟣"], next: "🟠" },
  { seq: ["🔴", "🟢", "🔴", "🟢"], next: "🔴" },
  { seq: ["🔵", "🟡", "🔵", "🟡"], next: "🔵" },
  { seq: ["🟣", "🟡", "🟣", "🟡"], next: "🟣" },
  { seq: ["🟠", "🔴", "🟠", "🔴"], next: "🟠" },

  { seq: ["🔴", "🔴", "🔵", "🔵"], next: "🔴" },
  { seq: ["🟡", "🟡", "🟢", "🟢"], next: "🟡" },
  { seq: ["🟣", "🟣", "🟠", "🟠"], next: "🟣" },
  { seq: ["🔵", "🔵", "🔴", "🔴"], next: "🔵" },
  { seq: ["🟢", "🟢", "🟡", "🟡"], next: "🟢" },
  { seq: ["🟠", "🟠", "🟣", "🟣"], next: "🟠" },
  { seq: ["🟣", "🟣", "🟡", "🟡"], next: "🟣" },

  { seq: ["🔴", "🔵", "🟡", "🔴", "🔵", "🟡"], next: "🔴" },
  { seq: ["🔵", "🟡", "🟢", "🔵", "🟡", "🟢"], next: "🔵" },
  { seq: ["🟣", "🔴", "🟡", "🟣", "🔴", "🟡"], next: "🟣" },
  { seq: ["🟢", "🟠", "🔴", "🟢", "🟠", "🔴"], next: "🟢" },
  { seq: ["🟡", "🟣", "🔵", "🟡", "🟣", "🔵"], next: "🟡" },
  { seq: ["🟠", "🟢", "🔵", "🟠", "🟢", "🔵"], next: "🟠" },
  { seq: ["🟣", "🟢", "🟠", "🟣", "🟢", "🟠"], next: "🟣" },
];

export const levels: PickLevel[] = CARDS.map((card, i) => {
  const others = EMOJI.filter((e) => e !== card.next);
  const distractors = [0, 1, 2].map((k) => others[(i + k * 2) % others.length]);
  const options = [card.next, ...distractors].map((emoji) => ({ emoji, label: NAME[emoji] }));
  const spoken = card.seq.map((e) => NAME[e]).join(" lalu ");
  return {
    id: `pn-${i}`,
    kind: "pick" as const,
    prompt: card.seq.join(""),
    promptLabel: `${spoken} lalu apa`,
    options,
    answer: 0,
  } satisfies PickLevel;
});

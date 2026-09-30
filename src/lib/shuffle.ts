export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Ambil `n` soal acak dari pool. Kalau `n` >= panjang pool, kembalikan urutan
 * yang tetap diacak. Kalau pool lebih besar, ambil subset acak.
 */
export function randomSession<T>(pool: readonly T[], n: number): T[] {
  if (n >= pool.length) return shuffle(pool);
  return shuffle(pool).slice(0, n);
}

/**
 * Acak urutan opsi dan remap indeks jawaban supaya tetap menunjuk opsi yang sama.
 */
export function shuffleOptions<T extends { options: readonly unknown[]; answer: number }>(
  level: T,
): { options: T["options"][number][]; answer: number } {
  const order = shuffle(level.options.map((_, i) => i));
  const options = order.map((i) => level.options[i]);
  const answer = order.indexOf(level.answer);
  return { options: options as T["options"][number][], answer };
}

export function buzz(ms = 12): void {
  if (typeof navigator === "undefined") return;
  if (!("vibrate" in navigator)) return;
  try {
    navigator.vibrate(ms);
  } catch {
    /* iOS Safari tidak mendukung getar — abaikan diam-diam */
  }
}

export const haptic = {
  tap: (): void => buzz(8),
  correct: (): void => buzz(18),
  wrong: (): void => buzz(0),
  win: (): void => {
    buzz(25);
    window.setTimeout(() => buzz(25), 130);
    window.setTimeout(() => buzz(45), 270);
  },
};

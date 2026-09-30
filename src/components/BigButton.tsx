"use client";

import { motion } from "motion/react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Color = "sky" | "sun" | "grass" | "bubble";

const TONES: Record<Color, { bg: string; shadow: string }> = {
  sky: { bg: "bg-sky-deep", shadow: "shadow-[0_6px_0_oklch(0.5_0.13_232)]" },
  sun: { bg: "bg-sun-deep", shadow: "shadow-[0_6px_0_oklch(0.56_0.16_62)]" },
  grass: { bg: "bg-grass-deep", shadow: "shadow-[0_6px_0_oklch(0.44_0.13_145)]" },
  bubble: { bg: "bg-bubble-deep", shadow: "shadow-[0_6px_0_oklch(0.49_0.15_330)]" },
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: Color;
  children: ReactNode;
}

export function BigButton({
  color = "sky",
  className = "",
  children,
  ...rest
}: Props) {
  const tone = TONES[color];
  return (
    <motion.button
      whileTap={{ scale: 0.94, y: 4 }}
      transition={{ type: "spring", stiffness: 600, damping: 25 }}
      className={`${tone.bg} ${tone.shadow} min-h-28 min-w-28 rounded-[2rem] px-8 text-white active:shadow-none ${className}`}
      {...(rest as React.ComponentProps<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}

export function OptionButton({
  children,
  correct,
  chosen,
  onClick,
  label,
}: {
  children: ReactNode;
  correct: boolean;
  chosen: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={chosen}
      className={`min-h-32 min-w-32 flex-1 rounded-[2rem] border-4 bg-white/85 p-3 text-center transition-colors duration-150 ${
        correct
          ? "border-grass-deep bg-grass/60"
          : chosen
            ? "border-sun-deep"
            : "border-white"
      }`}
    >
      <span className="block text-6xl leading-none sm:text-7xl">{children}</span>
    </button>
  );
}

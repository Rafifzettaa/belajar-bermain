"use client";

import { motion } from "motion/react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Color = "sky" | "sun" | "grass" | "bubble";

const TONES: Record<Color, { bg: string; shadow: string; border: string }> = {
  sky: {
    bg: "bg-sky-deep",
    shadow: "shadow-[0_7px_0_oklch(0.5_0.13_232)]",
    border: "border-sky-deep",
  },
  sun: {
    bg: "bg-sun-deep",
    shadow: "shadow-[0_7px_0_oklch(0.56_0.16_62)]",
    border: "border-sun-deep",
  },
  grass: {
    bg: "bg-grass-deep",
    shadow: "shadow-[0_7px_0_oklch(0.44_0.13_145)]",
    border: "border-grass-deep",
  },
  bubble: {
    bg: "bg-bubble-deep",
    shadow: "shadow-[0_7px_0_oklch(0.49_0.15_330)]",
    border: "border-bubble-deep",
  },
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
      whileTap={{ scale: 0.95, y: 5 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 500, damping: 22 }}
      className={`group relative select-none overflow-hidden ${tone.bg} ${tone.shadow} min-h-24 min-w-24 rounded-[2.25rem] border-t-2 border-white/50 px-8 py-4 text-white active:shadow-none ${className}`}
      {...(rest as React.ComponentProps<typeof motion.button>)}
    >
      {/* Toy gloss highlight strip */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-4 right-4 top-1.5 h-3 rounded-full bg-white/25"
      />
      <span className="relative z-10 flex items-center justify-center gap-3">
        {children}
      </span>
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
      className={`group relative min-h-32 min-w-32 flex-1 basis-28 select-none overflow-hidden rounded-[2.25rem] border-4 p-4 text-center transition-all duration-150 active:translate-y-1.5 ${
        correct
          ? "border-grass-deep bg-grass/80 shadow-[0_6px_0_oklch(0.44_0.13_145)] text-white"
          : chosen
            ? "border-sun-deep bg-sun/80 shadow-[0_6px_0_oklch(0.56_0.16_62)]"
            : "border-white bg-white/95 shadow-[0_6px_0_rgba(0,0,0,0.08)] active:shadow-none"
      }`}
    >
      {/* Glossy top pill highlight */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-3 right-3 top-1.5 h-2.5 rounded-full bg-white/40"
      />
      <span className="relative z-10 block text-6xl leading-none transition-transform duration-150 group-active:scale-95 sm:text-7xl">
        {children}
      </span>
    </button>
  );
}

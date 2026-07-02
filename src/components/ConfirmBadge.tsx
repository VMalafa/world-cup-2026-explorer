"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * A small celebratory "✓ you got it!" badge that springs in the moment a child's
 * tap is confirmed — the shared positive signal across the journey's confirming
 * moments (match card, prediction, find-it), so success always looks the same
 * (issue #45b). Reduced-motion safe: it simply appears, no spring.
 */
export function ConfirmBadge({
  label,
  tone = "cedar",
  className = "",
}: {
  label: string;
  /** Brand tone — cedar = success/"go", royal = primary, gold = highlight. */
  tone?: "cedar" | "royal" | "gold";
  className?: string;
}) {
  const reduce = useReducedMotion();
  const tones = {
    cedar: "bg-cedar-100 text-cedar-700",
    royal: "bg-royal text-white",
    gold: "bg-gold-100 text-gold-700",
  } as const;

  return (
    <motion.span
      initial={reduce ? false : { scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 16 }}
      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-extrabold ${tones[tone]} ${className}`}
    >
      <span aria-hidden>✓</span>
      {label}
    </motion.span>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  /** ISO timestamp of kickoff. */
  target: string;
}

interface Parts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

function diff(target: number, now: number): Parts {
  const ms = Math.max(0, target - now);
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms / 3600000) % 24),
    minutes: Math.floor((ms / 60000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
    done: ms <= 0,
  };
}

function Cell({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-16 w-14 overflow-hidden rounded-2xl bg-slate-900 text-white shadow-pop sm:h-20 sm:w-16">
        <motion.span
          key={value}
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute inset-0 flex items-center justify-center font-display text-3xl font-extrabold tabular-nums sm:text-4xl"
        >
          {String(value).padStart(2, "0")}
        </motion.span>
      </div>
      <span className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </span>
    </div>
  );
}

/**
 * Animated flip-style countdown to kickoff. Shows a celebratory message
 * once the match has started.
 */
export function CountdownTimer({ target }: Props) {
  const targetMs = new Date(target).getTime();
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    const tick = () => setParts(diff(targetMs, Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  // Render nothing time-specific until mounted (avoids hydration mismatch).
  if (!parts) {
    return (
      <div className="h-20 animate-pulse rounded-2xl bg-white/40" aria-hidden />
    );
  }

  if (parts.done) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="inline-flex items-center gap-2 rounded-full bg-grass px-5 py-3 text-xl font-extrabold text-white shadow-pop"
      >
        <span aria-hidden>🎉</span> It&apos;s game time!
      </motion.div>
    );
  }

  return (
    <div
      className="flex items-end gap-2 sm:gap-3"
      role="timer"
      aria-label="Time until kickoff"
    >
      {parts.days > 0 && <Cell value={parts.days} label="Days" />}
      <Cell value={parts.hours} label="Hours" />
      <Cell value={parts.minutes} label="Mins" />
      <Cell value={parts.seconds} label="Secs" />
    </div>
  );
}

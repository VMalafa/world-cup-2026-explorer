"use client";

import { useEffect } from "react";

/** Friendly, kid-appropriate error screen. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error for grown-ups debugging in the console.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <span className="animate-wiggle text-7xl" aria-hidden>
        🙈
      </span>
      <h1 className="text-3xl font-extrabold">Oops! A little hiccup.</h1>
      <p className="max-w-md text-lg font-semibold text-muted">
        Something went wobbly. Let&apos;s try that again!
      </p>
      <button onClick={reset} className="kid-btn bg-royal text-white outline-royal">
        🔄 Try again
      </button>
    </div>
  );
}

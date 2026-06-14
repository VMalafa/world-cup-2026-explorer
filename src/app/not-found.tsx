import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <span className="animate-float text-7xl" aria-hidden>
        🧭
      </span>
      <h1 className="text-3xl font-extrabold">This page ran off the pitch!</h1>
      <p className="max-w-md text-lg font-semibold text-muted">
        We couldn&apos;t find that page. Let&apos;s head back to the game.
      </p>
      <Link href="/" className="kid-btn bg-cedar text-white outline-cedar">
        🏠 Back home
      </Link>
    </div>
  );
}

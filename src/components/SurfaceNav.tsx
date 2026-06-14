"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * The two primary surfaces of the app (CONTEXT.md): Today + World. A floating
 * pill bar shown on both; the old Compare/Heroes/Facts silos are gone, their
 * value absorbed into the Match Day Journey.
 */
const SURFACES = [
  { href: "/", label: "Today", emoji: "⚽" },
  { href: "/world", label: "World", emoji: "🌍" },
];

export function SurfaceNav() {
  const path = usePathname();
  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex gap-1.5 rounded-full bg-white/95 p-1.5 shadow-pop ring-1 ring-line backdrop-blur">
        {SURFACES.map((s) => {
          const active = isActive(s.href);
          return (
            <Link
              key={s.href}
              href={s.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-[6rem] items-center justify-center gap-2 rounded-full px-5 py-2.5 text-base font-extrabold transition-colors ${
                active ? "bg-royal text-white shadow-pop" : "text-muted hover:text-ink"
              }`}
            >
              <span className="text-xl" aria-hidden>{s.emoji}</span>
              {s.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

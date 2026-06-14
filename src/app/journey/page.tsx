import { Suspense } from "react";

import { JourneyClient } from "@/components/JourneyClient";

export default function JourneyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center">
          <span className="animate-float text-6xl" aria-hidden>
            🌍
          </span>
        </div>
      }
    >
      <JourneyClient />
    </Suspense>
  );
}

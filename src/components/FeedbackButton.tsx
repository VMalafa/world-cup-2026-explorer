"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import {
  FEEDBACK_CATEGORIES,
  MESSAGE_MAX,
  type FeedbackCategory,
} from "@/lib/feedback";

type Status = "idle" | "sending" | "sent" | "softfail" | "error";

/**
 * "Tell us!" — a floating feedback button on every surface. Sending a note files
 * a GitHub Issue via /api/feedback. Kid-friendly: emoji categories, big targets,
 * a celebratory thank-you. If the server isn't configured with a token, it fails
 * softly ("Saved!") so a child never sees a scary error. Mirrors ProfilePicker
 * for dialog a11y (role=dialog, aria-modal, Escape to close, reduced motion).
 */
export function FeedbackButton() {
  const reduce = useReducedMotion();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<FeedbackCategory>("love");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [issueUrl, setIssueUrl] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Escape closes the sheet.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Focus the textarea when the sheet opens.
  useEffect(() => {
    if (open) textareaRef.current?.focus();
  }, [open]);

  function close() {
    setOpen(false);
    // Reset after the exit animation so it's fresh next time.
    setTimeout(() => {
      setStatus("idle");
      setMessage("");
      setCategory("love");
      setIssueUrl(null);
    }, 250);
  }

  async function submit() {
    if (message.trim().length < 2 || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          category,
          page: path,
          viewport:
            typeof window !== "undefined"
              ? `${window.innerWidth}×${window.innerHeight}`
              : undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        url?: string;
        reason?: string;
      };
      if (res.ok && data.ok) {
        setIssueUrl(data.url ?? null);
        setStatus("sent");
      } else if (data.reason === "not_configured") {
        // Token not wired in yet — don't scare a kid; treat as saved.
        setStatus("softfail");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const done = status === "sent" || status === "softfail";

  return (
    <>
      {/* Floating launcher — clear of the centered nav and the safe-area inset. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label="Send feedback — tell us what you think"
        className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] right-3 z-40 flex items-center gap-2 rounded-full bg-unity px-4 py-3 text-base font-extrabold text-white shadow-pop ring-1 ring-black/5 transition-transform duration-150 active:translate-y-1 active:shadow-none"
      >
        <span className="text-xl" aria-hidden>
          💬
        </span>
        <span className="hidden sm:inline">Tell us!</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-title"
            className="fixed inset-0 z-50 flex items-end justify-center bg-royal-700/90 p-4 backdrop-blur sm:items-center"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            <motion.div
              className="kid-card w-full max-w-md p-6"
              initial={reduce ? false : { y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { y: 24, opacity: 0 }}
              transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 28 }}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <h2 id="feedback-title" className="text-2xl font-extrabold text-ink">
                  Tell us something! <span aria-hidden>💬</span>
                </h2>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-royal-50 text-2xl font-extrabold text-royal hover:bg-royal-100"
                >
                  <span aria-hidden>×</span>
                </button>
              </div>

              {!done ? (
                <>
                  {/* Category chips */}
                  <div
                    role="radiogroup"
                    aria-label="What kind of feedback?"
                    className="mb-4 grid grid-cols-3 gap-2"
                  >
                    {FEEDBACK_CATEGORIES.map((c) => {
                      const active = c.key === category;
                      return (
                        <button
                          key={c.key}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => setCategory(c.key)}
                          className={`flex flex-col items-center gap-1 rounded-blob px-2 py-3 text-sm font-extrabold ring-1 transition-colors ${
                            active
                              ? "bg-royal text-white ring-royal"
                              : "bg-white text-ink ring-line hover:bg-royal-50"
                          }`}
                        >
                          <span className="text-3xl" aria-hidden>
                            {c.emoji}
                          </span>
                          {c.label}
                        </button>
                      );
                    })}
                  </div>

                  <label htmlFor="feedback-message" className="sr-only">
                    Your message
                  </label>
                  <textarea
                    id="feedback-message"
                    ref={textareaRef}
                    value={message}
                    maxLength={MESSAGE_MAX}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="What do you want to tell us?"
                    className="w-full resize-none rounded-blob border-0 bg-canvas p-4 text-lg font-semibold text-ink ring-1 ring-line placeholder:text-muted focus:ring-2 focus:ring-royal"
                  />

                  {status === "error" && (
                    <p className="mt-2 font-bold text-unity" role="alert">
                      Couldn&rsquo;t send — please try again.
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={submit}
                    disabled={message.trim().length < 2 || status === "sending"}
                    className="kid-btn mt-4 w-full bg-unity text-white disabled:opacity-50"
                  >
                    {status === "sending" ? "Sending…" : "Send"}{" "}
                    <span aria-hidden>🚀</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <motion.span
                    className="text-6xl"
                    aria-hidden
                    initial={reduce ? false : { scale: 0.6, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 360, damping: 18 }}
                  >
                    🎉
                  </motion.span>
                  <p className="text-2xl font-extrabold text-ink">Thank you!</p>
                  <p className="max-w-xs font-semibold text-muted">
                    {status === "sent"
                      ? "We got your message. You're helping make this better!"
                      : "We saved your message. Thanks for helping!"}
                  </p>
                  {issueUrl && (
                    <a
                      href={issueUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-bold text-royal underline"
                    >
                      View the issue (for grown-ups)
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={close}
                    className="kid-btn mt-2 bg-royal text-white"
                  >
                    Done <span aria-hidden>👍</span>
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

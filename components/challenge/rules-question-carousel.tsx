"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Slide = {
  id: string;
  title: string;
  summary: string;
  example: string;
  hint: string;
};

const SLIDES: Slide[] = [
  {
    id: "multiple_choice",
    title: "Multiple choice",
    summary: "Read the prompt and tap the single best answer.",
    example: "Prompt: “Choose the correct greeting.”\nOptions: Hello · Goodbye · Thanks",
    hint: "Only one option is correct. Wrong pick ends the run.",
  },
  {
    id: "fill_blank",
    title: "Fill in the blank",
    summary:
      "Read the sentence with the gap (___). The word bank shows possible words — type your answer below.",
    example:
      "Prompt: “They ___ happy today.”\nBank: is · am · are · be\nYou type: are",
    hint: "Your answer must match the correct option exactly — same spelling, spaces, and punctuation.",
  },
  {
    id: "word_order",
    title: "Word order",
    summary:
      "Read the help text, then tap words from the pool in order to build a correct sentence.",
    example:
      "Help: “Ask someone their name (morning).”\nPool: What · is · your · name? · are · my\nYou build: What is your name?",
    hint: "The help line is a clue — not the final answer. Extra words are distractors.",
  },
];

const AUTO_MS = 5500;

type RulesQuestionCarouselProps = {
  className?: string;
};

export function RulesQuestionCarousel({ className }: RulesQuestionCarouselProps) {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index]!;

  const go = useCallback((delta: number) => {
    setIndex((i) => (i + delta + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => go(1), AUTO_MS);
    return () => window.clearInterval(id);
  }, [go]);

  return (
    <div className={cn("relative", className)}>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
          Question types
        </p>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Previous question type"
            onClick={() => go(-1)}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-slate-900/90 text-cyan-200 transition hover:border-cyan-300/50 hover:bg-cyan-500/10"
          >
            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
          <div className="flex items-center gap-1 px-0.5">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Show ${s.title}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-5 bg-cyan-400" : "w-1.5 bg-slate-600 hover:bg-slate-500",
                )}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next question type"
            onClick={() => go(1)}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-slate-900/90 text-cyan-200 transition hover:border-cyan-300/50 hover:bg-cyan-500/10"
          >
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-cyan-400/20 bg-slate-950/60">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {SLIDES.map((s) => (
            <article key={s.id} className="min-h-[11.5rem] w-full shrink-0 px-3 py-3 sm:min-h-[10.5rem] sm:px-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-cyan-100">
                {s.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">{s.summary}</p>
              <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-white/5 bg-black/30 px-2.5 py-2 font-mono text-[10px] leading-relaxed text-slate-400">
                {s.example}
              </pre>
              <p className="mt-2 text-[11px] text-amber-200/85">{s.hint}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

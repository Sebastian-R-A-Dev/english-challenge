"use client";

import { NeonButton } from "@/components/ui/neon-button";
import type { QuestionPublic } from "@/lib/challenge-schemas";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type QuestionPanelProps = {
  question: QuestionPublic;
  difficultyName: string;
  expiresAt: string;
  questionSeconds: number;
  introActive: boolean;
  disabled?: boolean;
  onSubmit: (answer: string) => void;
  onTimeout: () => void;
};

function parseOptions(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((x): x is string => typeof x === "string");
}

function questionText(q: QuestionPublic): string {
  if (typeof q.question === "string") return q.question;
  if (Array.isArray(q.question)) return q.question.join(" ");
  return "";
}

function shufflePool(words: string[]): string[] {
  const out = [...words];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

export function QuestionPanel({
  question,
  difficultyName,
  expiresAt,
  questionSeconds,
  introActive,
  disabled,
  onSubmit,
  onTimeout,
}: QuestionPanelProps) {
  const [fillAnswer, setFillAnswer] = useState("");
  const [wordTokens, setWordTokens] = useState<string[]>([]);
  const [remaining, setRemaining] = useState(questionSeconds);
  const slug = question.question_type.slug;
  const options = useMemo(() => {
    const parsed = parseOptions(question.options);
    if (slug === "word_order" || slug === "fill_blank") return shufflePool(parsed);
    return parsed;
  }, [question.options, question.id, slug]);

  const showTapChoices =
    slug === "multiple_choice" || slug === "image_multiple_choice";

  useEffect(() => {
    setFillAnswer("");
    setWordTokens([]);
  }, [question.id]);

  useEffect(() => {
    if (introActive || disabled) return;

    function tick() {
      const ms = new Date(expiresAt).getTime() - Date.now();
      const secs = Math.max(0, Math.ceil(ms / 1000));
      setRemaining(secs);
      if (ms <= 0) onTimeout();
    }

    tick();
    const id = window.setInterval(tick, 200);
    return () => window.clearInterval(id);
  }, [expiresAt, introActive, disabled, onTimeout]);

  function submitValue(value: string) {
    if (disabled || introActive || !value.trim()) return;
    onSubmit(value.trim());
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full border border-violet-400/40 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-200">
          {difficultyName}
        </span>
        <span
          className={cn(
            "font-display text-2xl font-bold tabular-nums",
            remaining <= 3 ? "text-rose-400" : "text-cyan-300",
          )}
        >
          {introActive ? "—" : `${remaining}s`}
        </span>
      </div>

      {introActive ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex min-h-[220px] items-center justify-center rounded-2xl border border-cyan-400/25 bg-slate-900/70 p-8 text-center"
        >
          <p className="font-display text-xl uppercase tracking-[0.3em] text-cyan-200">Get ready…</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-cyan-400/25 bg-slate-900/70 p-6 shadow-[0_0_32px_rgba(34,211,238,0.12)]"
        >
          <p className="text-xs uppercase tracking-wider text-slate-500">{question.question_type.label}</p>
          <p className="mt-3 text-lg font-medium leading-relaxed text-white">{questionText(question)}</p>

          {showTapChoices ? (
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {options.map((opt) => (
                <NeonButton
                  key={opt}
                  variant="ghost"
                  className="justify-start px-4 py-3 text-left text-sm normal-case tracking-normal"
                  disabled={disabled}
                  onClick={() => submitValue(opt)}
                >
                  {opt}
                </NeonButton>
              ))}
            </div>
          ) : null}

          {slug === "fill_blank" ? (
            <div className="mt-6 space-y-4">
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Word bank
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {options.map((opt) => (
                    <div
                      key={opt}
                      className="rounded-xl border border-cyan-400/40 bg-white/5 px-4 py-3 text-left text-sm normal-case tracking-normal text-cyan-100 shadow-[0_0_16px_rgba(34,211,238,0.08)] backdrop-blur-md"
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
              <form
                className="flex flex-col gap-3 sm:flex-row"
                onSubmit={(e) => {
                  e.preventDefault();
                  submitValue(fillAnswer);
                }}
              >
                <input
                  className="flex-1 rounded-xl border border-cyan-500/30 bg-slate-950/80 px-4 py-3 text-white outline-none ring-cyan-400/40 focus:ring-2"
                  value={fillAnswer}
                  disabled={disabled}
                  onChange={(e) => setFillAnswer(e.target.value)}
                  placeholder="Type the missing word exactly"
                  autoComplete="off"
                  spellCheck={false}
                />
                <NeonButton type="submit" disabled={disabled || !fillAnswer.trim()}>
                  Submit
                </NeonButton>
              </form>
            </div>
          ) : null}

          {slug === "word_order" ? (
            <div className="mt-6 space-y-4">
              <div className="min-h-[3rem] rounded-xl border border-dashed border-cyan-400/30 bg-slate-950/50 p-3 text-cyan-100">
                {wordTokens.length ? wordTokens.join(" ") : "Tap words below in order…"}
              </div>
              <div className="flex flex-wrap gap-2">
                {options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    disabled={disabled || wordTokens.includes(opt)}
                    className="rounded-lg border border-cyan-400/30 bg-slate-800 px-3 py-2 text-sm text-white transition hover:bg-cyan-500/20 disabled:opacity-40"
                    onClick={() => setWordTokens((t) => [...t, opt])}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <NeonButton variant="ghost" disabled={disabled} onClick={() => setWordTokens([])}>
                  Reset
                </NeonButton>
                <NeonButton
                  disabled={disabled || wordTokens.length === 0}
                  onClick={() => submitValue(wordTokens.join(" "))}
                >
                  Submit
                </NeonButton>
              </div>
            </div>
          ) : null}
        </motion.div>
      )}
    </div>
  );
}

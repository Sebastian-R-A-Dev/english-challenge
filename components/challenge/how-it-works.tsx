"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Award, Brain, Gauge, Globe2, Rocket, Swords } from "lucide-react";

const cards = [
  {
    icon: Brain,
    title: "English-only challenges",
    desc: "Timed sets of grammar, vocabulary, and comprehension—pure skill, no fluff.",
    accent: "from-cyan-500/20 to-transparent",
  },
  {
    icon: Gauge,
    title: "Smart scoring",
    desc: "Only precision decides the outcome—right answers win, mistakes lose. Streaks and speed don't change that.",
    accent: "from-violet-500/20 to-transparent",
  },
  {
    icon: Swords,
    title: "Difficulty tiers",
    desc: "Warm up on casual brackets or climb nightmare ladders reserved for pros.",
    accent: "from-sky-500/20 to-transparent",
  },
  {
    icon: Globe2,
    title: "Global ranking",
    desc: "Compare against players worldwide on seasonal boards that reset the hype.",
    accent: "from-fuchsia-500/20 to-transparent",
  },
  {
    icon: Rocket,
    title: "How you win",
    desc: "Clear every question with zero mistakes. Fresh sets arrive weekly or daily—keep your edge and fight to stay #1 on the leaderboard.",
    accent: "from-emerald-500/15 to-transparent",
  },
  {
    icon: Award,
    title: "The objective",
    desc: "Prove who has the sharpest English—unlock badges, tiers, and seasonal glory.",
    accent: "from-amber-500/15 to-transparent",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-4 py-20 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            How the challenge works
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            A futuristic arena built for measurable progress: answer fast, answer right, and climb.
          </p>
        </motion.div>

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {cards.map(({ icon: Icon, title, desc, accent }) => (
            <motion.li
              key={title}
              variants={item}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-md transition-shadow hover:border-cyan-400/35 hover:shadow-[0_0_40px_rgba(34,211,238,0.12)]",
              )}
            >
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80 transition-opacity group-hover:opacity-100",
                  accent,
                )}
              />
              <div className="relative">
                <div className="mb-4 inline-flex rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-3 text-cyan-300">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{desc}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

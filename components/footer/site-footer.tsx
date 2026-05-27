"use client";

import { motion } from "framer-motion";
import { Briefcase, Code2, MessageCircle } from "lucide-react";

const social = [
  { label: "GitHub (mock)", href: "#", icon: Code2 },
  { label: "LinkedIn (mock)", href: "#", icon: Briefcase },
  { label: "Twitter (mock)", href: "#", icon: MessageCircle },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-12 border-t border-cyan-500/15 bg-slate-950/80 px-4 py-14 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 md:flex-row md:items-start md:justify-between">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-md text-center md:text-left"
        >
          <p className="font-display text-lg font-bold text-white">English Challenge</p>
          <p className="mt-2 text-sm text-slate-400">
            Competitive English gaming platform — skill challenges, live rankings, and a
            futuristic arena built for players who want measurable progress.
          </p>
          <p className="mt-4 text-xs uppercase tracking-widest text-cyan-500/80">
            English Skill Challenge
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="text-center md:text-right"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Created by
          </p>
          <p className="mt-2 font-display text-lg text-cyan-100">
            Sebastian De Jesus Ruiz Avila
          </p>
          <div className="mt-5 flex justify-center gap-3 md:justify-end">
            {social.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all hover:border-cyan-400/40 hover:text-cyan-200 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
              >
                <Icon className="h-5 w-5" aria-hidden />
              </a>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-600">Social links are placeholders for now.</p>
        </motion.div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl text-center text-xs text-slate-600">
        © {new Date().getFullYear()} English Challenge. Portfolio concept — not affiliated with
        any trademark holders.
      </p>
    </footer>
  );
}

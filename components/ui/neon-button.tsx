"use client";

import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type NeonButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  variant?: "primary" | "ghost";
  children?: ReactNode;
};

export function NeonButton({
  className,
  variant = "primary",
  children,
  ...props
}: NeonButtonProps) {
  const base =
    "relative inline-flex flex-row flex-nowrap items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:pointer-events-none disabled:opacity-40";

  const styles =
    variant === "primary"
      ? "bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-500 text-slate-950 shadow-[0_0_32px_rgba(34,211,238,0.35)] hover:shadow-[0_0_48px_rgba(167,139,250,0.45)]"
      : "border border-cyan-400/40 bg-white/5 text-cyan-100 backdrop-blur-md hover:border-cyan-300/70 hover:bg-cyan-500/10 hover:shadow-[0_0_24px_rgba(34,211,238,0.2)]";

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 24 }}
      className={cn(base, styles, className)}
      {...props}
    >
      <span className="relative z-10 inline-flex flex-row flex-nowrap items-center gap-2">
        {children}
      </span>
      {variant === "primary" ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-xl opacity-40 blur-xl"
          style={{
            background:
              "linear-gradient(90deg, rgb(34 211 238), rgb(139 92 246), rgb(59 130 246))",
          }}
        />
      ) : null}
    </motion.button>
  );
}

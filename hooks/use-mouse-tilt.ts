"use client";

import { useCallback, useRef } from "react";

type Tilt = { rotateX: number; rotateY: number };

export function useMouseTilt(intensity = 12) {
  const ref = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<Tilt>({ rotateX: 0, rotateY: 0 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      tiltRef.current = {
        rotateY: x * intensity,
        rotateX: -y * intensity,
      };
      el.style.transform = `perspective(900px) rotateX(${tiltRef.current.rotateX}deg) rotateY(${tiltRef.current.rotateY}deg)`;
    },
    [intensity],
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}

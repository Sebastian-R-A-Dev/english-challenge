"use client";

import {
  nicknameLevelEffectClass,
  splitNicknameSegments,
} from "@/lib/player-nickname-display";
import { cn } from "@/lib/utils";

export function PlayerNickname({
  nickname,
  level,
  className,
  truncate = false,
  title,
}: {
  nickname: string;
  level: number;
  className?: string;
  truncate?: boolean;
  title?: string;
}) {
  const segments = splitNicknameSegments(nickname);
  const levelFx = nicknameLevelEffectClass(level);
  const fullTitle = title ?? nickname;

  return (
    <span
      className={cn(
        "inline-flex max-w-full min-w-0 flex-wrap items-baseline gap-1.5",
        truncate && "overflow-hidden",
        className,
      )}
      title={fullTitle}
    >
      {segments.map((seg, i) => {
        if (seg.isGmBadge) {
          return (
            <span key={`gm-${i}`} className="nickname-fx-gm shrink-0 font-bold">
              {seg.text}
            </span>
          );
        }
        const hasVisible = seg.text.trim().length > 0 || seg.text.length > 0;
        return (
          <span
            key={`txt-${i}`}
            className={cn(
              hasVisible && levelFx,
              truncate && "min-w-0 truncate",
            )}
          >
            {seg.text}
          </span>
        );
      })}
    </span>
  );
}

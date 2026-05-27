/** Coincide con etiquetas staff que solo el admin puede asignar: [GM], (GM), {GM}, etc. */
const GM_BADGE_REGEX = /(\[[\s]*gm[\s]*\]|\([\s]*gm[\s]*\)|\{[\s]*gm[\s]*\})/gi;

export type NicknameSegment = {
  text: string;
  isGmBadge: boolean;
};

export function nicknameHasGmBadge(nickname: string): boolean {
  GM_BADGE_REGEX.lastIndex = 0;
  return GM_BADGE_REGEX.test(nickname);
}

export function splitNicknameSegments(nickname: string): NicknameSegment[] {
  const parts: NicknameSegment[] = [];
  const re = new RegExp(GM_BADGE_REGEX.source, "gi");
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(nickname)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: nickname.slice(lastIndex, match.index), isGmBadge: false });
    }
    parts.push({ text: match[0], isGmBadge: true });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < nickname.length) {
    parts.push({ text: nickname.slice(lastIndex), isGmBadge: false });
  }
  if (parts.length === 0) {
    parts.push({ text: nickname, isGmBadge: false });
  }
  return parts;
}

export function nicknameLevelEffectClass(level: number): string | null {
  if (level >= 1000) return "nickname-fx-max";
  if (level >= 500) return "nickname-fx-elite";
  return null;
}

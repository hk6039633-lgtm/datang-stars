import type { Character } from "../types";

const sizeMap = {
  sm: "h-10 w-10 text-sm",
  md: "h-14 w-14 text-lg",
  lg: "h-20 w-20 text-2xl",
  xl: "h-28 w-28 text-3xl",
};

export function CharacterAvatar({
  character,
  size = "md",
  className = "",
}: {
  character: Character;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const src = character.avatarPath || character.effectiveAvatarPath;
  const isExclusive = !!character.avatarPath;

  if (!src) {
    return (
      <span
        className={`inline-flex ${sizeMap[size]} shrink-0 items-center justify-center rounded-full border border-amber-300/60 bg-[#f3e9d8] font-semibold text-[#5c3a1e] ${className}`}
      >
        {character.name.charAt(0)}
      </span>
    );
  }

  return (
    <div
      className={`relative ${sizeMap[size]} shrink-0 overflow-hidden rounded-full border ${
        isExclusive
          ? "border-amber-600/40 shadow-[0_0_0_3px_rgba(180,83,9,0.08)]"
          : "border-amber-300/60 bg-[#fdfbf7]"
      } ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={character.name}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover object-top"
      />
    </div>
  );
}

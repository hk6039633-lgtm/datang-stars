import Link from "next/link";
import { CharacterAvatar } from "./CharacterAvatar";
import { TangTag } from "./TangTag";
import type { Character } from "../types";

export function CharacterCardPreview({ character: c }: { character: Character }) {
  return (
    <Link
      href={`/characters/${c.id}`}
      className="group flex items-center gap-3 rounded-xl border border-amber-200/70 bg-[#fdfbf7] p-3 transition hover:border-amber-400 hover:shadow-sm"
    >
      <CharacterAvatar character={c} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-[#451a03] group-hover:text-amber-800">{c.name}</p>
        <TangTag variant="category">{c.primaryCategory}</TangTag>
      </div>
    </Link>
  );
}

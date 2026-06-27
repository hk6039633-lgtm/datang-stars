import Link from "next/link";
import { getCharacters } from "../lib/data";
import { CharacterAvatar } from "../components/CharacterAvatar";
import { TangTag } from "../components/TangTag";
import { SectionTitle } from "../components/SectionTitle";
import type { Character } from "../types";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

const categoryOrder: { label: string; key: string }[] = [
  { label: "全部", key: "全部" },
  { label: "皇帝/皇室", key: "皇帝/皇室" },
  { label: "宰相/大臣", key: "宰相/大臣" },
  { label: "武将/将领", key: "武将/将领" },
  { label: "节度使/藩镇", key: "节度使/藩镇" },
  { label: "宦官", key: "宦官" },
  { label: "后宫/女性", key: "后宫/女性" },
  { label: "外族", key: "外族" },
  { label: "文人", key: "文人" },
  { label: "叛乱势力", key: "叛乱势力" },
  { label: "宗教人物", key: "宗教人物" },
  { label: "其他", key: "其他" },
];

function getDisplayName(c: Character): string {
  return c.displayName || c.name;
}

function getIdentity(c: Character): string {
  return c.dynastyTitle || c.templeName || c.role;
}

function getCoreTags(c: Character): string[] {
  const tags: string[] = [];
  if (c.subCategory) tags.push(c.subCategory);
  if (c.events && c.events.length > 0) {
    tags.push(...c.events.slice(0, 2));
  }
  return tags.slice(0, 3);
}

function rankBadgeClass(idx: number): string {
  if (idx === 0) return "bg-amber-800 text-white shadow-sm";
  if (idx === 1) return "bg-amber-700 text-white";
  if (idx === 2) return "bg-amber-600 text-white";
  return "bg-amber-100 text-amber-900 border border-amber-200";
}

export default async function RankingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const selectedCategory = params.category || "全部";

  let characters = await getCharacters();

  if (selectedCategory !== "全部") {
    characters = characters.filter((c) => c.primaryCategory === selectedCategory);
  }

  const ranked = [...characters]
    .filter((c) => (c.historicalImportanceScore ?? 0) > 0)
    .sort((a, b) => (b.historicalImportanceScore ?? 0) - (a.historicalImportanceScore ?? 0))
    .slice(0, 100);

  return (
    <main className="min-h-screen bg-[#f8f3e9] px-4 py-8 text-[#451a03]">
      <div className="mx-auto max-w-6xl">
        <SectionTitle subtitle="基于唐朝历史地位、政治军事文化影响与时代节点作用的综合评分">
          历史影响榜{selectedCategory !== "全部" ? ` · ${selectedCategory}` : ""}
        </SectionTitle>

        {/* 分类筛选 */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
          {categoryOrder.map((cat) => {
            const active = selectedCategory === cat.key;
            const href = cat.key === "全部" ? "/ranking" : `/ranking?category=${encodeURIComponent(cat.key)}`;
            return (
              <Link
                key={cat.key}
                href={href}
                className={`rounded-full px-2.5 py-1 text-xs border transition sm:px-3 sm:py-1.5 sm:text-sm ${
                  active
                    ? "bg-amber-800 text-white border-amber-800"
                    : "bg-[#fdfbf7] text-amber-800 border-amber-200 hover:border-amber-400 hover:bg-amber-50"
                }`}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>

        <p className="mb-4 text-center text-sm text-amber-700">
          共 <span className="font-semibold text-[#451a03]">{ranked.length}</span> 位人物
        </p>

        {/* 桌面端表格 */}
        <div className="hidden overflow-hidden rounded-2xl border border-amber-200/80 bg-[#fdfbf7] shadow-sm md:block">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-amber-100 bg-amber-50/60 text-[#451a03]">
              <tr>
                <th className="px-4 py-3 font-semibold">排名</th>
                <th className="px-4 py-3 font-semibold">人物</th>
                <th className="px-4 py-3 font-semibold">主要身份</th>
                <th className="px-4 py-3 font-semibold">分类</th>
                <th className="px-4 py-3 text-right font-semibold">历史影响力</th>
                <th className="px-4 py-3 font-semibold">核心标签</th>
                <th className="px-4 py-3 font-semibold">影响说明</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((c, idx) => (
                <tr
                  key={c.id}
                  className="border-t border-amber-100 transition hover:bg-amber-50/50"
                >
                  <td className="px-4 py-4 align-top">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${rankBadgeClass(idx)}`}
                    >
                      {idx + 1}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <Link
                      href={`/characters/${c.id}`}
                      className="flex items-center gap-3 font-medium text-[#451a03] hover:text-amber-800 hover:underline"
                    >
                      <CharacterAvatar character={c} size="sm" />
                      <span className="font-semibold">{getDisplayName(c)}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-4 align-top text-amber-800/90">{getIdentity(c)}</td>
                  <td className="px-4 py-4 align-top">
                    <TangTag variant="category">{c.primaryCategory}</TangTag>
                  </td>
                  <td className="px-4 py-4 align-top text-right">
                    <span className="text-lg font-bold text-[#451a03]">{c.historicalImportanceScore}</span>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-wrap gap-1">
                      {getCoreTags(c).map((tag) => (
                        <TangTag key={tag} variant="default">
                          {tag}
                        </TangTag>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top text-amber-800/85">
                    <p className="max-w-xs line-clamp-2">{c.impactStatement || c.summary}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 移动端卡片榜单 */}
        <div className="space-y-4 md:hidden">
          {ranked.map((c, idx) => (
            <RankingCard key={c.id} character={c} rank={idx + 1} />
          ))}
        </div>
      </div>
    </main>
  );
}

function RankingCard({ character: c, rank }: { character: Character; rank: number }) {
  return (
    <Link
      href={`/characters/${c.id}`}
      className="flex gap-3 rounded-2xl border border-amber-200/80 bg-[#fdfbf7] p-3 shadow-sm transition hover:border-amber-400 sm:p-4"
    >
      <div className="flex flex-col items-center pt-1">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${rankBadgeClass(rank - 1)}`}
        >
          {rank}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center gap-3">
          <CharacterAvatar character={c} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-bold text-[#451a03] sm:text-lg">{getDisplayName(c)}</p>
            <p className="truncate text-xs text-amber-700">{getIdentity(c)}</p>
          </div>
          <span className="shrink-0 text-lg font-bold text-[#451a03]">{c.historicalImportanceScore}</span>
        </div>
        <div className="mb-2 flex flex-wrap gap-1">
          <TangTag variant="category">{c.primaryCategory}</TangTag>
          {getCoreTags(c).map((tag) => (
            <TangTag key={tag} variant="default">
              {tag}
            </TangTag>
          ))}
        </div>
        <p className="line-clamp-2 text-sm text-amber-800/85">{c.impactStatement || c.summary}</p>
      </div>
    </Link>
  );
}

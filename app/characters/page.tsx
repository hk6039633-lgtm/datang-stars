import Link from "next/link";
import { getCharacters } from "../lib/data";
import { matchCharacterSearch } from "../lib/search";
import { CharacterAvatar } from "../components/CharacterAvatar";
import { TangTag } from "../components/TangTag";
import { SectionTitle } from "../components/SectionTitle";
import { TangPanel } from "../components/TangPanel";
import type { Character } from "../types";

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
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

const labelToKey = new Map(categoryOrder.map((c) => [c.label, c.key]));
const keyToLabel = new Map(categoryOrder.map((c) => [c.key, c.label]));

export default async function CharactersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = (params.q || "").trim();
  const selectedLabel = params.category || "";
  const selectedKey = selectedLabel ? labelToKey.get(selectedLabel) || selectedLabel : "";
  const sort = params.sort || "importance-desc";

  let characters = await getCharacters();

  if (q) {
    characters = characters.filter((c) => matchCharacterSearch(c, q));
  }

  if (selectedKey && selectedKey !== "全部") {
    characters = characters.filter((c) => c.primaryCategory === selectedKey);
  }

  characters = [...characters].sort((a, b) => {
    if (sort === "importance-desc")
      return (b.historicalImportanceScore ?? 0) - (a.historicalImportanceScore ?? 0);
    if (sort === "importance-asc")
      return (a.historicalImportanceScore ?? 0) - (b.historicalImportanceScore ?? 0);
    if (sort === "mentions-desc") return b.mentions - a.mentions;
    if (sort === "mentions-asc") return a.mentions - b.mentions;
    if (sort === "name") return a.name.localeCompare(b.name, "zh-CN");
    return 0;
  });

  function queryLink(overrides: Record<string, string>) {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (selectedLabel) sp.set("category", selectedLabel);
    if (sort) sp.set("sort", sort);
    Object.entries(overrides).forEach(([k, v]) => {
      if (v) sp.set(k, v);
      else sp.delete(k);
    });
    const s = sp.toString();
    return `/characters${s ? `?${s}` : ""}`;
  }

  return (
    <main className="min-h-screen bg-[#f8f3e9] px-4 py-8 text-[#451a03]">
      <div className="mx-auto max-w-6xl">
        <SectionTitle subtitle="浏览《唐朝演义》全部人物，按类型与历史影响力探索">
          群英录
        </SectionTitle>

        <TangPanel className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <form className="flex-1" action="/characters" method="GET">
              <div className="flex gap-2">
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="搜索姓名、身份、事件或简介…"
                  className="flex-1 rounded-lg border border-amber-200/80 bg-[#f8f3e9] px-4 py-2 text-[#451a03] placeholder:text-amber-400/80 focus:border-amber-500 focus:outline-none"
                />
                {selectedLabel && <input type="hidden" name="category" value={selectedLabel} />}
                {sort !== "importance-desc" && <input type="hidden" name="sort" value={sort} />}
                <button
                  type="submit"
                  className="shrink-0 rounded-lg bg-amber-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-[#451a03]"
                >
                  搜索
                </button>
              </div>
            </form>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-amber-700">排序：</span>
              {[
                { key: "importance-desc", label: "历史影响力 ↓" },
                { key: "importance-asc", label: "历史影响力 ↑" },
                { key: "mentions-desc", label: "出场次数 ↓" },
                { key: "mentions-asc", label: "出场次数 ↑" },
                { key: "name", label: "姓名" },
              ].map((opt) => (
                <Link
                  key={opt.key}
                  href={queryLink({ sort: opt.key })}
                  className={`rounded-full px-2.5 py-1 text-xs border transition sm:px-3 sm:text-sm ${
                    sort === opt.key
                      ? "bg-amber-800 text-white border-amber-800"
                      : "bg-[#fdfbf7] text-amber-800 border-amber-200 hover:border-amber-400"
                  }`}
                >
                  {opt.label}
                </Link>
              ))}
            </div>
          </div>
        </TangPanel>

        {/* 分类筛选 */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {categoryOrder.map((cat) => {
            const active = selectedKey === cat.key || (selectedKey === "" && cat.key === "全部");
            return (
              <Link
                key={cat.label}
                href={queryLink({ category: cat.key === "全部" ? "" : cat.label })}
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

        <p className="mb-4 text-sm text-amber-700">
          共找到 <span className="font-semibold text-[#451a03]">{characters.length}</span> 位人物
        </p>

        {characters.length === 0 ? (
          <TangPanel className="py-12 text-center text-amber-700">
            未找到符合条件的人物
          </TangPanel>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {characters.map((c) => (
              <CharacterCard key={c.id} character={c} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function CharacterCard({ character: c }: { character: Character }) {
  const isExclusive = !!c.avatarPath;
  return (
    <Link
      href={`/characters/${c.id}`}
      className={`group flex flex-col rounded-2xl border bg-[#fdfbf7] p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-5 ${
        isExclusive ? "border-amber-400/60" : "border-amber-200/80"
      }`}
    >
      <div className="mb-4 flex items-start gap-4">
        <CharacterAvatar character={c} size={isExclusive ? "lg" : "md"} />
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h2 className="text-lg font-bold text-[#451a03] group-hover:text-amber-800 sm:text-xl">{c.name}</h2>
          </div>
          <div className="mb-2 flex flex-wrap gap-1.5">
            <TangTag variant="category">{c.primaryCategory}</TangTag>
            {c.subCategory && <TangTag variant="default">{c.subCategory}</TangTag>}
          </div>
        </div>
      </div>

      <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-amber-800/85">
        {c.impactStatement || c.summary}
      </p>

      <div className="mt-auto flex items-center justify-between border-t border-amber-100 pt-3">
        <span className="text-xs text-amber-600">出场 {c.mentions} 次</span>
        <TangTag variant="score">{c.historicalImportanceScore ?? "-"} 分</TangTag>
      </div>
    </Link>
  );
}

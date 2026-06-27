"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { BookTimelineEvent, Character } from "../types";

interface ChronicleClientProps {
  events: BookTimelineEvent[];
  nameToId: Map<string, string>;
  stages: string[];
  types: string[];
}

const STAGE_ORDER = [
  "隋末唐初",
  "贞观之治",
  "永徽至武周",
  "中宗睿宗",
  "开元盛世",
  "安史之乱",
  "中唐藩镇",
  "晚唐残局",
];

const importanceText: Record<number, string> = {
  1: "一般",
  2: "一般",
  3: "重要",
  4: "重要",
  5: "关键",
};

const typeColors: Record<string, string> = {
  战争: "bg-red-100 text-red-800 border-red-200",
  叛乱: "bg-stone-100 text-stone-800 border-stone-200",
  政治: "bg-indigo-100 text-indigo-800 border-indigo-200",
  外交: "bg-teal-100 text-teal-800 border-teal-200",
  人物命运: "bg-pink-100 text-pink-800 border-pink-200",
  建国: "bg-amber-100 text-amber-800 border-amber-200",
  宫廷: "bg-purple-100 text-purple-800 border-purple-200",
  文化: "bg-blue-100 text-blue-800 border-blue-200",
};

export default function ChronicleClient({ events, nameToId, stages, types }: ChronicleClientProps) {
  const [search, setSearch] = useState("");
  const [selectedStage, setSelectedStage] = useState<string>("全部");
  const [selectedType, setSelectedType] = useState<string>("全部");

  const sortedStages = useMemo(() => {
    return STAGE_ORDER.filter((s) => stages.includes(s)).concat(stages.filter((s) => !STAGE_ORDER.includes(s)));
  }, [stages]);

  const filteredEvents = useMemo(() => {
    let list = [...events];

    if (selectedStage !== "全部") {
      list = list.filter((e) => e.stage === selectedStage);
    }

    if (selectedType !== "全部") {
      list = list.filter((e) => e.type.includes(selectedType));
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.year.toLowerCase().includes(q) ||
          (e.yearRange && e.yearRange.toLowerCase().includes(q)) ||
          e.chapter.toLowerCase().includes(q) ||
          e.summary.toLowerCase().includes(q) ||
          e.people.some((p) => p.toLowerCase().includes(q)) ||
          e.places.some((p) => p.toLowerCase().includes(q))
      );
    }

    return list;
  }, [events, selectedStage, selectedType, search]);

  const grouped = useMemo(() => {
    const map = new Map<string, BookTimelineEvent[]>();
    filteredEvents.forEach((e) => {
      if (!map.has(e.stage)) map.set(e.stage, []);
      map.get(e.stage)!.push(e);
    });
    return sortedStages
      .filter((s) => map.has(s))
      .map((s) => ({ stage: s, events: map.get(s)! }));
  }, [filteredEvents, sortedStages]);

  return (
    <main className="min-h-screen bg-[#fdfbf7] px-4 py-8 text-amber-950">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-amber-900">全书年表</h1>
        <p className="mb-6 text-amber-700">从《唐朝演义》的叙事顺序，看见大唐三百年事件流。</p>

        {/* 搜索与筛选 */}
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-amber-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索事件、人物、地点、年份、章节…"
            className="flex-1 rounded-lg border border-amber-200 bg-[#fdfbf7] px-4 py-2 text-amber-900 placeholder:text-amber-400 focus:border-amber-400 focus:outline-none"
          />
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-amber-900 focus:border-amber-400 focus:outline-none"
          >
            <option value="全部">全部阶段</option>
            {sortedStages.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-amber-900 focus:border-amber-400 focus:outline-none"
          >
            <option value="全部">全部类型</option>
            {types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* 移动端阶段快速筛选 */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide lg:hidden">
          <button
            onClick={() => setSelectedStage("全部")}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs border transition ${
              selectedStage === "全部"
                ? "bg-amber-800 text-white border-amber-800"
                : "bg-white text-amber-800 border-amber-200 hover:border-amber-400"
            }`}
          >
            全部阶段
          </button>
          {sortedStages.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedStage(s)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs border transition ${
                selectedStage === s
                  ? "bg-amber-800 text-white border-amber-800"
                  : "bg-white text-amber-800 border-amber-200 hover:border-amber-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <p className="mb-4 text-sm text-amber-600">
          共找到 <span className="font-semibold text-amber-900">{filteredEvents.length}</span> 个事件
        </p>

        <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
          {/* 左侧阶段导航 */}
          <nav className="hidden lg:block">
            <div className="sticky top-24 rounded-xl border border-amber-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 font-semibold text-amber-900">历史阶段</h2>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setSelectedStage("全部")}
                    className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                      selectedStage === "全部" ? "bg-amber-100 text-amber-900" : "text-amber-700 hover:bg-amber-50"
                    }`}
                  >
                    全部阶段
                  </button>
                </li>
                {sortedStages.map((s) => (
                  <li key={s}>
                    <button
                      onClick={() => setSelectedStage(s)}
                      className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                        selectedStage === s ? "bg-amber-100 text-amber-900" : "text-amber-700 hover:bg-amber-50"
                      }`}
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* 主区域事件卡片 */}
          <div className="space-y-10">
            {grouped.length === 0 ? (
              <div className="rounded-xl border border-amber-200 bg-white p-12 text-center text-amber-600">
                未找到符合条件的事件
              </div>
            ) : (
              grouped.map(({ stage, events: stageEvents }) => (
                <section key={stage} id={stage}>
                  <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-amber-900">
                    <span className="h-px flex-1 bg-amber-200" />
                    {stage}
                    <span className="h-px flex-1 bg-amber-200" />
                  </h2>
                  <div className="space-y-4">
                    {stageEvents.map((evt) => (
                      <EventCard key={evt.id} event={evt} nameToId={nameToId} />
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function EventCard({ event: evt, nameToId }: { event: BookTimelineEvent; nameToId: Map<string, string> }) {
  const displayYear = evt.yearRange || evt.year;

  return (
    <div className="rounded-xl border border-amber-200 bg-white p-5 shadow-sm transition hover:border-amber-300">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2 text-xs text-amber-600 sm:text-sm">
            <span className="font-semibold text-amber-800">{displayYear}</span>
            <span>·</span>
            <span>{evt.chapter}</span>
          </div>
          <h3 className="text-base font-bold text-amber-900 sm:text-lg">{evt.title}</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {evt.type.map((t) => (
            <span
              key={t}
              className={`rounded-full px-2 py-0.5 text-xs border ${typeColors[t] || "bg-amber-100 text-amber-800 border-amber-200"}`}
            >
              {t}
            </span>
          ))}
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
            {importanceText[evt.importance] || "一般"}
          </span>
        </div>
      </div>

      <p className="mb-4 leading-relaxed text-amber-800/90">{evt.summary}</p>

      <div className="flex flex-wrap gap-4 text-sm">
        {evt.people.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-amber-500">人物：</span>
            {evt.people.map((name) => {
              const id = nameToId.get(name);
              if (id) {
                return (
                  <Link
                    key={name}
                    href={`/characters/${id}`}
                    className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-amber-800 transition hover:border-amber-400 hover:bg-amber-100"
                  >
                    {name}
                  </Link>
                );
              }
              return (
                <span key={name} className="rounded-full border border-amber-100 bg-amber-50/50 px-2.5 py-0.5 text-amber-600">
                  {name}
                </span>
              );
            })}
          </div>
        )}

        {evt.places.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-amber-500">地点：</span>
            {evt.places.map((place) => (
              <span key={place} className="text-amber-700">
                {place}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

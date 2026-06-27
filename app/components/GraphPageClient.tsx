"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { Character, HistoricalEvent, BookTimelineEvent } from "../types";
import type { GraphData, GraphNode } from "../lib/graphData";

import {
  buildStarGraph,
  buildEventGraph,
  buildNeighborhoodGraph,
} from "../lib/graphData";
import { matchCharacterSearch } from "../lib/search";
import { CharacterAvatar } from "./CharacterAvatar";
import { TangTag } from "./TangTag";
import { TangPanel } from "./TangPanel";
import GraphModeTabs, { type GraphMode } from "./GraphModeTabs";

const EChartsGraph = dynamic(() => import("./EChartsGraph"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-amber-700">
      图谱加载中…
    </div>
  ),
});

const CATEGORY_ORDER = [
  "全部",
  "皇帝/皇室",
  "宰相/大臣",
  "武将/将领",
  "节度使/藩镇",
  "宦官",
  "后宫/女性",
  "外族",
  "文人",
  "叛乱势力",
  "宗教人物",
  "其他",
];

const LIMIT_OPTIONS = [30, 60, 80, 100];

interface GraphPageClientProps {
  characters: Character[];
  events: HistoricalEvent[];
  bookEvents: BookTimelineEvent[];
}

export default function GraphPageClient({ characters, events, bookEvents }: GraphPageClientProps) {
  const [mode, setMode] = useState<GraphMode>("star");
  const [starLimit, setStarLimit] = useState(80);
  const [starCategory, setStarCategory] = useState("全部");
  const [starSearch, setStarSearch] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || "");
  const [centerCharQuery, setCenterCharQuery] = useState("");
  const [centerCharId, setCenterCharId] = useState<string | null>(null);
  const [neighborhoodFilter, setNeighborhoodFilter] = useState<"all" | "important" | "top10">("all");
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const characterId = params.get("character");
    if (!characterId) return;
    const char = characters.find((c) => c.id === characterId);
    if (!char) return;
    setSelectedNode({
      id: char.id,
      name: char.name,
      value: char.mentions,
      category: char.primaryCategory || "其他",
      symbolSize: Math.max(7, Math.min(22, 8 + char.mentions / 32)),
      labelShow: char.mentions >= 40,
      raw: char,
      nodeType: "character",
    });
  }, [characters]);

  const eventMap = useMemo(() => new Map(events.map((e) => [e.id, e])), [events]);

  const graphData: GraphData = useMemo(() => {
    if (mode === "star") {
      return buildStarGraph(characters, events, bookEvents, {
        limit: starLimit,
        category: starCategory,
        search: starSearch,
      });
    }
    if (mode === "event") {
      const evt = eventMap.get(selectedEventId) || events[0];
      return evt ? buildEventGraph(characters, evt, bookEvents) : { nodes: [], links: [], categories: [] };
    }
    if (!centerCharId) {
      return { nodes: [], links: [], categories: [] };
    }
    return buildNeighborhoodGraph(characters, events, bookEvents, centerCharId, {
      eventFilter: neighborhoodFilter,
    }).data;
  }, [mode, characters, events, bookEvents, starLimit, starCategory, starSearch, selectedEventId, centerCharId, eventMap, neighborhoodFilter]);

  const neighborhoodResult = useMemo(() => {
    if (!centerCharId) return null;
    return buildNeighborhoodGraph(characters, events, bookEvents, centerCharId, {
      eventFilter: neighborhoodFilter,
    });
  }, [centerCharId, characters, events, bookEvents, neighborhoodFilter]);

  const selectedNodeStats = useMemo(() => {
    if (!selectedNode) return null;
    if (selectedNode.nodeType === "character") {
      const c = selectedNode.raw as Character;
      const normalizeName = (s: string) => s.trim().replace(/\s+/g, "");
      const coreEventCount = events.filter((evt) =>
        evt.characters.some((ch) => ch.id === c.id || normalizeName(ch.name) === normalizeName(c.name))
      ).length;
      const bookEventCount = bookEvents.filter((evt) =>
        evt.people.some((p) => normalizeName(p) === normalizeName(c.name))
      ).length;
      const coActorIds = new Set<string>();
      events.forEach((evt) => {
        if (evt.characters.some((ch) => ch.id === c.id || normalizeName(ch.name) === normalizeName(c.name))) {
          evt.characters.forEach((ch) => {
            if (ch.id && ch.id !== c.id) coActorIds.add(ch.id);
          });
        }
      });
      bookEvents.forEach((evt) => {
        if (evt.people.some((p) => normalizeName(p) === normalizeName(c.name))) {
          evt.people.forEach((name) => {
            const co = characters.find((cc) => normalizeName(cc.name) === normalizeName(name));
            if (co && co.id !== c.id) coActorIds.add(co.id);
          });
        }
      });
      return {
        coreEventCount,
        bookEventCount,
        coActorCount: coActorIds.size,
        peopleCount: 0,
        type: "-",
        importance: 0,
      };
    }
    if (selectedNode.nodeType === "event") {
      const evt = selectedNode.raw as HistoricalEvent | BookTimelineEvent;
      const isCore = "consequences" in evt;
      const peopleCount = isCore
        ? (evt as HistoricalEvent).characters.length
        : (evt as BookTimelineEvent).people.length;
      const type = isCore
        ? "核心历史事件"
        : ((evt as BookTimelineEvent).type || []).join("、") || "全书年表事件";
      const importance = isCore ? 5 : (evt as BookTimelineEvent).importance;
      return {
        coreEventCount: 0,
        bookEventCount: 0,
        coActorCount: 0,
        peopleCount,
        type,
        importance,
      };
    }
    return null;
  }, [selectedNode, characters, events, bookEvents]);

  function handleCenterSearch() {
    const q = centerCharQuery.trim();
    if (!q) return;
    const found = characters.find((c) => matchCharacterSearch(c, q));
    if (found) {
      setCenterCharId(found.id);
      setSelectedNode(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f3e9] px-4 py-6 text-[#451a03]">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-3xl font-black tracking-wide text-[#451a03]">权力图谱 / 人物星图</h1>

        <GraphModeTabs mode={mode} onChange={(m) => { setMode(m); setSelectedNode(null); }} />

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-4">
            <TangPanel className="py-4">
              {mode === "star" && (
                <>
                  <p className="mb-4 text-sm text-amber-800/90">
                    核心人物星图展示《唐朝演义》中出场频率较高的人物。节点大小代表出场次数，颜色代表人物类型。
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <input
                      value={starSearch}
                      onChange={(e) => setStarSearch(e.target.value)}
                      placeholder="搜索人物…"
                      className="w-full max-w-xs rounded-lg border border-amber-200/80 bg-[#f8f3e9] px-3 py-1.5 text-sm text-[#451a03] placeholder:text-amber-400/80 focus:border-amber-500 focus:outline-none"
                    />
                    <select
                      value={starCategory}
                      onChange={(e) => setStarCategory(e.target.value)}
                      className="rounded-lg border border-amber-200/80 bg-[#fdfbf7] px-3 py-1.5 text-sm text-[#451a03] focus:border-amber-500 focus:outline-none"
                    >
                      {CATEGORY_ORDER.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-amber-700">显示人数：</span>
                      {LIMIT_OPTIONS.map((n) => (
                        <button
                          key={n}
                          onClick={() => setStarLimit(n)}
                          className={`rounded-full px-2.5 py-1 text-xs border transition ${
                            starLimit === n
                              ? "bg-amber-800 text-white border-amber-800"
                              : "bg-[#fdfbf7] text-amber-800 border-amber-200 hover:border-amber-400"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {mode === "event" && (
                <>
                  <p className="mb-4 text-sm text-amber-800/90">
                    事件局势图展示一场核心历史事件中的入局人物。连线只表示人物卷入该事件，不代表全部真实关系。
                  </p>
                  <select
                    value={selectedEventId}
                    onChange={(e) => { setSelectedEventId(e.target.value); setSelectedNode(null); }}
                    className="w-full max-w-md rounded-lg border border-amber-200/80 bg-[#fdfbf7] px-3 py-2 text-sm text-[#451a03] focus:border-amber-500 focus:outline-none"
                  >
                    {events.map((evt) => (
                      <option key={evt.id} value={evt.id}>
                        {evt.title}（{evt.period} · {evt.year}）
                      </option>
                    ))}
                  </select>
                </>
              )}

              {mode === "neighborhood" && (
                <>
                  <p className="mb-4 text-sm text-amber-800/90">
                    人物邻域图以一个人物为中心，展示其卷入的核心事件，以及同一事件中的其他人物。
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                    <input
                      value={centerCharQuery}
                      onChange={(e) => setCenterCharQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCenterSearch()}
                      placeholder="输入人物姓名，如：李世民…"
                      className="w-full max-w-xs rounded-lg border border-amber-200/80 bg-[#f8f3e9] px-3 py-2 text-sm text-[#451a03] placeholder:text-amber-400/80 focus:border-amber-500 focus:outline-none"
                    />
                    <button
                      onClick={handleCenterSearch}
                      className="rounded-lg bg-amber-800 px-4 py-2 text-sm text-white transition hover:bg-[#451a03]"
                    >
                      定位
                    </button>
                    <select
                      value={neighborhoodFilter}
                      onChange={(e) => { setNeighborhoodFilter(e.target.value as any); setSelectedNode(null); }}
                      className="rounded-lg border border-amber-200/80 bg-[#fdfbf7] px-3 py-2 text-sm text-[#451a03] focus:border-amber-500 focus:outline-none"
                    >
                      <option value="all">全部事件</option>
                      <option value="important">重要事件（≥3）</option>
                      <option value="top10">前 10 个事件</option>
                    </select>
                  </div>
                </>
              )}
            </TangPanel>

            <div
              className="relative min-h-[420px] sm:min-h-[560px] lg:min-h-[680px] rounded-2xl border border-amber-200/80 bg-[#fdfbf7] shadow-sm"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 30%, rgba(217,119,6,0.04) 0%, transparent 25%), radial-gradient(circle at 80% 70%, rgba(180,83,9,0.04) 0%, transparent 25%)",
              }}
            >
              {mode === "neighborhood" && !centerCharId && (
                <div className="flex h-full min-h-[420px] sm:min-h-[560px] lg:min-h-[680px] flex-col items-center justify-center text-amber-700">
                  <p className="mb-2 text-3xl">◉</p>
                  <p>请在上方输入人物姓名，查看其邻域图谱</p>
                </div>
              )}
              {mode === "neighborhood" && centerCharId && !neighborhoodResult?.hasData && (
                <div className="flex h-full min-h-[420px] sm:min-h-[560px] lg:min-h-[680px] flex-col items-center justify-center text-amber-700">
                  <p className="mb-2 text-3xl">◉</p>
                  <p>暂无核心事件邻域数据，可在后续版本补充。</p>
                </div>
              )}
              {!(mode === "neighborhood" && (!centerCharId || !neighborhoodResult?.hasData)) && (
                <EChartsGraph
                  data={graphData}
                  onNodeClick={setSelectedNode}
                  selectedId={selectedNode?.id || null}
                  mode={mode}
                />
              )}
            </div>
          </div>

          <aside className="hidden lg:block">
            <TangPanel>
              {renderDetailPanel()}
            </TangPanel>
          </aside>
        </div>
      </div>

      {/* 移动端底部详情抽屉 */}
      {isMobile && selectedNode && (
        <MobileDetailDrawer onClose={() => setSelectedNode(null)}>
          {renderDetailPanel()}
        </MobileDetailDrawer>
      )}
    </main>
  );

  function renderDetailPanel() {
    if (!selectedNode) return <HowToReadCard />;
    if (selectedNode.nodeType === "character") {
      return (
        <CharacterDetailPanel
          character={selectedNode.raw as Character}
          stats={selectedNodeStats!}
        />
      );
    }
    if (selectedNode.nodeType === "event") {
      return (
        <EventDetailPanel
          event={selectedNode.raw as HistoricalEvent | BookTimelineEvent}
          stats={selectedNodeStats!}
        />
      );
    }
    return null;
  }
}

function MobileDetailDrawer({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <>
      {/* 遮罩 */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* 抽屉 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-t-2xl border-t border-amber-200/90 bg-[#fdfbf7] shadow-[0_-4px_24px_rgba(69,26,3,0.12)]">
            {/* 把手与关闭 */}
            <div className="flex items-center justify-between px-4 pt-3 pb-2">
              <div className="flex items-center gap-2">
                <div className="h-1 w-10 rounded-full bg-amber-200" />
                <span className="text-xs font-medium text-amber-600">节点详情</span>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-amber-700 transition hover:bg-amber-100"
                aria-label="关闭"
                title="关闭"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path
                    fillRule="evenodd"
                    d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            {/* 内容区 */}
            <div className="scrollbar-hide max-h-[42vh] overflow-y-auto px-4 pb-6 pt-1">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function HowToReadCard() {
  return (
    <div className="h-full">
      <h2 className="mb-4 text-lg font-bold text-[#451a03]">如何阅读这张图？</h2>
      <ul className="space-y-3 text-sm leading-relaxed text-amber-800/90">
        <li className="flex gap-2"><span className="text-amber-600">●</span><span>节点大小代表人物在《唐朝演义》中的出场次数</span></li>
        <li className="flex gap-2"><span className="text-amber-600">●</span><span>节点颜色代表人物类型</span></li>
        <li className="flex gap-2"><span className="text-amber-600">●</span><span>核心人物星图展示高频人物的权力板块</span></li>
        <li className="flex gap-2"><span className="text-amber-600">●</span><span>事件局势图展示一场历史风云中的入局人物</span></li>
        <li className="flex gap-2"><span className="text-amber-600">●</span><span>人物邻域图可以从一个人物追踪相关事件与同局人物</span></li>
        <li className="flex gap-2"><span className="text-amber-600">●</span><span>点击节点可查看详情</span></li>
      </ul>
    </div>
  );
}

function CharacterDetailPanel({
  character: c,
  stats,
}: {
  character: Character;
  stats: { coreEventCount: number; bookEventCount: number; coActorCount: number; peopleCount?: number; type?: string; importance?: number };
}) {
  return (
    <>
      <div className="mb-5 flex items-start gap-4">
        <CharacterAvatar character={c} size="xl" />
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-black text-[#451a03]">{c.name}</h2>
          </div>
          <div className="mb-2 flex flex-wrap gap-1.5">
            <TangTag variant="category">{c.primaryCategory}</TangTag>
            {c.subCategory && <TangTag variant="default">{c.subCategory}</TangTag>}
          </div>
          <p className="text-sm text-amber-800/85">{c.role}</p>
        </div>
      </div>

      <p className="mb-5 leading-relaxed text-amber-900/90">{c.summary}</p>

      {c.cardPath && (
        <Link href={`/characters/${c.id}`} className="mb-5 block overflow-hidden rounded-xl border border-amber-200/80 transition hover:border-amber-400">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.cardPath}
            alt={c.name}
            loading="lazy"
            decoding="async"
            className="h-auto w-full max-h-48 object-cover object-top"
          />
        </Link>
      )}

      {c.aliases && c.aliases.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {c.aliases.slice(0, 8).map((alias) => (
            <TangTag key={alias} variant="alias">
              {alias}
            </TangTag>
          ))}
        </div>
      )}

      <div className="mb-5 grid grid-cols-2 gap-3 text-sm">
        <StatBox label="分类" value={c.primaryCategory} />
        <StatBox label="历史影响力" value={String(c.historicalImportanceScore ?? "-")} />
        <StatBox label="出场次数" value={String(c.mentions)} />
        <StatBox label="核心事件" value={`${stats.coreEventCount} 个`} />
        <StatBox label="全书事件" value={`${stats.bookEventCount} 个`} />
        <StatBox label="同局人物" value={`${stats.coActorCount} 人`} />
      </div>

      <Link
        href={`/characters/${c.id}`}
        className="inline-block rounded-lg bg-amber-800 px-4 py-2 text-sm text-white transition hover:bg-[#451a03]"
      >
        查看完整详情 →
      </Link>
    </>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-amber-100/80 bg-amber-50/50 p-3">
      <span className="block text-xs text-amber-600">{label}</span>
      <span className="text-base font-semibold text-[#451a03]">{value}</span>
    </div>
  );
}

function EventDetailPanel({
  event: evt,
  stats,
}: {
  event: HistoricalEvent | BookTimelineEvent;
  stats: { peopleCount: number; type: string; importance: number; coreEventCount?: number; bookEventCount?: number; coActorCount?: number };
}) {
  const isCore = "consequences" in evt;
  const title = "title" in evt ? evt.title : (evt as any).title;
  const period = "period" in evt ? evt.period : (evt as any).period;
  const year = "year" in evt ? evt.year : (evt as any).year;
  const summary = "summary" in evt ? evt.summary : (evt as any).summary;
  const consequences = isCore ? (evt as HistoricalEvent).consequences : undefined;
  const people = isCore ? (evt as HistoricalEvent).characters.map((c) => c.name) : (evt as BookTimelineEvent).people;

  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <div className="h-8 w-1 bg-amber-600" />
        <h2 className="text-xl font-bold text-[#451a03]">{title}</h2>
      </div>
      <p className="mb-4 text-sm text-amber-700">
        {period} · {year}
      </p>
      <p className="mb-4 leading-relaxed text-amber-900/90">{summary}</p>

      <div className="mb-5 grid grid-cols-2 gap-3 text-sm">
        <StatBox label="事件类型" value={stats.type} />
        <StatBox label="重要程度" value={`${stats.importance} / 5`} />
        <StatBox label="入局人物" value={`${stats.peopleCount} 人`} />
      </div>

      {consequences && (
        <div className="mb-4 rounded-lg border border-amber-100/80 bg-amber-50/50 p-3">
          <span className="mb-1 block text-xs font-semibold text-amber-700">历史影响</span>
          <p className="text-sm leading-relaxed text-amber-900/90">{consequences}</p>
        </div>
      )}

      <div className="mb-6 text-sm">
        <span className="mb-2 block text-xs text-amber-600">相关人物</span>
        <div className="flex flex-wrap gap-2">
          {people.map((name, idx) => (
            <TangTag key={idx} variant="alias">
              {name}
            </TangTag>
          ))}
        </div>
      </div>

      {isCore ? (
        <Link
          href="/timeline"
          className="inline-block rounded-lg bg-amber-800 px-4 py-2 text-sm text-white transition hover:bg-[#451a03]"
        >
          查看事件复盘 →
        </Link>
      ) : (
        <Link
          href="/chronicle"
          className="inline-block rounded-lg bg-amber-100 px-4 py-2 text-sm text-amber-800 transition hover:bg-amber-200"
        >
          前往全书年表 →
        </Link>
      )}
    </>
  );
}
